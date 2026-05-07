import mongoose from 'mongoose';

const endpointSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: [1, "Endpoint name must not be empty"],
            maxLength: [255, "Endpoint name must be less than 255 characters long"],
        },
        groupIds: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Group",
            default: [],
        },
        url: {
            type: String,
            required: true,
        },
        method: {
            type: String,
            required: true,
        },
        headers: {
            type: Object,
        },
        credentialId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Credential',
        },
        mappingRules:
            {
                type: String,
            },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    }, {timestamps: true}
)

const Endpoint = mongoose.model('Endpoint', endpointSchema);

export default Endpoint;