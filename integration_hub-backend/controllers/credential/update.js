import Credential from "../../models/credential.model.js";
import { encrypt } from "../../services/secretManager.service.js";

const updateCredential = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, provider, secret } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (provider) updateData.provider = provider;
    
    // If a new secret is provided, re-encrypt it and increment key version
    if (secret) {
      updateData.encryptedData = encrypt(secret);
      updateData.$inc = { keyVersion: 1 };
    }

    const credential = await Credential.findOneAndUpdate(
      { _id: id, tenantId: req.currentTenant._id },
      updateData,
      { new: true }
    );

    if (!credential) {
      const error = new Error("Credential not found");
      error.statusCode = 404;
      throw error;
    }

    const safeCredential = credential.toObject();
    delete safeCredential.encryptedData;

    res.status(200).json({ success: true, data: safeCredential });
  } catch (e) {
    next(e);
  }
};

export default updateCredential;
