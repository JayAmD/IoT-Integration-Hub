import mongoose from "mongoose";

import Tenant from "../models/tenant.model.js";

const authorizeTenant = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const { tenantId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(tenantId)) {
        const error = new Error("Invalid tenant ID");
        error.statusCode = 400;
        throw error;
      }

      const tenant = await Tenant.findById(tenantId);

      if (!tenant) {
        const error = new Error("Tenant not found");
        error.statusCode = 404;
        throw error;
      }

      const member = tenant.members.find((entry) =>
        entry.userId.equals(req.currentUser._id)
      );

      if (!member) {
        const error = new Error("Unauthorized");
        error.statusCode = 403;
        throw error;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(member.role)) {
        const error = new Error("Forbidden: insufficient tenant role");
        error.statusCode = 403;
        throw error;
      }

      req.currentTenant = tenant;
      req.currentUserTenantMembership = member;
      req.currentUserTenantRole = member.role;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorizeTenant;
