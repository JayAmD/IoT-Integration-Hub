import { getRabbitChannel } from './rabbit.service.js';
import Message from '../models/message.model.js';
import Endpoint from '../models/endpoint.model.js';
import { getSecretValue } from './secretManager.service.js';

const DISPATCH_QUEUE = 'external_dispatch_queue'; //TODO put into env vars
const DELAY_QUEUE = 'external_dispatch_delay_queue';

/**
 * Starts the External Dispatcher Worker
 */
export const startDispatcherWorker = async () => {
    try {
        const channel = await getRabbitChannel();
        await channel.prefetch(5); // Process a few in parallel

        console.log(`[Dispatcher] Listening for tasks in "${DISPATCH_QUEUE}"...`);

        channel.consume(DISPATCH_QUEUE, async (msg) => {
            if (!msg) return;

            const { messageId, endpointId } = JSON.parse(msg.content.toString());

            try {
                // 1. Fetch Message and Endpoint
                const [message, endpoint] = await Promise.all([
                    Message.findById(messageId),
                    Endpoint.findById(endpointId)
                ]);

                if (!message || !endpoint) {
                    console.warn(`[Dispatcher] Message or Endpoint missing. Cleaning up task.`);
                    return channel.ack(msg);
                }

                // Find the specific dispatch log for this endpoint
                const dispatchLog = message.dispatches.find(d => d.endpointId.toString() === endpointId);
                if (!dispatchLog) {
                    console.warn(`[Dispatcher] Dispatch log entry not found for endpoint ${endpointId}`);
                    return channel.ack(msg);
                }

                // If already delivered, just ACK
                if (dispatchLog.status === 'delivered') {
                    return channel.ack(msg);
                }

                // 2. Prepare headers 
                const headers = Object.fromEntries(endpoint.headers || new Map());

                // Add Authentication if credentialId is present
                if (endpoint.credentialId) {
                    try {
                        const secret = await getSecretValue(endpoint.credentialId);
                        // TODO: Adjust logic if it needs to be something other than 'Bearer'
                        headers['Authorization'] = `Bearer ${secret}`;
                    } catch (err) {
                        console.error(`[Dispatcher] Failed to resolve credential: ${err.message}`);
                        // We skip adding the header, the request will likely fail 401/403 below.
                    }
                }

                // 3. Perform the HTTP Push using native fetch
                console.log(`[Dispatcher] Sending message ${messageId} to ${endpoint.url} (Attempt ${dispatchLog.deliveryAttempts + 1})`);

                const response = await fetch(endpoint.url, {
                    method: endpoint.method,
                    headers: headers,
                    body: JSON.stringify(message.data),
                    // Set a reasonable timeout (fetch doesn't have one by default, using AbortController is better but keeping it simple)
                    signal: AbortSignal.timeout(10000)
                });

                if (response.ok) {
                    // SUCCESS: Atomic update of only this endpoint's status, not saving the whole message as to not overwrite others workers dispatch logs
                    await Message.updateOne(
                        { _id: messageId, "dispatches.endpointId": endpointId },
                        {
                            $set: {
                                "dispatches.$.status": 'delivered',
                                "dispatches.$.lastAttemptAt": new Date(),
                                "dispatches.$.lastError": null
                            },
                            $inc: { "dispatches.$.deliveryAttempts": 1 }
                        }
                    );

                    channel.ack(msg);
                    console.log(`[Dispatcher] SUCCESS: Message ${messageId} delivered to ${endpoint.name}`);
                } else {
                    // HTTP FAILURE (4xx or 5xx)
                    const errorText = await response.text();
                    const errorMessage = `HTTP ${response.status}: ${errorText.substring(0, 100)}`;

                    if (response.status >= 400 && response.status < 500) {
                        // CLIENT ERROR (4xx): Don't retry, likely a configuration/payload issue
                        await Message.updateOne(
                            { _id: messageId, "dispatches.endpointId": endpointId },
                            {
                                $set: {
                                    "dispatches.$.status": 'failed',
                                    "dispatches.$.lastAttemptAt": new Date(),
                                    "dispatches.$.lastError": errorMessage
                                },
                                $inc: { "dispatches.$.deliveryAttempts": 1 }
                            }
                        );

                        channel.ack(msg);
                        console.error(`[Dispatcher] PERMANENT FAILURE: ${errorMessage}`);
                    } else {
                        // SERVER ERROR (5xx): We 'throw' to stop this block and jump to the catch-block below.
                        // The catch-block handles the exponential backoff logic.
                        throw new Error(errorMessage);
                    }
                }

            } catch (error) {
                // NETWORK ERROR or 5xx (Jumped here from 'throw' above or fetch rejection)
                console.error(`[Dispatcher] TEMPORARY FAILURE for message ${messageId}: ${error.message}`);

                // 1. Increment attempts and log error atomically
                const updatedMessage = await Message.findOneAndUpdate(
                    { _id: messageId, "dispatches.endpointId": endpointId },
                    {
                        $inc: { "dispatches.$.deliveryAttempts": 1 },
                        $set: {
                            "dispatches.$.lastError": error.message,
                            "dispatches.$.lastAttemptAt": new Date()
                        }
                    },
                    { new: true } // Return the document so we can check current attempt count
                );

                const log = updatedMessage.dispatches.find(d => d.endpointId.toString() === endpointId);

                if (log.deliveryAttempts >= 10) {
                    // Max retries reached: Mark as failed
                    await Message.updateOne(
                        { _id: messageId, "dispatches.endpointId": endpointId },
                        { $set: { "dispatches.$.status": 'failed' } }
                    );
                    channel.ack(msg);
                    console.error(`[Dispatcher] Max retries reached for message ${messageId}`);
                } else {
                    // 2. Snooze: Calculate Delay (10 * 2^attempts)
                    const delayMs = Math.pow(2, log.deliveryAttempts - 1) * 10000;

                    // Send to Snooze Box (Delay Queue)
                    channel.sendToQueue(DELAY_QUEUE, msg.content, {
                        expiration: delayMs.toString(),
                        persistent: true
                    });

                    channel.ack(msg);
                    console.log(`[Dispatcher] SNOOZED: Retrying message ${messageId} in ${delayMs / 1000}s`);
                }
            }
        }, { noAck: false });

    } catch (error) {
        console.error(`[Dispatcher] Worker failed to start:`, error.message);
        setTimeout(startDispatcherWorker, 10000);
    }
};
