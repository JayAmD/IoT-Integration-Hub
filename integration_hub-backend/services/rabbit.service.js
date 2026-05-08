import amqp from 'amqplib';
import { NODE_ENV } from '../config/env.js';

let connection = null;
let channel = null;

const RABBIT_URL = process.env.RABBIT_URL || 'amqp://guest:guest@localhost:5672';

/**
 * Shared connection manager for RabbitMQ
 */
export const getRabbitChannel = async () => {
    if (channel) return channel;

    try {
        console.log(`[RabbitService] Connecting to RabbitMQ...`);
        connection = await amqp.connect(RABBIT_URL);
        
        connection.on('error', (err) => {
            console.error("[RabbitService] Connection error:", err.message);
            connection = null;
            channel = null;
        });

        connection.on('close', () => {
            console.warn("[RabbitService] Connection closed.");
            connection = null;
            channel = null;
        });

        channel = await connection.createChannel();
        
        // Ensure both queues exist
        await channel.assertQueue('udp_parser_server_iot_msgs_queue', { durable: true });
        await channel.assertQueue('external_dispatch_queue', { durable: true });

        console.log(`[RabbitService] Connected and Queues initialized.`);
        return channel;
    } catch (error) {
        console.error("[RabbitService] Failed to initialize RabbitMQ:", error.message);
        throw error;
    }
};
