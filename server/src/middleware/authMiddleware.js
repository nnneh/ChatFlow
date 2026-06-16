import jwt from "jsonwebtoken";

const verifyLogin = (req, res, next) => {
  try {
    // ✅ Fixed: read accessToken (not refreshToken) from cookie or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No Token Found" });
    }

    // ✅ Fixed: verify with ACCESS_TOKEN_SECRET (not REFRESH_TOKEN_SECRET)
    const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!verifyToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    // ✅ Fixed: payload has { userId } not { _id } — matches generateRefreshToken()
    req.userID = verifyToken.userId;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid Token" });
    }

    return res.status(500).json({ message: "Internal Failure" });
  }
};

export default verifyLogin;