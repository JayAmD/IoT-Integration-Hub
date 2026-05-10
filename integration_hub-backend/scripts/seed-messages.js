import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Device from '../models/device.model.js';
import Message from '../models/message.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
config({ path: path.join(__dirname, '../.env.development.local') });

const seedMessages = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected.");

    // 1. Find a device to attach messages to
    const device = await Device.findOne();
    if (!device) {
      console.error("No devices found in DB. Please run npm run seed first.");
      process.exit(1);
    }

    console.log(`Seeding messages for device: ${device.name} (SN: ${device.serialNumber})`);

    // 2. Clear existing messages for this device (optional)
    // await Message.deleteMany({ deviceId: device._id });

    // 3. Create Mock Messages
    const mockMessages = [
      {
        deviceId: device._id,
        tenantId: device.tenantId,
        serialNumber: device.serialNumber,
        receivedAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
        data: { temperature: 22.5, humidity: 45, battery: 98 },
        status: 'delivered'
      },
      {
        deviceId: device._id,
        tenantId: device.tenantId,
        serialNumber: device.serialNumber,
        receivedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        data: { temperature: 23.1, humidity: 44, battery: 98 },
        status: 'delivered'
      },
      {
        deviceId: device._id,
        tenantId: device.tenantId,
        serialNumber: device.serialNumber,
        receivedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        data: { temperature: 22.8, humidity: 46, battery: 97 },
        status: 'failed',
        lastError: 'Timeout connecting to external API'
      },
      {
        deviceId: device._id,
        tenantId: device.tenantId,
        serialNumber: device.serialNumber,
        receivedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        data: { temperature: 21.9, humidity: 48, battery: 97 },
        status: 'pending'
      }
    ];

    await Message.insertMany(mockMessages);
    console.log("Successfully seeded 4 mock messages.");

    // 4. Update device lastSeenAt
    device.lastSeenAt = mockMessages[0].receivedAt;
    await device.save();
    console.log("Updated device lastSeenAt.");

    mongoose.connection.close();
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

seedMessages();
