import mongoose from "mongoose";

const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new Error("Invalid user ID");
      error.statusCode = 400;
      throw error;
    }

    // authorizeTenant middleware already verified role (owner/admin)

    // Prevent removing the only owner
    const memberToRemove = req.currentTenant.members.find((m) =>
      m.userId.equals(userId)
    );

    if (!memberToRemove) {
      const error = new Error("User is not a member of this tenant");
      error.statusCode = 404;
      throw error;
    }

    if (memberToRemove.role === "owner") {
      const ownerCount = req.currentTenant.members.filter((m) => m.role === "owner").length;
      if (ownerCount === 1) {
        const error = new Error(
          "Cannot remove the only owner. Transfer ownership first."
        );
        error.statusCode = 409;
        throw error;
      }
    }

    // Remove member
    req.currentTenant.members = req.currentTenant.members.filter((m) => !m.userId.equals(userId));

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

export default removeMember;
