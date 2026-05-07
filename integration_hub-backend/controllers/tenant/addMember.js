import mongoose from "mongoose";
import Tenant from "../../models/tenant.model.js";
import User from "../../models/user.model.js";

const addMember = async (req, res, next) => {
  try {
    const { tenantId } = req.params;
    const { userId, role } = req.body;
    const currentUserId = req.user._id;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      const error = new Error("Invalid tenant ID");
      error.statusCode = 400;
      throw error;
    }

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

    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      const error = new Error("Tenant not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if current user is owner or admin
    const currentMember = tenant.members.find((m) =>
      m.userId.equals(currentUserId)
    );

    if (!currentMember || !["owner", "admin"].includes(currentMember.role)) {
      const error = new Error("Unauthorized: only owner/admin can add members");
      error.statusCode = 403;
      throw error;
    }

    // Check if user is already a member
    const alreadyMember = tenant.members.find((m) =>
      m.userId.equals(userId)
    );

    if (alreadyMember) {
      const error = new Error("User is already a member of this tenant");
      error.statusCode = 409;
      throw error;
    }

    // Add member
    tenant.members.push({
      userId,
      role: role || "viewer",
    });

    await tenant.save();

    // Populate and return updated tenant
    await tenant.populate("members.userId", "email");

    res.status(200).json({
      success: true,
      data: tenant,
    });
  } catch (e) {
    next(e);
  }
};

export default addMember;
