import User from "../../models/user.model.js";
import Tenant from "../../models/tenant.model.js";

const deleteMe = async (req, res, next) => {
  try {
    const userId = req.currentUser._id;

    // 1. Check for "Sole Owner" constraint
    // Find all tenants where this user is a member
    const tenants = await Tenant.find({ "members.userId": userId });

    for (const tenant of tenants) {
      const owners = tenant.members.filter(m => m.role === 'owner');
      
      // If user is an owner, check if they are the ONLY owner
      const isOwner = owners.some(o => o.userId.toString() === userId.toString());
      
      if (isOwner && owners.length === 1) {
        const error = new Error(`Cannot delete account. You are the sole owner of tenant "${tenant.name}". Please transfer ownership or delete the tenant first.`);
        error.statusCode = 400;
        throw error;
      }
    }

    // 2. Remove user from all tenant memberships
    await Tenant.updateMany(
      { "members.userId": userId },
      { $pull: { members: { userId: userId } } }
    );

    // 3. Delete the user document
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User account and all memberships deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

export default deleteMe;
