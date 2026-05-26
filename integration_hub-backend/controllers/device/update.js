import Device from "../../models/device.model.js";
import { publishUdpConfigChanged } from "../../services/rabbit.service.js";

const updateDevice = async (req, res, next) => {
  try {
    const device = await Device.findOne({
      _id: req.params.id,
      tenantId: req.currentTenant._id,
    });

    if (!device) {
      const error = new Error("Device Not Found");
      error.statusCode = 404;
      throw error;
    }

    const updatedDevice = await Device.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.currentTenant._id },
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    const claimTokenChanged =
      Object.prototype.hasOwnProperty.call(req.body, "claimToken") &&
      device.claimToken !== updatedDevice.claimToken;

    if (claimTokenChanged) {
      try {
        await publishUdpConfigChanged({ reason: "device.update.claimToken" });
        console.log("[DeviceUpdate] Published udp config notification - Claim Token Changed");
      } catch (publishError) {
        console.error("[DeviceUpdate] Failed to publish udp config notification:", publishError.message);
      }
    }

    res.status(200).json({ success: true, data: updatedDevice });
  } catch (e) {
    next(e);
  }
};

export default updateDevice;