import { Router } from "express";

import authenticate from "../middlewares/auth.middleware.js";

import createTenant from "../controllers/tenant/create.js";
import listTenants from "../controllers/tenant/list.js";
import getTenantDetail from "../controllers/tenant/getDetail.js";
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
tenantRouter.get("/:tenantId", authenticate, getTenantDetail);

// Delete tenant
tenantRouter.delete("/:tenantId", authenticate, deleteTenant);

// Add member to tenant
tenantRouter.post("/:tenantId/members", authenticate, addMember);

// Remove member from tenant
tenantRouter.delete("/:tenantId/members/:userId", authenticate, removeMember);

// Update member role
tenantRouter.patch("/:tenantId/members/:userId", authenticate, updateMemberRole);

export default tenantRouter;
