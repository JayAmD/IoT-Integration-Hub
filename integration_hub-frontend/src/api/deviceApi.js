import client from './client.js';

export const deviceApi = {
    // Fetch all devices
    list: async () => {
        return await client('/devices', { method: 'GET' });
    },

    // Fetch a single device by its ID
    getById: async (id) => {
        return await client(`/devices/${id}`, { method: 'GET' });
    },

    // Create a new device
    create: async (deviceData) => {
        return await client('/devices', {
            method: 'POST',
            body: deviceData,
        });
    },

    // Update an existing device by its ID
    update: async (id, updateData) => {
        return await client(`/devices/${id}`, {
            method: 'PATCH',
            body: updateData,
        });
    },

    // Delete a device by its ID
    delete: async (id) => {
        return await client(`/devices/${id}`, { method: 'DELETE' });
    }
};
