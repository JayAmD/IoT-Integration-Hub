import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../../config/env.js";

const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if an user with this email exists
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      data: { token, user: { _id: user._id, email: user.email } },
    });
  } catch (error) {
    next(error);
  }
};

export default logIn;
