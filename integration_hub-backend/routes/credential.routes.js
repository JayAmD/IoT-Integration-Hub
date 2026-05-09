import { Router } from "express";

import authenticate from "../middlewares/auth.middleware.js";
import authorizeTenant from "../middlewares/tenant.middleware.js";

import createCredential from "../controllers/credential/create.js";
import listCredentials from "../controllers/credential/list.js";
import getCredentialDetail from "../controllers/credential/getDetail.js";
import deleteCredential from "../controllers/credential/delete.js";
import updateCredential from "../controllers/credential/update.js";
import revealCredentialSecret from "../controllers/credential/reveal.js";

const credentialRouter = Router({ mergeParams: true });

// GET /api/v1/tenants/:tenantId/credentials
credentialRouter.get("/", authenticate, authorizeTenant(["owner", "admin", "viewer"]), listCredentials);

// GET /api/v1/tenants/:tenantId/credentials/:id
credentialRouter.get("/:id", authenticate, authorizeTenant(["owner", "admin", "viewer"]), getCredentialDetail);

// POST /api/v1/tenants/:tenantId/credentials/:id/reveal
credentialRouter.post("/:id/reveal", authenticate, authorizeTenant(["owner", "admin"]), revealCredentialSecret);

// POST /api/v1/tenants/:tenantId/credentials
credentialRouter.post("/", authenticate, authorizeTenant(["owner", "admin"]), createCredential);

// PATCH /api/v1/tenants/:tenantId/credentials/:id
credentialRouter.patch("/:id", authenticate, authorizeTenant(["owner", "admin"]), updateCredential);

// DELETE /api/v1/tenants/:tenantId/credentials/:id
credentialRouter.delete("/:id", authenticate, authorizeTenant(["owner", "admin"]), deleteCredential);

export default credentialRouter;
