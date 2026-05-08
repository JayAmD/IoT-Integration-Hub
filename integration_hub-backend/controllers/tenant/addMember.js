import User from "../../models/user.model.js";

const addMember = async (req, res, next) => {
  try {
    const { email, role } = req.body;

    // Look up user by email
    const userToAdd = await User.findOne({ email: email.trim().toLowerCase() });
    if (!userToAdd) {
      const error = new Error("No user found with that email address");
      error.statusCode = 404;
      throw error;
    }

    const userId = userToAdd._id;

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
