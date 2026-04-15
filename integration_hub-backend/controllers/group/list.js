import Group from "../../models/group.model.js";

const listGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ ownerId: req.user._id });
    res.status(200).json({ success: true, data: groups });
  } catch (e) {
    next(e);
  }
};

export default listGroups;