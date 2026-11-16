import Endpoint from '../../models/endpoint.model.js';
import { validateCredentialBelongsToTenant } from '../../services/credential.service.js';

// Only explicitly allowed fields are accepted from the request body.
const createEndpoint = async (req, res, next) => {
    try {
        const { name, groupIds, url, method, headers, credentialId, isActive } = req.body;
        await validateCredentialBelongsToTenant(credentialId, req.currentTenant._id);

        const endpoint = await Endpoint.create({
            name,
            groupIds,
            url,
            method,
            headers,
            credentialId,
            isActive,
            tenantId: req.currentTenant._id, // always from auth, never from client
        });

        await endpoint.populate([
            { path: 'groupIds', select: 'name' },
            { path: 'credentialId', select: 'name authType' }
        ]);

        res.status(201).json({ success: true, data: endpoint });
    } catch (e) {
        next(e);
    }
};

export default createEndpoint;
