import Tenant from "../../models/tenant.model.js";

const listTenants = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find all tenants where the user is a member
    const tenants = await Tenant.find({
      "members.userId": userId,
    }).populate("members.userId", "email");

    res.status(200).json({
      success: true,
      data: tenants,
    });
  } catch (e) {
    next(e);
  }
};

export default listTenants;
