import Credential from '../../models/credential.model.js';
import { buildCredentialData, publicCredential } from '../../services/credential.service.js';

const createCredential = async (req, res, next) => {
    try {
        const data = buildCredentialData(req.body);
        const credential = await Credential.create({ ...data, tenantId: req.currentTenant._id });
        res.status(201).json({ success: true, data: publicCredential(credential) });
    } catch (error) {
        next(error);
    }
};

export default createCredential;
