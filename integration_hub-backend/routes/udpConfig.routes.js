import { Router } from "express";

import authenticateUdpServer from "../middlewares/authenticateUdpServer.middleware.js";
import getUdpConfig from "../controllers/udp-server/getConfig.js";

const udpConfigRouter = Router();

udpConfigRouter.get("/", authenticateUdpServer, getUdpConfig);

export default udpConfigRouter;