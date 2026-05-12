import Device from "../../models/device.model.js";

const getUdpConfig = async (req, res, next) => {
  try {
    const devices = await Device.find({}, { _id: 1, serialNumber: 1, claimToken: 1 })
      .sort({ _id: 1 })
      .lean();

    const formattedDevices = devices.map((device) => ({
      id: String(device._id),
      serialNumber: Number(device.serialNumber),
      claimToken: device.claimToken,
      decoder: "clime-decoder.yaml", // Static POC value
    }));

    res.status(200).json({
      success: true,
      data: {
        updatedAt: new Date().toISOString(),
        devices: formattedDevices,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getUdpConfig;