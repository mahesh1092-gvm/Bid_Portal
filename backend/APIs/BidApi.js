import exp from "express";
import { BidModel } from "../Models/BidModel.js";
import { ProjectModel } from "../Models/ProjectModel.js";
import { NotificationModel } from "../Models/NotificationModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const bidApp = exp.Router();

const freelancerFields = "name email bio skills education portfolio profileImage githubUrl linkedinUrl portfolioUrl rating reliabilityScore completedProjects cancelledProjects totalReviews";

bidApp.post("/", verifyToken("FREELANCER"), async (req, res, next) => {
  try {
    const { projectId, bidAmount, estimatedDays, proposal } = req.body;
    const project = await ProjectModel.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.status !== "open") return res.status(400).json({ message: "Project is not open for bidding" });
    if (project.clientId.toString() === req.user.id) return res.status(400).json({ message: "You cannot bid on your own project" });

    const bid = await BidModel.create({
      projectId,
      freelancerId: req.user.id,
      bidAmount,
      estimatedDays,
      proposal,
    });

    await NotificationModel.create({
      userId: project.clientId,
      title: "New bid received",
      message: `A freelancer bid on ${project.title}.`,
      type: "BID_RECEIVED",
      link: `/projects/${project._id}`,
    });

    res.status(201).json({ message: "Bid submitted successfully", payload: bid });
  } catch (err) {
    next(err);
  }
});

bidApp.get("/mine", verifyToken("FREELANCER"), async (req, res, next) => {
  try {
    const bids = await BidModel.find({ freelancerId: req.user.id })
      .populate("projectId", "title budget deadline status")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "My bids fetched", payload: bids });
  } catch (err) {
    next(err);
  }
});

bidApp.get("/project/:projectId", verifyToken("CLIENT", "FREELANCER"), async (req, res, next) => {
  try {
    const project = await ProjectModel.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const canView = req.user.role === "FREELANCER" || project.clientId.toString() === req.user.id;
    if (!canView) return res.status(403).json({ message: "You are not authorized" });

    const bids = await BidModel.find({ projectId: req.params.projectId })
      .populate("freelancerId", freelancerFields)
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Project bids fetched", payload: bids });
  } catch (err) {
    next(err);
  }
});

bidApp.put("/:id", verifyToken("FREELANCER"), async (req, res, next) => {
  try {
    const { bidAmount, estimatedDays, proposal } = req.body;
    const bid = await BidModel.findOneAndUpdate(
      { _id: req.params.id, freelancerId: req.user.id, status: "pending" },
      { bidAmount, estimatedDays, proposal },
      { new: true, runValidators: true }
    );
    if (!bid) return res.status(404).json({ message: "Pending bid not found or cannot be updated" });

    res.status(200).json({ message: "Bid updated", payload: bid });
  } catch (err) {
    next(err);
  }
});

bidApp.patch("/:id/withdraw", verifyToken("FREELANCER"), async (req, res, next) => {
  try {
    const bid = await BidModel.findOneAndUpdate(
      { _id: req.params.id, freelancerId: req.user.id, status: "pending" },
      { status: "withdrawn" },
      { new: true }
    );
    if (!bid) return res.status(404).json({ message: "Pending bid not found or cannot be withdrawn" });

    res.status(200).json({ message: "Bid withdrawn", payload: bid });
  } catch (err) {
    next(err);
  }
});

bidApp.patch("/:id/status", verifyToken("CLIENT"), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be accepted or rejected" });
    }

    const bid = await BidModel.findById(req.params.id).populate("projectId");
    if (!bid) return res.status(404).json({ message: "Bid not found" });
    if (bid.projectId.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized" });
    }
    if (bid.projectId.status !== "open") {
      return res.status(400).json({ message: "Project is already assigned or closed" });
    }

    bid.status = status;
    await bid.save();

    if (status === "accepted") {
      await ProjectModel.findByIdAndUpdate(bid.projectId._id, {
        status: "assigned",
        selectedFreelancerId: bid.freelancerId,
        acceptedBidId: bid._id,
      });
      await BidModel.updateMany(
        { projectId: bid.projectId._id, _id: { $ne: bid._id }, status: "pending" },
        { status: "rejected" }
      );
    }

    await NotificationModel.create({
      userId: bid.freelancerId,
      title: status === "accepted" ? "Bid accepted" : "Bid rejected",
      message: `Your bid for ${bid.projectId.title} was ${status}.`,
      type: status === "accepted" ? "BID_ACCEPTED" : "BID_REJECTED",
      link: `/projects/${bid.projectId._id}`,
    });

    res.status(200).json({ message: `Bid ${status}`, payload: bid });
  } catch (err) {
    next(err);
  }
});
