import Device from "../../models/device.model.js";

const createDevice = async (req, res, next) => {
  try {
    const device = await Device.create({
      ...req.body,
      tenantId: req.currentTenant._id
    });
    res.status(201).json({ success: true, data: device });
  } catch (e) {
    next(e);
  }
};

export default createDevice;
