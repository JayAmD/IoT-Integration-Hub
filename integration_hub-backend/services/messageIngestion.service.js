import { getRabbitChannel } from './rabbit.service.js';
import Message from '../models/message.model.js';
import Device from '../models/device.model.js';
import Endpoint from '../models/endpoint.model.js';

const INGEST_QUEUE = 'udp_parser_server_iot_msgs_queue';
const DISPATCH_QUEUE = 'external_dispatch_queue';

/**
 * Starts the IoT Message Ingestion Consumer
 */
export const startIngestionConsumer = async () => {
    try {
        const channel = await getRabbitChannel();

        await channel.prefetch(1); // Process one by one for reliability

        console.log(`[Ingestion] Listening for messages in "${INGEST_QUEUE}"...`);

        channel.consume(INGEST_QUEUE, async (msg) => {
            if (!msg) return;

            const payload = JSON.parse(msg.content.toString());
            console.log(`[Ingestion] Received message for SN: ${payload.serialNumber}`);

            try {
                // 1. Resolve Device from ID (provided by the Parser)
                const device = await Device.findById(payload.deviceId);

                if (!device) {
                    console.error(`[Ingestion] Device with ID ${payload.deviceId} not found in Database!`);
                    // We ACK anyway to remove it from queue, or move to DLX (Dead Letter Exchange)
                    return channel.ack(msg);
                }

                // Update lastSeenAt
                device.lastSeenAt = payload.receivedAt;
                await device.save();

                // 2. Find applicable Endpoints for this tenant (Group Match Required)
                const matchingEndpoints = await Endpoint.find({
                    tenantId: device.tenantId,
                    isActive: true,
                    groupIds: { $in: device.groupIds } // Only match if they share a group
                });

                // 3. Save to MongoDB (Outbox Pattern Step 1)
                const newMessage = await Message.create({
                    deviceId: device._id,
                    tenantId: device.tenantId,
                    serialNumber: payload.serialNumber,
                    receivedAt: payload.receivedAt,
                    data: payload.data,
                    dispatches: matchingEndpoints.map(ep => ({
                        endpointId: ep._id,
                        status: 'pending'
                    }))
                });

                // 4. Publish to Dispatch Queue for EACH endpoint (Outbox Pattern Step 2)
                for (const ep of matchingEndpoints) {
                    const dispatchPayload = {
                        messageId: newMessage._id,
                        endpointId: ep._id
                    };

                    channel.sendToQueue(DISPATCH_QUEUE, Buffer.from(JSON.stringify(dispatchPayload)), {
                        persistent: true
                    });
                }

                // 5. ACK the ingestion queue
                channel.ack(msg);
                console.log(`[Ingestion] Message ${newMessage._id} saved and queued for ${matchingEndpoints.length} endpoints.`);

            } catch (error) {
                console.error(`[Ingestion] Error processing message:`, error.message);
                // NACK and re-queue for retry
                setTimeout(() => channel.nack(msg, false, true), 5000);
            }
        }, { noAck: false });

    } catch (error) {
        console.error(`[Ingestion] Failed to start consumer:`, error.message);
        setTimeout(startIngestionConsumer, 10000); // Retry starting
    }
};
