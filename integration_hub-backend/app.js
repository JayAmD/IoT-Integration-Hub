import express from "express";
import cookieParser from "cookie-parser";

import { PORT } from "./config/env.js";

import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import deviceRouter from "./routes/device.routes.js";
import credentialRouter from "./routes/credential.routes.js";

import addMessage from "./controllers/udp-server/addMessage.js";

const app = express();

const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/devices", deviceRouter);
app.use("/api/v1/credentials", credentialRouter)

app.use("/api/v1/udp-server/messages/:deviceId", addMessage);

app.use(errorMiddleware)

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  await connectToDatabase();
});

export default app;
