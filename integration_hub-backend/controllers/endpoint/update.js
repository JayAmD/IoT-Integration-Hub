import Endpoint from '../../models/endpoint.model.js';

const updateEndpoint = async (req, res, next) => {
    try {
        const endpoint = await Endpoint.findOne({
            _id: req.params.id,
            tenantId: req.currentTenant._id,
        });

        if (!endpoint) {
            const error = new Error('Endpoint Not Found');
            error.statusCode = 404;
            throw error;
        }

        // Explicit whitelist — clients cannot patch tenantId or internal fields.
        const { name, groupIds, url, method, headers, credentialId, isActive } = req.body;
        const allowedUpdates = { name, groupIds, url, method, headers, credentialId, isActive };

        // Strip out undefined values so partial patches work correctly
        // (only the fields actually sent in the body get updated)
        Object.keys(allowedUpdates).forEach(
            (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
        );

        const updatedEndpoint = await Endpoint.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.currentTenant._id },
            allowedUpdates,
            { returnDocument: 'after', runValidators: true }
        );

        res.status(200).json({ success: true, data: updatedEndpoint });
    } catch (e) {
        next(e);
    }
};

export default updateEndpoint;