import { Schema, model } from "mongoose";

const bidSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Freelancer ID is required"],
    },
    bidAmount: {
      type: Number,
      required: [true, "Bid amount is required"],
      min: [1, "Bid amount must be greater than 0"],
    },
    estimatedDays: {
      type: Number,
      required: [true, "Estimated completion days are required"],
      min: [1, "Estimated days must be at least 1"],
    },
    proposal: {
      type: String,
      required: [true, "Proposal text is required"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  }
);

bidSchema.index({ projectId: 1, freelancerId: 1 }, { unique: true });

export const BidModel = model("Bid", bidSchema);
