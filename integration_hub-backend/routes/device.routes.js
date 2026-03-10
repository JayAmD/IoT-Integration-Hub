import { Router } from "express";
import createDevice from "../services/device/create.js";
import listDevices from "../services/device/list.js";
import getDeviceDetail from "../services/device/getDetail.js";
import deleteDevice from "../services/device/delete.js";
import updateDevice from "../services/device/update.js";

const deviceRouter = Router();

deviceRouter.get("/", listDevices);

deviceRouter.get("/:id", getDeviceDetail);

deviceRouter.post("/", createDevice);

deviceRouter.put("/:id", updateDevice);

deviceRouter.delete("/:id", deleteDevice);

export default deviceRouter;
