import Device from "../../models/device.model.js";

const getDeviceDetail = async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      const error = new Error("Device Not Found");
      error.statusCode = 404;
      throw error;
    }

    if (!device.ownerId.equals(req.user._id)) {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      throw error;
    }

    res.status(200).json({ success: true, data: device });
  } catch (e) {
    next(e);
  }
};

export default getDeviceDetail;
