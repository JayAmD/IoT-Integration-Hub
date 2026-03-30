import Endpoint from "../../models/endpoint.model.js";

const listEndpoints = async (req, res, next) => {
  try {
    const endpoints = await Endpoint.find({ ownerId: req.user._id });
    res.status(200).json({ success: true, data: endpoints });
  } catch (e) {
    next(e);
  }
};

export default listEndpoints;