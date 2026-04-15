import Group from "../../models/group.model.js";

const updateGroup = async (req, res, next) => {
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

    const updatedGroup = await Group.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: 'after', runValidators: true }
    );
    res.status(200).json({ success: true, data: updatedGroup });
  } catch (e) {
    next(e);
  }
};

export default updateGroup;