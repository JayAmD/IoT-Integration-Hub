import Device from "../../models/device.model.js";

const listDevices = async (req, res, next) => {
  try {
    const devices = await Device.find();
    res.status(200).json({ success: true, data: devices });
  } catch (e) {
    next(e);
  }
};

export default listDevices;