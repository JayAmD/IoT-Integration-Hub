import Device from "../../models/device.model.js";

const listDevices = async (req, res, next) => {
  try {
    const devices = await Device.find({ tenantId: req.currentTenant._id }).populate("groupIds", "name");

    let formatedDevices = []

    if (devices){
    formatedDevices = devices.map(device => {
      const {groupIds, ...deviceData} = device.toObject()
        return {...deviceData, groups: groupIds}
    })
    }

    res.status(200).json({ success: true, data: formatedDevices });
  } catch (e) {
    next(e);
  }
};

export default listDevices;