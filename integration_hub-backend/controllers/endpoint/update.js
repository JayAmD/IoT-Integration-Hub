import Endpoint from "../../models/endpoint.model.js";

const updateEndpoint = async (req, res, next) => {
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

    const updatedEndpoint = await Endpoint.findOneAndUpdate(
        { _id: req.params.id, tenantId: req.currentTenant._id },
        req.body,
        { returnDocument: 'after', runValidators: true }
    );
    res.status(200).json({ success: true, data: updatedEndpoint });
  } catch (e) {
    next(e);
  }
};

export default updateEndpoint;