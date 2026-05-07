import Group from "../../models/group.model.js";

const deleteGroup = async (req, res, next) => {
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

    const deletedGroup = await Group.deleteOne({
      _id: req.params.id,
      tenantId: req.currentTenant._id,
    });
    res.status(200).json({ success: true, data: deletedGroup });
  } catch (e) {
    next(e);
  }
};

export default deleteGroup;
