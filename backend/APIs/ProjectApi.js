import exp from "express";
import { ProjectModel } from "../Models/ProjectModel.js";
import { BidModel } from "../Models/BidModel.js";
import { NotificationModel } from "../Models/NotificationModel.js";
import { UserModel } from "../Models/UserModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const projectApp = exp.Router();

const userPublicFields = "name email rating profileImage bio skills education portfolio githubUrl linkedinUrl portfolioUrl reliabilityScore completedProjects cancelledProjects totalReviews";

const parseList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
};

const refreshReliability = async (freelancerId) => {
  if (!freelancerId) return;
  const [completed, cancelled] = await Promise.all([
    ProjectModel.countDocuments({ selectedFreelancerId: freelancerId, status: "completed" }),
    ProjectModel.countDocuments({ selectedFreelancerId: freelancerId, status: "cancelled" }),
  ]);
  const total = completed + cancelled;
  await UserModel.findByIdAndUpdate(freelancerId, {
    completedProjects: completed,
    cancelledProjects: cancelled,
    reliabilityScore: total ? Math.round((completed / total) * 100) : 100,
  });
};

projectApp.post("/", verifyToken("CLIENT"), async (req, res, next) => {
  try {
    const projectDoc = await ProjectModel.create({
      ...req.body,
      clientId: req.user.id,
      skillsRequired: parseList(req.body.skillsRequired),
    });

    res.status(201).json({ message: "Project created successfully", payload: projectDoc });
  } catch (err) {
    next(err);
  }
});

projectApp.get("/", async (req, res, next) => {
  try {
    const { q, status, category, minBudget, maxBudget, skill } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }
    if (status) filter.status = status;
    if (category) filter.category = { $regex: category, $options: "i" };
    if (skill) filter.skillsRequired = { $in: [new RegExp(skill, "i")] };
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = Number(minBudget);
      if (maxBudget) filter.budget.$lte = Number(maxBudget);
    }

    const projects = await ProjectModel.find(filter)
      .populate("clientId", "name email rating profileImage")
      .populate("selectedFreelancerId", userPublicFields)
      .sort({ createdAt: -1 });

    const projectsWithBids = await Promise.all(
      projects.map(async (project) => {
        const bidCount = await BidModel.countDocuments({ projectId: project._id });
        const projectObj = project.toObject();
        projectObj.bidCount = bidCount;
        return projectObj;
      })
    );

    res.status(200).json({ message: "Projects fetched successfully", payload: projectsWithBids });
  } catch (err) {
    next(err);
  }
});

projectApp.get("/mine", verifyToken("CLIENT", "FREELANCER"), async (req, res, next) => {
  try {
    const filter = req.user.role === "CLIENT" ? { clientId: req.user.id } : { selectedFreelancerId: req.user.id };
    const projects = await ProjectModel.find(filter)
      .populate("clientId", "name email rating profileImage")
      .populate("selectedFreelancerId", userPublicFields)
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "My projects fetched", payload: projects });
  } catch (err) {
    next(err);
  }
});

projectApp.get("/:id", async (req, res, next) => {
  try {
    const project = await ProjectModel.findById(req.params.id)
      .populate("clientId", "name email rating profileImage")
      .populate("selectedFreelancerId", userPublicFields);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const bids = await BidModel.find({ projectId: project._id })
      .populate("freelancerId", userPublicFields)
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Project fetched successfully", payload: { project, bids } });
  } catch (err) {
    next(err);
  }
});

projectApp.put("/:id", verifyToken("CLIENT"), async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.skillsRequired) updates.skillsRequired = parseList(updates.skillsRequired);

    const project = await ProjectModel.findOneAndUpdate(
      { _id: req.params.id, clientId: req.user.id, status: "open" },
      updates,
      { new: true, runValidators: true }
    );

    if (!project) return res.status(404).json({ message: "Project not found, not authorized, or no longer editable" });

    res.status(200).json({ message: "Project updated successfully", payload: project });
  } catch (err) {
    next(err);
  }
});

projectApp.patch("/:id/start", verifyToken("FREELANCER"), async (req, res, next) => {
  try {
    const project = await ProjectModel.findOneAndUpdate(
      { _id: req.params.id, selectedFreelancerId: req.user.id, status: "assigned" },
      { status: "in_progress" },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found or cannot be started" });

    res.status(200).json({ message: "Project started", payload: project });
  } catch (err) {
    next(err);
  }
});

projectApp.patch("/:id/submit", verifyToken("FREELANCER"), async (req, res, next) => {
  try {
    const project = await ProjectModel.findOneAndUpdate(
      { _id: req.params.id, selectedFreelancerId: req.user.id, status: { $in: ["assigned", "in_progress"] } },
      {
        status: "submitted",
        submittedWork: {
          url: req.body.url || "",
          note: req.body.note || "",
          submittedAt: new Date(),
          revisionMessage: "",
        },
      },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found or cannot be submitted" });

    await NotificationModel.create({
      userId: project.clientId,
      title: "Project submitted",
      message: `${project.title} was submitted for review.`,
      type: "PROJECT_SUBMITTED",
      link: `/projects/${project._id}`,
    });

    res.status(200).json({ message: "Project submitted", payload: project });
  } catch (err) {
    next(err);
  }
});

projectApp.patch("/:id/request-revision", verifyToken("CLIENT"), async (req, res, next) => {
  try {
    const project = await ProjectModel.findOneAndUpdate(
      { _id: req.params.id, clientId: req.user.id, status: "submitted" },
      {
        status: "in_progress",
        "submittedWork.revisionMessage": req.body.message || "Please revise the submitted work.",
      },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found or cannot request revision" });

    await NotificationModel.create({
      userId: project.selectedFreelancerId,
      title: "Revision requested",
      message: `Revision requested for ${project.title}.`,
      type: "SYSTEM",
      link: `/projects/${project._id}`,
    });

    res.status(200).json({ message: "Revision requested", payload: project });
  } catch (err) {
    next(err);
  }
});

projectApp.patch("/:id/complete", verifyToken("CLIENT"), async (req, res, next) => {
  try {
    const project = await ProjectModel.findOneAndUpdate(
      { _id: req.params.id, clientId: req.user.id, status: "submitted" },
      { status: "completed" },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found or cannot be completed" });

    await refreshReliability(project.selectedFreelancerId);
    await NotificationModel.create({
      userId: project.selectedFreelancerId,
      title: "Project completed",
      message: `${project.title} was approved and completed.`,
      type: "PROJECT_COMPLETED",
      link: `/projects/${project._id}`,
    });

    res.status(200).json({ message: "Project marked completed", payload: project });
  } catch (err) {
    next(err);
  }
});

projectApp.patch("/:id/cancel", verifyToken("CLIENT"), async (req, res, next) => {
  try {
    const project = await ProjectModel.findOneAndUpdate(
      { _id: req.params.id, clientId: req.user.id, status: { $nin: ["completed", "cancelled"] } },
      { status: "cancelled" },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found or cannot be cancelled" });

    await refreshReliability(project.selectedFreelancerId);
    res.status(200).json({ message: "Project cancelled", payload: project });
  } catch (err) {
    next(err);
  }
});

projectApp.delete("/:id", verifyToken("CLIENT"), async (req, res, next) => {
  try {
    const project = await ProjectModel.findOneAndDelete({ _id: req.params.id, clientId: req.user.id, status: "open" });
    if (!project) return res.status(404).json({ message: "Project not found, not authorized, or no longer deletable" });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    next(err);
  }
});
