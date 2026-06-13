import exp from "express";
import { UserModel } from "../Models/UserModel.js";
import { hash, compare } from "bcryptjs";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";
import { ReviewModel } from "../Models/ReviewModel.js";
config();
export const userApp = exp.Router();

const publicUserFields = "-password";

const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  return userObj;
};

// Register (CLIENT or FREELANCER)
userApp.post("/register", upload.single("profileImage"), async (req, res, next) => {
  let cloudinaryResult;
  try {
    const allowedRoles = ["CLIENT", "FREELANCER"];
    const newUser = req.body;

    // Role validation
    if (!allowedRoles.includes(newUser.role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (!newUser.name || !newUser.email || !newUser.password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // Upload profile image if provided
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      newUser.profileImage = cloudinaryResult?.secure_url;
    }

    // Hash password
    newUser.password = await hash(newUser.password, 12);
    if (typeof newUser.skills === "string") {
      newUser.skills = newUser.skills.split(",").map((skill) => skill.trim()).filter(Boolean);
    }

    // Save user
    const newUserDoc = new UserModel(newUser);
    await newUserDoc.save();

    res.status(201).json({ message: "User registered successfully", payload: sanitizeUser(newUserDoc) });
  } catch (err) {
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }
    next(err);
  }
});

// Login
userApp.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid email" });

  const isMatched = await compare(password, user.password);
  if (!isMatched) return res.status(400).json({ message: "Invalid password" });

  // Create JWT
  const signedToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      profileImage: user.profileImage,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  // Set cookie
  res.cookie("token", signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ message: "Login success", payload: sanitizeUser(user), token: signedToken });
});

// Logout
userApp.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logout success" });
});

// Check Auth (Page refresh)
userApp.get("/check-auth", verifyToken("CLIENT", "FREELANCER", "ADMIN"), async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id).select(publicUserFields);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Authenticated", payload: user });
  } catch (err) {
    next(err);
  }
});

// Get public profile
userApp.get("/users/:id", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id).select(publicUserFields);
    if (!user) return res.status(404).json({ message: "User not found" });
    const reviews = await ReviewModel.find({ receiverId: req.params.id })
      .populate("reviewerId", "name profileImage rating")
      .populate("projectId", "title")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "Profile fetched", payload: { user, reviews } });
  } catch (err) {
    next(err);
  }
});

// Update profile
userApp.put("/profile", verifyToken("CLIENT", "FREELANCER", "ADMIN"), upload.single("profileImage"), async (req, res, next) => {
  try {
    const updates = { ...req.body };
    delete updates.password;
    delete updates.email;
    delete updates.role;

    if (typeof updates.skills === "string") {
      updates.skills = updates.skills.split(",").map((skill) => skill.trim()).filter(Boolean);
    }
    if (typeof updates.portfolio === "string") {
      updates.portfolio = JSON.parse(updates.portfolio || "[]");
    }
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      updates.profileImage = cloudinaryResult?.secure_url;
    }

    const user = await UserModel.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select(publicUserFields);

    res.status(200).json({ message: "Profile updated successfully", payload: user });
  } catch (err) {
    next(err);
  }
});

// Dashboard
userApp.get("/dashboard", verifyToken("CLIENT", "FREELANCER", "ADMIN"), async (req, res, next) => {
  try {
    const { ProjectModel } = await import("../Models/ProjectModel.js");
    const { BidModel } = await import("../Models/BidModel.js");

    const userId = req.user.id;
    const isClient = req.user.role === "CLIENT";

    const projectIds = isClient
      ? (await ProjectModel.find({ clientId: userId }).select("_id")).map((project) => project._id)
      : [];
    const userObjectId = new Types.ObjectId(userId);

    const [totalProjectsPosted, activeProjects, completedProjects, totalBids, acceptedBids, earningsAgg] =
      await Promise.all([
        isClient ? ProjectModel.countDocuments({ clientId: userId }) : ProjectModel.countDocuments({ selectedFreelancerId: userId }),
        isClient
          ? ProjectModel.countDocuments({ clientId: userId, status: { $in: ["open", "assigned", "in_progress", "submitted"] } })
          : ProjectModel.countDocuments({ selectedFreelancerId: userId, status: { $in: ["assigned", "in_progress", "submitted"] } }),
        isClient
          ? ProjectModel.countDocuments({ clientId: userId, status: "completed" })
          : ProjectModel.countDocuments({ selectedFreelancerId: userId, status: "completed" }),
        isClient ? BidModel.countDocuments({ projectId: { $in: projectIds } }) : BidModel.countDocuments({ freelancerId: userId }),
        BidModel.countDocuments({ freelancerId: userId, status: "accepted" }),
        BidModel.aggregate([
          { $match: { freelancerId: userObjectId, status: "accepted" } },
          { $group: { _id: null, total: { $sum: "$bidAmount" } } },
        ]),
      ]);

    res.status(200).json({
      message: "Dashboard fetched",
      payload: {
        totalProjectsPosted,
        activeProjects,
        completedProjects,
        totalBids,
        acceptedBids,
        earningsOverview: earningsAgg[0]?.total || 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

userApp.get("/check-role", verifyToken("CLIENT", "FREELANCER", "ADMIN"), (req, res) => {
  res.status(200).json({ message: "Authenticated", payload: req.user });
});

// Change Password
userApp.put("/password", verifyToken("CLIENT", "FREELANCER", "ADMIN"), async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await UserModel.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatched = await compare(currentPassword, user.password);
  if (!isMatched) return res.status(400).json({ message: "Current password is incorrect" });

  if (currentPassword === newPassword) {
    return res.status(400).json({ message: "New password cannot be same as current password" });
  }

  user.password = await hash(newPassword, 12);
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});


