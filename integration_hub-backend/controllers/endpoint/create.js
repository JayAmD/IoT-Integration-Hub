import Endpoint from '../../models/endpoint.model.js';

// Explicit destructure = "mass assignment protection".
// If a client sends { tenantId: "someone-else", isActive: false } in the body,
// it gets ignored — only the fields we list here are ever written to the DB.
const createEndpoint = async (req, res, next) => {
    try {
        const { name, groupIds, url, method, headers, credentialId } = req.body;

        const endpoint = await Endpoint.create({
            name,
            groupIds,
            url,
            method,
            headers,
            credentialId,
            tenantId: req.currentTenant._id, // always from auth, never from client
        });

        // Populate group names so the frontend can display them immediately
        await endpoint.populate('groupIds', 'name');

        res.status(201).json({ success: true, data: endpoint });
    } catch (e) {
        next(e);
    }
};

export default createEndpoint;
