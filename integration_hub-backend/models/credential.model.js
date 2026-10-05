import mongoose from "mongoose";

const encryptedValueSchema = new mongoose.Schema({
    ciphertext: { type: String, required: true },
    iv: { type: String, required: true },
    tag: { type: String, required: true }
}, { _id: false });

const credentialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Credential name is required"],
            trim: true,
            maxLength: [255, "Credential name must be less than 255 characters"],
        },
        authType: {
            type: String,
            enum: ['staticHeader', 'tokenLogin'],
            required: true,
            immutable: true,
        },
        authorizationHeaderKey: { type: String },
        // Compatibility metadata until the frontend removes the provider selector.
        provider: {
            type: String,
            default: 'custom',
            trim: true,
        },
        // Static Header value and Token Login secrets are encrypted separately.
        encryptedAuthorizationHeaderValue: { type: encryptedValueSchema, select: false },
        encryptedClientId: { type: encryptedValueSchema, select: false },
        encryptedClientSecret: { type: encryptedValueSchema, select: false },
        loginEndpoint: { type: String },
        loginTemplate: { type: String },
        responseTokenKey: { type: String },
        keyVersion: {
            type: Number,
            default: 1,
        },
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
        },
    },
    {timestamps: true, optimisticConcurrency: true}
);

const Credential = mongoose.model('Credential', credentialSchema);

export default Credential;
