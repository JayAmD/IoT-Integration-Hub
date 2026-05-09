import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Device',
            required: true,
        },
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
        },
        serialNumber: {
            type: Number,
            required: true
        },
        receivedAt: {
            type: Date, // The actual time from the Parser Server
            required: true
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        dispatches: [
            {
                endpointId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Endpoint',
                    required: true
                },
                status: {
                    type: String,
                    enum: ['pending', 'delivered', 'failed'],
                    default: 'pending'
                },
                deliveryAttempts: {
                    type: Number,
                    default: 0
                },
                lastError: {
                    type: String
                },
                lastAttemptAt: {
                    type: Date
                }
            }
        ]
    }, { timestamps: true }
)

const Message = mongoose.model('Message', messageSchema);

export default Message;

