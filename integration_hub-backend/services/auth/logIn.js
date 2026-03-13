import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (hashedPassword !== user.password) {
      const error = new Error("Invalid credentials");
      error.statusCode = 409; //TODO What is this code?
      throw error;
    }

    const token = jwt.sign({ userId: users[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

export default logIn;