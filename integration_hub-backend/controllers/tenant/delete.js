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
    const { tenantId } = req.params;
    const currentUserId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      const error = new Error("Invalid tenant ID");
      error.statusCode = 400;
      throw error;
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const tenant = await Tenant.findById(tenantId).session(session);

    if (!tenant) {
      const error = new Error("Tenant not found");
      error.statusCode = 404;
      throw error;
    }

    const currentMember = tenant.members.find((member) =>
      member.userId.equals(currentUserId)
    );

    if (!currentMember || currentMember.role !== "owner") {
      const error = new Error("Unauthorized: only owner can delete the tenant");
      error.statusCode = 403;
      throw error;
    }

    const deviceIds = await Device.find({ tenantId }).distinct("_id").session(session);

    await Promise.all([
      Message.deleteMany({ deviceId: { $in: deviceIds } }).session(session),
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
