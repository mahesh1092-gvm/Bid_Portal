import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
    milestoneId: {
      type: String,
      required: [true, "Milestone ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      min: [1, "Amount must be greater than 0"],
    },
    status: {
      type: String,
      enum: ["ESCROW", "RELEASED"],
      default: "ESCROW",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  }
);

export const TransactionModel = model("Transaction", transactionSchema);
