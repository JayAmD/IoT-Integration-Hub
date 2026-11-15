import Group from "../../models/group.model.js";

const updateGroup = async (req, res, next) => {
  try {
    const group = await Group.findOne({
      _id: req.params.id,
      tenantId: req.currentTenant._id,
    });

    if (!group) {
      const error = new Error("Group Not Found");
      error.statusCode = 404;
      throw error;
    }

    const updates = {};
    if (req.body.name !== undefined) {
      updates.name = req.body.name;
    }

    const updatedGroup = await Group.findOneAndUpdate(
        { _id: req.params.id, tenantId: req.currentTenant._id },
        updates,
        { returnDocument: 'after', runValidators: true }
    );
    res.status(200).json({ success: true, data: updatedGroup });
  } catch (e) {
    next(e);
  }
};

export default updateGroup;
