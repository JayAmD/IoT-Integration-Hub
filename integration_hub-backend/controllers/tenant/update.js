import Tenant from "../../models/tenant.model.js";

const updateTenant = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // At least one field must be provided
    if (name === undefined && description === undefined) {
      const error = new Error("Nothing to update — provide name or description");
      error.statusCode = 400;
      throw error;
    }

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim();

    // Use findByIdAndUpdate so schema validators (maxLength etc.) still run
    const updated = await Tenant.findByIdAndUpdate(
      req.currentTenant._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("members.userId", "email");

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (e) {
    next(e);
  }
};

export default updateTenant;
