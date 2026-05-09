import mongoose from 'mongoose';

const endpointSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: [1, 'Endpoint name must not be empty'],
            maxLength: [255, 'Endpoint name must be less than 255 characters long'],
        },
        // Optional on creation — groups can be assigned later.
        groupIds: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Group',
            default: [],
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        method: {
            type: String,
            required: true,
            enum: {
                values: ['POST', 'PUT', 'PATCH'],
                message: 'Method must be one of: POST, PUT, PATCH',
            },
            default: 'POST',
        },
        // Static HTTP headers sent with every webhook call.
        // Map<String, String> gives better Mongoose ergonomics than a plain Object.
        // e.g. { "Content-Type": "application/json", "X-Api-Version": "2" }
        headers: {
            type: Map,
            of: String,
            default: {},
        },
        // Optional — not all external APIs require authentication.
        // When provided, the dispatch worker resolves the credential and
        // injects it into the outgoing request (e.g. Authorization header).
        credentialId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Credential',
            default: null,
        },
        // Soft-disable without deleting — useful for temporary pausing.
        isActive: {
            type: Boolean,
            default: true,
        },
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
        },
    },
    { timestamps: true }
);

const Endpoint = mongoose.model('Endpoint', endpointSchema);

export default Endpoint;