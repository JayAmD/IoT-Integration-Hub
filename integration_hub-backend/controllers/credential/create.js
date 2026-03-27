import Credential from "../../models/credential.model.js";
import { encrypt } from "../../services/secretManager.service.js";

const createCredential = async (req, res, next) => {
    try {
        const { name, provider, secret } = req.body;

        const encryptedData = encrypt(secret);

        const credential = await Credential.create({
            name,
            provider,
            encryptedData,
            ownerId: req.user._id
        });

        const safeCredential = credential.toObject()
        delete safeCredential.encryptedData

        res.status(201).json({ success: true, data: safeCredential });
    } catch (e) {
        next(e);
    }
};

export default createCredential;
