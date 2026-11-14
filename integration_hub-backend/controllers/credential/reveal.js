import Credential from "../../models/credential.model.js";
import { decrypt } from "../../services/secretManager.service.js";

const revealCredentialSecret = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Explicitly select the encrypted header value, which is excluded from normal queries.
    const credential = await Credential.findOne({ 
      _id: id, 
      tenantId: req.currentTenant._id 
    }).select("+encryptedAuthorizationHeaderValue");

    if (!credential) {
      const error = new Error("Credential not found");
      error.statusCode = 404;
      throw error;
    }

    // Only Static Header credentials support revealing the stored value.
    if (credential.authType === 'tokenLogin') {
      throw Object.assign(new Error('Token Login secrets cannot be revealed.'), { statusCode: 400 });
    }
    const plainText = decrypt(credential.encryptedAuthorizationHeaderValue);

    res.status(200).json({ 
      success: true, 
      data: { secret: plainText } 
    });
  } catch (e) {
    next(e);
  }
};

export default revealCredentialSecret;
