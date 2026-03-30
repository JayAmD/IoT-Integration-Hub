import Endpoint from "../../models/endpoint.model.js";

const createEndpoint = async (req, res, next) => {
  try {
    const endpoint = await Endpoint.create({
      ...req.body,
      ownerId: req.user._id
    });
    res.status(201).json({ success: true, data: endpoint });
  } catch (e) {
    next(e);
  }
};

export default createEndpoint;
