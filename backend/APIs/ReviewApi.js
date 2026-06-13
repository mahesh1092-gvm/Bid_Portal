import exp from "express";
import { ReviewModel } from "../Models/ReviewModel.js";
import { ProjectModel } from "../Models/ProjectModel.js";
import { UserModel } from "../Models/UserModel.js";
import { NotificationModel } from "../Models/NotificationModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const reviewApp = exp.Router();

reviewApp.post("/", verifyToken("CLIENT", "FREELANCER"), async (req, res, next) => {
  try {
    const { projectId, receiverId, rating, comment } = req.body;
    const project = await ProjectModel.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.status !== "completed") return res.status(400).json({ message: "Reviews are allowed after project completion" });

    const participants = [project.clientId.toString(), project.selectedFreelancerId?.toString()].filter(Boolean);
    if (!participants.includes(req.user.id) || !participants.includes(receiverId) || receiverId === req.user.id) {
      return res.status(403).json({ message: "Only project participants can review each other" });
    }

    const review = await ReviewModel.create({
      projectId,
      reviewerId: req.user.id,
      receiverId,
      rating,
      comment,
    });

    const stats = await ReviewModel.aggregate([
      { $match: { receiverId: review.receiverId } },
      { $group: { _id: "$receiverId", rating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
    ]);

    await UserModel.findByIdAndUpdate(receiverId, {
      rating: Number((stats[0]?.rating || 0).toFixed(1)),
      totalReviews: stats[0]?.totalReviews || 0,
    });

    await NotificationModel.create({
      userId: receiverId,
      title: "New review received",
      message: `You received a ${rating}-star review.`,
      type: "REVIEW_RECEIVED",
      link: `/freelancers/${receiverId}`,
    });

    res.status(201).json({ message: "Review submitted", payload: review });
  } catch (err) {
    next(err);
  }
});

reviewApp.get("/user/:userId", async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find({ receiverId: req.params.userId })
      .populate("reviewerId", "name profileImage")
      .populate("projectId", "title")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "Reviews fetched", payload: reviews });
  } catch (err) {
    next(err);
  }
});
