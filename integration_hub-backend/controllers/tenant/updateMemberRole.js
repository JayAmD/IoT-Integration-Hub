import mongoose from "mongoose";
import Tenant from "../../models/tenant.model.js";

const updateMemberRole = async (req, res, next) => {
  try {
    const { tenantId, userId } = req.params;
    const { role } = req.body;
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

    // Validate role
    if (!["owner", "admin", "viewer"].includes(role)) {
      const error = new Error(
        "Invalid role. Must be one of: owner, admin, viewer"
      );
      error.statusCode = 400;
      throw error;
    }

    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      const error = new Error("Tenant not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if current user is owner
    const currentMember = tenant.members.find((m) =>
      m.userId.equals(currentUserId)
    );

    if (!currentMember || currentMember.role !== "owner") {
      const error = new Error("Unauthorized: only owner can change member roles");
      error.statusCode = 403;
      throw error;
    }

    // Find member to update
    const memberToUpdate = tenant.members.find((m) =>
      m.userId.equals(userId)
    );

    if (!memberToUpdate) {
      const error = new Error("User is not a member of this tenant");
      error.statusCode = 404;
      throw error;
    }

    // Prevent removing owner role from the only owner
    if (memberToUpdate.role === "owner" && role !== "owner") {
      const ownerCount = tenant.members.filter((m) => m.role === "owner").length;
      if (ownerCount === 1) {
        const error = new Error(
          "Cannot demote the only owner. Assign another owner first."
        );
        error.statusCode = 409;
        throw error;
      }
    }

    // Update role
    memberToUpdate.role = role;
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

export default updateMemberRole;
