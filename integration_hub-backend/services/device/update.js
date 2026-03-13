import Device from "../../models/device.model.js";

const updateDevice = async (req, res, next) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    res.status(200).json({ success: true, data: device });
  } catch (e) {
    next(e);
  }
};

export default updateDevice;