import Device from "../../models/device.model.js";

const getDeviceDetail = async (req, res, next) => {
  try {
    const device = await Device.findOne({
      _id: req.params.id,
      tenantId: req.currentTenant._id,
    }).populate("groupIds", "name");

    if (!device) {
      const error = new Error("Device Not Found");
      error.statusCode = 404;
      throw error;
    }

    // Rename groupIds to groups
    const {groupIds, ...deviceData} = device.toObject()
    const finalDevice = {...deviceData, groups: groupIds}

    res.status(200).json({ success: true, data: finalDevice });
  } catch (e) {
    next(e);
  }
};

export default getDeviceDetail;
