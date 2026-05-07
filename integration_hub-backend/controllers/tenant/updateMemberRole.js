import mongoose from "mongoose";

const updateMemberRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate user ID
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

    // authorizeTenant middleware already verified role (owner only)

    // Find member to update
    const memberToUpdate = req.currentTenant.members.find((m) =>
      m.userId.equals(userId)
    );

    if (!memberToUpdate) {
      const error = new Error("User is not a member of this tenant");
      error.statusCode = 404;
      throw error;
    }

    // Prevent removing owner role from the only owner
    if (memberToUpdate.role === "owner" && role !== "owner") {
      const ownerCount = req.currentTenant.members.filter((m) => m.role === "owner").length;
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

export default updateMemberRole;
