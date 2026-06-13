import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
    },
    type: {
      type: String,
      enum: ["BID_RECEIVED", "BID_ACCEPTED", "BID_REJECTED", "PROJECT_SUBMITTED", "PROJECT_COMPLETED", "REVIEW_RECEIVED", "SYSTEM"],
      default: "SYSTEM",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  }
);

export const NotificationModel = model("Notification", notificationSchema);
