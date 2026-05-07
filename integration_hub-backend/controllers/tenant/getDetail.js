import mongoose from "mongoose";
import Tenant from "../../models/tenant.model.js";

const getTenantDetail = async (req, res, next) => {
  try {
    const { tenantId } = req.params;
    const userId = req.user._id;

    // Validate tenantId format
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      const error = new Error("Invalid tenant ID");
      error.statusCode = 400;
      throw error;
    }

    const tenant = await Tenant.findById(tenantId).populate(
      "members.userId",
      "email"
    );

    if (!tenant) {
      const error = new Error("Tenant not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if user is a member of this tenant
    const isMember = tenant.members.some((member) =>
      member.userId._id.equals(userId)
    );

    if (!isMember) {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: tenant,
    });
  } catch (e) {
    next(e);
  }
};

export default getTenantDetail;
