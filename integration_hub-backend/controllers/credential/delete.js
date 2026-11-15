import Credential from "../../models/credential.model.js";
import Endpoint from "../../models/endpoint.model.js";

const deleteCredential = async (req, res, next) => {
  try {
    const { id } = req.params;
    const filter = { _id: id, tenantId: req.currentTenant._id };

    const existingCredential = await Credential.findOne(filter);
    if (!existingCredential) {
      const error = new Error("Credential not found");
      error.statusCode = 404;
      throw error;
    }

    // Check usage
    const blockingEndpoints = await Endpoint.find({
      credentialId: id,
      tenantId: req.currentTenant._id,
    }).select("name");
    if (blockingEndpoints.length > 0) {
      const names = blockingEndpoints.map(e => e.name).join(", ");
      const error = new Error(`Cannot delete credential because it is in use by these endpoints: ${names}`);
      error.statusCode = 400;
      throw error;
    }

    const credential = await Credential.findOneAndDelete(filter);

    if (!credential) {
      const error = new Error("Credential not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, message: "Credential deleted successfully" });
  } catch (e) {
    next(e);
  }
};

export default deleteCredential;
