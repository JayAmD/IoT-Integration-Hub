import mongoose from "mongoose";
import Tenant from "../../models/tenant.model.js";

const createTenant = async (req, res, next) => {
  let session = null;

  try {
    const { name, description } = req.body;
    const userId = req.currentUser._id;

    // Start a session for transaction
    session = await mongoose.startSession();
    session.startTransaction();

    const tenant = await Tenant.create(
      [
        {
          name,
          description: description || "",
          members: [
            {
              userId,
              role: "owner",
            },
          ],
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: tenant[0],
    });
  } catch (e) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    next(e);
  }
};

export default createTenant;
