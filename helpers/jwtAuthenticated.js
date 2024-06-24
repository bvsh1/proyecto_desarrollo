import jwt from "jsonwebtoken";
import User from "../models/user.js";

const jwtAuthenticated = async (req, resp, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return resp.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SIGNATURE);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return resp.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return resp.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
  }
};

export default jwtAuthenticated;



