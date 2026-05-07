import Tenant from "../../models/tenant.model.js";

const getTenantDetail = async (req, res, next) => {
  try {
    // authorizeTenant middleware already verified membership
    const tenant = await req.currentTenant.populate("members.userId", "email");

    res.status(200).json({
      success: true,
      data: tenant,
    });
  } catch (e) {
    next(e);
  }
};

export default getTenantDetail;
