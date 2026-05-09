import Credential from "../../models/credential.model.js";

const getCredentialDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const credential = await Credential.findOne({ 
      _id: id, 
      tenantId: req.currentTenant._id 
    });

    if (!credential) {
      const error = new Error("Credential not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: credential });
  } catch (e) {
    next(e);
  }
};

export default getCredentialDetail;
