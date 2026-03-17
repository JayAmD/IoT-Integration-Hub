import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { JWT_SECRET } from "../config/env.js";

// Middleware to authenticate users based on JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("No token provided");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      error.message = "Invalid or expired token";
      error.statusCode = 401;
    }
    next(error);
  }
};

export default authenticate;
