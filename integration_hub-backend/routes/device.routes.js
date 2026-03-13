import { Router } from "express";

import validate from "../middlewares/validate.middleware.js";
import { deviceCreateSchema, deviceGetSchema, deviceListSchema, deviceUpdateSchema, deviceDeleteSchema } from "../validation/device.schemas.js";

import createDevice from "../services/device/create.js";
import listDevices from "../services/device/list.js";
import getDeviceDetail from "../services/device/getDetail.js";
import deleteDevice from "../services/device/delete.js";
import updateDevice from "../services/device/update.js";

const deviceRouter = Router();

deviceRouter.get("/", validate(deviceListSchema), listDevices);

deviceRouter.get("/:id", validate(deviceGetSchema), getDeviceDetail);

deviceRouter.post("/", validate(deviceCreateSchema), createDevice);

deviceRouter.put("/:id", validate(deviceUpdateSchema), updateDevice);

deviceRouter.delete("/:id", validate(deviceDeleteSchema), deleteDevice);

export default deviceRouter;
