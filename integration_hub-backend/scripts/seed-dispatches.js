import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Device from '../models/device.model.js';
import Message from '../models/message.model.js';
import Endpoint from '../models/endpoint.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
config({ path: path.join(__dirname, '../.env.development.local') });

const seedDispatches = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected.");

    // 1. Find a device and endpoints
    const device = await Device.findOne();
    const endpoints = await Endpoint.find({ tenantId: device?.tenantId }).limit(3);

    if (!device || endpoints.length === 0) {
      console.error("Need at least 1 device and 1 endpoint in DB to seed dispatches.");
      console.log("Please make sure you have created an endpoint in the UI first.");
      process.exit(1);
    }

    console.log(`Seeding dispatches for device: ${device.name} using ${endpoints.length} endpoints.`);

    // 2. Create Mock Messages with the new 'dispatches' structure
    const mockMessages = [
      {
        deviceId: device._id,
        tenantId: device.tenantId,
        serialNumber: device.serialNumber,
        receivedAt: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
        data: { temp: 24.5, battery: 88, status: "OK" },
        dispatches: endpoints.map(e => ({
            endpointId: e._id,
            status: 'delivered',
            deliveryAttempts: 1,
            lastAttemptAt: new Date(),
            lastError: null
        }))
      },
      {
        deviceId: device._id,
        tenantId: device.tenantId,
        serialNumber: device.serialNumber,
        receivedAt: new Date(Date.now() - 1000 * 60 * 10), // 10 mins ago
        data: { alert: "High Temperature", value: 45.2 },
        dispatches: [
            {
                endpointId: endpoints[0]._id,
                status: 'failed',
                deliveryAttempts: 10,
                lastAttemptAt: new Date(),
                lastError: 'HTTP 500: Internal Server Error on target'
            },
            ...(endpoints.length > 1 ? [{
                endpointId: endpoints[1]._id,
                status: 'delivered',
                deliveryAttempts: 3,
                lastAttemptAt: new Date(),
                lastError: 'Earlier attempts failed with Timeout'
            }] : [])
        ]
      },
      {
        deviceId: device._id,
        tenantId: device.tenantId,
        serialNumber: device.serialNumber,
        receivedAt: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago
        data: { ping: true, rssi: -85 },
        dispatches: endpoints.map(e => ({
            endpointId: e._id,
            status: 'pending',
            deliveryAttempts: 2,
            lastAttemptAt: new Date(),
            lastError: 'Network unreachable, retrying...'
        }))
      }
    ];

    await Message.insertMany(mockMessages);
    console.log(`Successfully seeded ${mockMessages.length} messages with detailed dispatch logs.`);

    // 3. Update device lastSeen
    device.lastSeen = mockMessages[0].receivedAt;
    await device.save();

    mongoose.connection.close();
    console.log("Done.");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

seedDispatches();
