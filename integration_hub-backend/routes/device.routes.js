import { Router } from "express";

import validate from "../middlewares/validate.middleware.js";
import { deviceCreateSchema, deviceGetSchema, deviceListSchema, deviceUpdateSchema, deviceDeleteSchema } from "../validation/device.schemas.js";

import authenticate from "../middlewares/auth.middleware.js";
import authorizeTenant from "../middlewares/tenant.middleware.js";

import createDevice from "../controllers/device/create.js";
import listDevices from "../controllers/device/list.js";
import getDeviceDetail from "../controllers/device/getDetail.js";
import deleteDevice from "../controllers/device/delete.js";
import updateDevice from "../controllers/device/update.js";

const deviceRouter = Router({ mergeParams: true });

deviceRouter.get("/", validate(deviceListSchema), authenticate, authorizeTenant(["owner", "admin", "viewer"]), listDevices);

deviceRouter.get("/:id", validate(deviceGetSchema), authenticate, authorizeTenant(["owner", "admin", "viewer"]), getDeviceDetail);

deviceRouter.post("/", validate(deviceCreateSchema), authenticate, authorizeTenant(["owner", "admin"]), createDevice);

deviceRouter.patch("/:id", validate(deviceUpdateSchema), authenticate, authorizeTenant(["owner", "admin"]), updateDevice);

deviceRouter.delete("/:id", validate(deviceDeleteSchema), authenticate, authorizeTenant(["owner", "admin"]), deleteDevice);

export default deviceRouter;
