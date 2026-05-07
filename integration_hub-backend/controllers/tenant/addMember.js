import mongoose from "mongoose";
import User from "../../models/user.model.js";

const addMember = async (req, res, next) => {
  try {
    const { userId, role } = req.body;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new Error("Invalid user ID");
      error.statusCode = 400;
      throw error;
    }

    // Check if user to add exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // authorizeTenant middleware already verified role (owner/admin)

    // Check if user is already a member
    const alreadyMember = req.currentTenant.members.find((m) =>
      m.userId.equals(userId)
    );

    if (alreadyMember) {
      const error = new Error("User is already a member of this tenant");
      error.statusCode = 409;
      throw error;
    }

    // Add member to the tenant from middleware context
    req.currentTenant.members.push({
      userId,
      role: role || "viewer",
    });

    await req.currentTenant.save();

    // Populate and return updated tenant
    await req.currentTenant.populate("members.userId", "email");

    res.status(200).json({
      success: true,
      data: req.currentTenant,
    });
  } catch (e) {
    next(e);
  }
};

export default addMember;
