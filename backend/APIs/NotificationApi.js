import exp from "express";
import { NotificationModel } from "../Models/NotificationModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const notificationApp = exp.Router();

notificationApp.get("/", verifyToken("CLIENT", "FREELANCER", "ADMIN"), async (req, res, next) => {
  try {
    const notifications = await NotificationModel.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ message: "Notifications fetched", payload: notifications });
  } catch (err) {
    next(err);
  }
});

notificationApp.patch("/:id/read", verifyToken("CLIENT", "FREELANCER", "ADMIN"), async (req, res, next) => {
  try {
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.status(200).json({ message: "Notification marked as read", payload: notification });
  } catch (err) {
    next(err);
  }
});
