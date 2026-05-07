import Group from "../../models/group.model.js";

const getGroupDetail = async (req, res, next) => {
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

    res.status(200).json({ success: true, data: group });
  } catch (e) {
    next(e);
  }
};

export default getGroupDetail;
