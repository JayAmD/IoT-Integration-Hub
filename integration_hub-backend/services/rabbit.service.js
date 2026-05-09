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
        
        // Ensure queues exist
        await channel.assertQueue('udp_parser_server_iot_msgs_queue', { durable: true });

        // External Dispatch Infrastructure
        const DISPATCH_EXCHANGE = 'external_dispatch_exchange';
        const DISPATCH_QUEUE = 'external_dispatch_queue';
        const DELAY_QUEUE = 'external_dispatch_delay_queue';

        // 1. The Exchange: Acts as a router
        await channel.assertExchange(DISPATCH_EXCHANGE, 'direct', { durable: true });

        // 2. The Main Queue: Where the worker listens
        await channel.assertQueue(DISPATCH_QUEUE, { durable: true });
        await channel.bindQueue(DISPATCH_QUEUE, DISPATCH_EXCHANGE, 'dispatch');

        // 3. The Snooze Box (Delay Queue): 
        // It has NO consumers. Messages sit here until their TTL expires, 
        // then they are "dead-lettered" back to the main exchange.
        await channel.assertQueue(DELAY_QUEUE, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': DISPATCH_EXCHANGE,
                'x-dead-letter-routing-key': 'dispatch'
            }
        });

        console.log(`[RabbitService] Connected and Queues initialized (including Dispatch & Delay).`);
        return channel;
    } catch (error) {
        console.error("[RabbitService] Failed to initialize RabbitMQ:", error.message);
        throw error;
    }
};
