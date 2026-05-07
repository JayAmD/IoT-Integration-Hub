import mongoose from "mongoose";

const credentialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Credential name is required"],
            trim: true,
            maxLength: [255, "Credential name must be less than 255 characters"],
        },
        provider: {
            type: String,
            required: [true, "Provider name is required (e.g., 'custom', 'aws', 'azure')"],
            trim: true,
        },
        encryptedData: {
            type: {
                ciphertext: {type: String, required: true},
                iv: {type: String, required: true},
                tag: {type: String, required: true},
            },
            select: false,
        },
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
    {timestamps: true}
);

const Credential = mongoose.model('Credential', credentialSchema);

export default Credential;
