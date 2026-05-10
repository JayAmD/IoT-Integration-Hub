import bcrypt from "bcryptjs";
import User from "../../models/user.model.js";

const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Find user with password selected
    const user = await User.findById(req.currentUser._id).select("+password");

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      const error = new Error("Incorrect old password");
      error.statusCode = 401;
      throw error;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    next(error);
  }
};

export default updatePassword;
