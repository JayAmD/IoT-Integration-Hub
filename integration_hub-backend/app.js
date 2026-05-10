import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { PORT, CORS_ORIGIN } from "./config/env.js";

import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import tenantRouter from "./routes/tenant.routes.js";
import deviceRouter from "./routes/device.routes.js";
import endpointRouter from "./routes/endpoint.routes.js";
import groupRouter from "./routes/group.routes.js";
import credentialRouter from "./routes/credential.routes.js";
import messageRouter from "./routes/message.routes.js";
import userRouter from "./routes/user.routes.js";

import addMessage from "./controllers/udp-server/addMessage.js";

import { startIngestionConsumer } from "./services/messageIngestion.service.js";
import { startDispatcherWorker } from "./services/dispatcher.service.js";

const app = express();

app.use(cors({
  origin: CORS_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tenants", tenantRouter);
app.use("/api/v1/tenants/:tenantId/devices", deviceRouter);
app.use("/api/v1/tenants/:tenantId/groups", groupRouter);
app.use("/api/v1/tenants/:tenantId/endpoints", endpointRouter);
app.use("/api/v1/tenants/:tenantId/credentials", credentialRouter)
app.use("/api/v1/tenants/:tenantId/messages", messageRouter);
app.use("/api/v1/users", userRouter);

app.use("/api/v1/udp-server/messages/:deviceId", addMessage);

app.use(errorMiddleware)

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  await connectToDatabase();
  
  // Start RabbitMQ Consumers
  await startIngestionConsumer();
  await startDispatcherWorker();
});

export default app;