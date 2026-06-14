import { Router } from "express";
import User from "../models/userModel.js";
import verifyLogin from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadFileMiddleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const UserRouter = Router();
const auth = verifyLogin;

// ─── Cookie options ───────────────────────────────────────────────────────────
const cookieOptions = {
  httpOnly: true,   // JS can't access — protects against XSS
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "strict",
};

const accessTokenCookieOptions = {
  ...cookieOptions,
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshTokenCookieOptions = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ─── Helper: generate both tokens and save refresh token to DB ────────────────
const generateTokensAndSetCookies = async (user, res) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token in DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  return { accessToken, refreshToken };
};

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

    const { accessToken, refreshToken } = await generateTokensAndSetCookies(user, res);

    res.status(201).json({
      message: "User registered successfully",
      accessToken, // also sent in body for clients that prefer header-based auth
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

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { accessToken } = await generateTokensAndSetCookies(user, res);

    res.json({
      message: "Login successful",
      accessToken,
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

// ─── Refresh access token ─────────────────────────────────────────────────────
UserRouter.post("/refresh-token", async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    // Find user and check token matches what's stored
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({ message: "Refresh token mismatch or user not found" });
    }

    const { accessToken } = await generateTokensAndSetCookies(user, res);

    res.json({ message: "Token refreshed", accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ─── Logout ───────────────────────────────────────────────────────────────────
UserRouter.post("/logout", auth, async (req, res) => {
  try {
    // Clear refresh token from DB
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

    // Clear cookies
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
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
        online: req.user.isOnline,
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
      .select("username email avatar isOnline")
      .lean();

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default UserRouter;