import { Schema, model } from "mongoose";

const projectSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Client ID is required"],
    },
    title: {
      type: String,
      required: [true, "Project title is required"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [1, "Budget must be greater than 0"],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    status: {
      type: String,
      enum: ["open", "assigned", "in_progress", "submitted", "completed", "cancelled", "overdue"],
      default: "open",
    },
    category: {
      type: String,
      default: "General",
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    selectedFreelancerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    acceptedBidId: {
      type: Schema.Types.ObjectId,
      ref: "Bid",
    },
    attachmentUrl: {
      type: String,
      default: "",
    },
    submittedWork: {
      url: { type: String, default: "" },
      note: { type: String, default: "" },
      submittedAt: { type: Date },
      revisionMessage: { type: String, default: "" },
    },
    milestones: [
      {
        title: { type: String, required: [true, "Milestone title is required"] },
        amount: { type: Number, required: [true, "Milestone amount is required"] },
        status: {
          type: String,
          enum: ["pending", "completed"],
          default: "pending",
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  }
);

export const ProjectModel = model("Project", projectSchema);
