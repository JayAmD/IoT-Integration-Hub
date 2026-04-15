import Group from "../../models/group.model.js";

const getGroupDetail = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      const error = new Error("Group Not Found");
      error.statusCode = 404;
      throw error;
    }

    if (!group.ownerId.equals(req.user._id)) {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      throw error;
    }

    res.status(200).json({ success: true, data: group });
  } catch (e) {
    next(e);
  }
};

export default getGroupDetail;
