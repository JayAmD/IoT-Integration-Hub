import { Router } from "express";

import validate from "../middlewares/validate.middleware.js";
// import { deviceCreateSchema, deviceGetSchema, deviceListSchema, deviceUpdateSchema, deviceDeleteSchema } from "../validation/device.schemas.js";

import authenticate from "../middlewares/auth.middleware.js";
import authorizeTenant from "../middlewares/tenant.middleware.js";

import createCredential from "../controllers/credential/create.js";

const credentialRouter = Router({ mergeParams: true });

credentialRouter.post("/", authenticate, authorizeTenant(["owner", "admin"]), createCredential);


export default credentialRouter;
