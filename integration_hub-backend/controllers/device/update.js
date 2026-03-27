import Device from "../../models/device.model.js";

const updateDevice = async (req, res, next) => {
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

    const updatedDevice = await Device.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: 'after', runValidators: true }
    );
    res.status(200).json({ success: true, data: updatedDevice });
  } catch (e) {
    next(e);
  }
};

export default updateDevice;