import mongoose from "mongoose";

import Tenant from "../../models/tenant.model.js";
import Device from "../../models/device.model.js";
import Endpoint from "../../models/endpoint.model.js";
import Group from "../../models/group.model.js";
import Credential from "../../models/credential.model.js";
import Message from "../../models/message.model.js";

const deleteTenant = async (req, res, next) => {
  let session = null;

  try {
    // authorizeTenant middleware already verified owner role
    const tenantId = req.currentTenant._id;

    session = await mongoose.startSession();
    session.startTransaction();

    await Promise.all([
      Message.deleteMany({ tenantId }).session(session),
      Device.deleteMany({ tenantId }).session(session),
      Endpoint.deleteMany({ tenantId }).session(session),
      Group.deleteMany({ tenantId }).session(session),
      Credential.deleteMany({ tenantId }).session(session),
      Tenant.deleteOne({ _id: tenantId }).session(session),
    ]);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Tenant deleted successfully",
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    next(error);
  }
};

export default deleteTenant;
