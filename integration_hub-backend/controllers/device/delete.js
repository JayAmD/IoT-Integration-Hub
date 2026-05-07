import Device from "../../models/device.model.js";

const deleteDevice = async (req, res, next) => {
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

    const deletedDevice = await Device.deleteOne({
      _id: req.params.id,
      tenantId: req.currentTenant._id,
    });
    res.status(200).json({ success: true, data: deletedDevice });
  } catch (e) {
    next(e);
  }
};

export default deleteDevice;
