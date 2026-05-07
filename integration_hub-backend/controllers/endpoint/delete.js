import Endpoint from "../../models/endpoint.model.js";

const deleteEndpoint = async (req, res, next) => {
  try {
    const endpoint = await Endpoint.findOne({
      _id: req.params.id,
      tenantId: req.currentTenant._id,
    });

    if (!endpoint) {
      const error = new Error("Endpoint Not Found");
      error.statusCode = 404;
      throw error;
    }

    const deletedEndpoint = await Endpoint.deleteOne({
      _id: req.params.id,
      tenantId: req.currentTenant._id,
    });
    res.status(200).json({ success: true, data: deletedEndpoint });
  } catch (e) {
    next(e);
  }
};

export default deleteEndpoint;
