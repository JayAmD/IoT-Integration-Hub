import Device from "../../models/device.model.js";

const deleteDevice = async (req, res, next) => {
  try {
    const device = await Device.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, data: device });
  } catch (e) {
    next(e);
  }
};

export default deleteDevice;
