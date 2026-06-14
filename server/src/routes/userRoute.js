import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import verifyLogin from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadFileMiddleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; 

const UserRouter = Router();
const auth = verifyLogin;

// ─── Register ─────────────────────────────────────────────────────────────────
UserRouter.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Upload avatar to Cloudinary if provided
    let avatarUrl = null;
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      if (!result) {
        return res.status(500).json({ message: "Avatar upload failed" });
      }
      avatarUrl = result.optimizeUrl;
    }

    const user = new User({ username, email, password, avatar: avatarUrl });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ─── Login ────────────────────────────────────────────────────────────────────
UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ─── Get current user ─────────────────────────────────────────────────────────
UserRouter.get("/me", auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        online: req.user.online,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── Get all users (contact list) ─────────────────────────────────────────────
UserRouter.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("id username email avatar online")
      .lean();

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default UserRouter;