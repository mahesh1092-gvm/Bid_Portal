import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reviewer ID is required"],
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver ID is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
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

reviewSchema.index({ projectId: 1, reviewerId: 1, receiverId: 1 }, { unique: true });

export const ReviewModel = model("Review", reviewSchema);
