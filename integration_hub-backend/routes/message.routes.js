import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import authorizeTenant from "../middlewares/tenant.middleware.js";

import listMessages from "../controllers/message/list.js";
import getMessageDetail from "../controllers/message/getDetail.js";

const messageRouter = Router({ mergeParams: true });

// GET /api/v1/tenants/:tenantId/messages
messageRouter.get(
  "/", 
  authenticate, 
  authorizeTenant(["owner", "admin", "viewer"]), 
  listMessages
);

// GET /api/v1/tenants/:tenantId/messages/:id
messageRouter.get(
  "/:id", 
  authenticate, 
  authorizeTenant(["owner", "admin", "viewer"]), 
  getMessageDetail
);

export default messageRouter;
