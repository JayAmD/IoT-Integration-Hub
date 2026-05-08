import { Router } from "express";

import authenticate from "../middlewares/auth.middleware.js";
import authorizeTenant from "../middlewares/tenant.middleware.js";

import createTenant from "../controllers/tenant/create.js";
import listTenants from "../controllers/tenant/list.js";
import getTenantDetail from "../controllers/tenant/getDetail.js";
import updateTenant from "../controllers/tenant/update.js";
import deleteTenant from "../controllers/tenant/delete.js";
import addMember from "../controllers/tenant/addMember.js";
import removeMember from "../controllers/tenant/removeMember.js";
import updateMemberRole from "../controllers/tenant/updateMemberRole.js";

const tenantRouter = Router();

// List all tenants for current user
tenantRouter.get("/", authenticate, listTenants);

// Create a new tenant
tenantRouter.post("/", authenticate, createTenant);

// Get tenant detail
tenantRouter.get("/:tenantId", authenticate, authorizeTenant(["owner", "admin", "viewer"]), getTenantDetail);

// Update tenant name / description
tenantRouter.patch("/:tenantId", authenticate, authorizeTenant(["owner", "admin"]), updateTenant);

// Delete tenant
tenantRouter.delete("/:tenantId", authenticate, authorizeTenant(["owner"]), deleteTenant);

// Add member to tenant
tenantRouter.post("/:tenantId/members", authenticate, authorizeTenant(["owner", "admin"]), addMember);

// Remove member from tenant
tenantRouter.delete("/:tenantId/members/:userId", authenticate, authorizeTenant(["owner", "admin"]), removeMember);

// Update member role
tenantRouter.patch("/:tenantId/members/:userId", authenticate, authorizeTenant(["owner"]), updateMemberRole);

export default tenantRouter;
