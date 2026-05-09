import Credential from "../../models/credential.model.js";
import Endpoint from "../../models/endpoint.model.js";

const deleteCredential = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if being used by any endpoints
    const inUse = await Endpoint.exists({ credentialId: id });
    if (inUse) {
      const error = new Error("Cannot delete credential because it is in use by one or more endpoints.");
      error.statusCode = 400;
      throw error;
    }

    const credential = await Credential.findOneAndDelete({ 
      _id: id, 
      tenantId: req.currentTenant._id 
    });

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
