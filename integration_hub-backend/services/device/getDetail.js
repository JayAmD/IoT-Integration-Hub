import Device from "../../models/device.model.js";

const getDeviceDetail = async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.id);
    res.status(200).json({ success: true, data: device });
  } catch (e) {
    next(e);
  }
};

export default getDeviceDetail;
