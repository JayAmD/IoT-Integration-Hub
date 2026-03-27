import { Router } from "express";

import validate from "../middlewares/validate.middleware.js";
// import { deviceCreateSchema, deviceGetSchema, deviceListSchema, deviceUpdateSchema, deviceDeleteSchema } from "../validation/device.schemas.js";

import authenticate from "../middlewares/auth.middleware.js";

import createCredential from "../controllers/credential/create.js";

const credentialRouter = Router();

credentialRouter.post("/", authenticate, createCredential);


export default credentialRouter;
