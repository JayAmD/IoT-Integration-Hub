import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Device',
            required: true,
        },
        isSend:{
            type: Boolean,
            required: true,
        },
        payload: {
            type: Object,
        }
    }, {timestamps: true}
)

const Message = mongoose.model('Message', messageSchema);

export default Message;

