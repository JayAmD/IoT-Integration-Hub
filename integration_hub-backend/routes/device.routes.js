import { Router } from "express";

import validate from "../middlewares/validate.middleware.js";
import { deviceCreateSchema, deviceGetSchema, deviceListSchema, deviceUpdateSchema, deviceDeleteSchema } from "../validation/device.schemas.js";

import authenticate from "../middlewares/auth.middleware.js";

import createDevice from "../controllers/device/create.js";
import listDevices from "../controllers/device/list.js";
import getDeviceDetail from "../controllers/device/getDetail.js";
import deleteDevice from "../controllers/device/delete.js";
import updateDevice from "../controllers/device/update.js";

const deviceRouter = Router();

deviceRouter.get("/", validate(deviceListSchema), authenticate, listDevices);

deviceRouter.get("/:id", validate(deviceGetSchema), authenticate, getDeviceDetail);

deviceRouter.post("/", validate(deviceCreateSchema), authenticate, createDevice);

deviceRouter.patch("/:id", validate(deviceUpdateSchema), authenticate, updateDevice);

deviceRouter.delete("/:id", validate(deviceDeleteSchema), authenticate, deleteDevice);

export default deviceRouter;
