import Endpoint from "../../models/endpoint.model.js";

const getEndpointDetail = async (req, res, next) => {
  try {
    const endpoint = await Endpoint.findById(req.params.id);

    if (!endpoint) {
      const error = new Error("Endpoint Not Found");
      error.statusCode = 404;
      throw error;
    }

    if (!endpoint.ownerId.equals(req.user._id)) {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      throw error;
    }

    res.status(200).json({ success: true, data: endpoint });
  } catch (e) {
    next(e);
  }
};

export default getEndpointDetail;
