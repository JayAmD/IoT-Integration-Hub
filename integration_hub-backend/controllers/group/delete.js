import Group from "../../models/group.model.js";

const deleteGroup = async (req, res, next) => {
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

    const deletedGroup = await Group.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, data: deletedGroup });
  } catch (e) {
    next(e);
  }
};

export default deleteGroup;
