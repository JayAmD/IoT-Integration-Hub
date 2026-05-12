import Device from "../../models/device.model.js";
import { publishUdpConfigChanged } from "../../services/rabbit.service.js";

const createDevice = async (req, res, next) => {
  try {
    const device = await Device.create({
      ...req.body,
      tenantId: req.currentTenant._id,
      lastSeenAt: null
    });

    try {
      await publishUdpConfigChanged({ reason: "device.create" });
    } catch (publishError) {
      console.error("[DeviceCreate] Failed to publish udp config notification:", publishError.message);
    }

    res.status(201).json({ success: true, data: device });
  } catch (e) {
    next(e);
  }
};

export default createDevice;
