import client from './client.js';

export const deviceApi = {
    // Fetch all devices
    list: async (tenantId) => {
        return await client(`/tenants/${tenantId}/devices`, { method: 'GET' });
    },

    // Fetch a single device by its ID
    getById: async (tenantId, id) => {
        return await client(`/tenants/${tenantId}/devices/${id}`, { method: 'GET' });
    },

    // Create a new device
    create: async (tenantId, deviceData) => {
        return await client(`/tenants/${tenantId}/devices`, {
            method: 'POST',
            body: deviceData,
        });
    },

    // Update an existing device by its ID
    update: async (tenantId, id, updateData) => {
        return await client(`/tenants/${tenantId}/devices/${id}`, {
            method: 'PATCH',
            body: updateData,
        });
    },

    // Delete a device by its ID
    delete: async (tenantId, id) => {
        return await client(`/tenants/${tenantId}/devices/${id}`, { method: 'DELETE' });
    }
};
