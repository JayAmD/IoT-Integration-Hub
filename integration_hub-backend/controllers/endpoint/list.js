import Endpoint from '../../models/endpoint.model.js';

const listEndpoints = async (req, res, next) => {
    try {
        const filter = { tenantId: req.currentTenant._id };

        // Optional filter by group: GET /endpoints?groupId=<id>
        if (req.query.groupId) {
            filter.groupIds = req.query.groupId;
        }

        const endpoints = await Endpoint.find(filter)
            .populate('groupIds', 'name')           // include group names
            .populate('credentialId', 'name provider') // include credential label, not the secret
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: endpoints });
    } catch (e) {
        next(e);
    }
};

export default listEndpoints;