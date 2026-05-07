import Group from "../../models/group.model.js";

const createGroup = async (req, res, next) => {
  try {
    const group = await Group.create({
      ...req.body,
      tenantId: req.currentTenant._id
    });
    res.status(201).json({ success: true, data: group });
  } catch (e) {
    next(e);
  }
};

export default createGroup;
