import Credential from "../../models/credential.model.js";
import { decrypt } from "../../services/secretManager.service.js";

const revealCredentialSecret = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // We explicitly select the encryptedData which is hidden by default
    const credential = await Credential.findOne({ 
      _id: id, 
      tenantId: req.currentTenant._id 
    }).select("+encryptedData");

    if (!credential) {
      const error = new Error("Credential not found");
      error.statusCode = 404;
      throw error;
    }

    const plainText = decrypt(credential.encryptedData);

    res.status(200).json({ 
      success: true, 
      data: { secret: plainText } 
    });
  } catch (e) {
    next(e);
  }
};

export default revealCredentialSecret;
