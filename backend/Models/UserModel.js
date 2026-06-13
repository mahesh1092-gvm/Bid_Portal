import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email required"],
      unique: [true, "Email already existed"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password required"],
    },
    role: {
      type: String,
      enum: ["CLIENT", "FREELANCER", "ADMIN"],
      required: [true, "Invalid role"],
    },
    bio: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    linkedinUrl: {
      type: String,
      default: "",
    },
    portfolioUrl: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    education: {
      type: String,
      default: "",
    },
    portfolio: [
      {
        title: { type: String, required: true },
        url: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    reliabilityScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    completedProjects: {
      type: Number,
      default: 0,
    },
    cancelledProjects: {
      type: Number,
      default: 0,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    isUserActive:{
        type:Boolean,
        default:true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  },
);

//create model
export const UserModel = model("User", userSchema);
