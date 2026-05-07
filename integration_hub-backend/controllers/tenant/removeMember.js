import mongoose from "mongoose";
import Tenant from "../../models/tenant.model.js";

const removeMember = async (req, res, next) => {
  try {
    const { tenantId, userId } = req.params;
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
      const error = new Error("Unauthorized: only owner/admin can remove members");
      error.statusCode = 403;
      throw error;
    }

    // Prevent removing the only owner
    const memberToRemove = tenant.members.find((m) =>
      m.userId.equals(userId)
    );

    if (!memberToRemove) {
      const error = new Error("User is not a member of this tenant");
      error.statusCode = 404;
      throw error;
    }

    if (memberToRemove.role === "owner") {
      const ownerCount = tenant.members.filter((m) => m.role === "owner").length;
      if (ownerCount === 1) {
        const error = new Error(
          "Cannot remove the only owner. Transfer ownership first."
        );
        error.statusCode = 409;
        throw error;
      }
    }

    // Remove member
    tenant.members = tenant.members.filter((m) => !m.userId.equals(userId));

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

export default removeMember;
