import { Router } from "express";

import validate from "../middlewares/validate.middleware.js";
import { deviceCreateSchema, deviceGetSchema, deviceListSchema, deviceUpdateSchema, deviceDeleteSchema } from "../validation/device.schemas.js";

import authenticate from "../middlewares/auth.middleware.js";

import createDevice from "../services/device/create.js";
import listDevices from "../services/device/list.js";
import getDeviceDetail from "../services/device/getDetail.js";
import deleteDevice from "../services/device/delete.js";
import updateDevice from "../services/device/update.js";

const deviceRouter = Router();

deviceRouter.get("/", validate(deviceListSchema), authenticate, listDevices);

deviceRouter.get("/:id", validate(deviceGetSchema), authenticate, getDeviceDetail);

deviceRouter.post("/", validate(deviceCreateSchema), authenticate, createDevice);

deviceRouter.put("/:id", validate(deviceUpdateSchema), authenticate, updateDevice);

deviceRouter.delete("/:id", validate(deviceDeleteSchema), authenticate, deleteDevice);

export default deviceRouter;
