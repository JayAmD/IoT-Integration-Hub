import Device from "../../models/device.model.js";

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
    res.status(200).json({ success: true, data: updatedDevice });
  } catch (e) {
    next(e);
  }
};

export default updateDevice;