import client from './client.js';

export const deviceApi = {
    // Fetch all devices
    list: async (tenantId) => {
        const response = await client(`/tenants/${tenantId}/devices`, { method: 'GET' });
        return response.data;
    },

    // Fetch a single device by its ID
    getById: async (tenantId, id) => {
        const response = await client(`/tenants/${tenantId}/devices/${id}`, { method: 'GET' });
        return response.data;
    },

    // Create a new device
    create: async (tenantId, deviceData) => {
        const response = await client(`/tenants/${tenantId}/devices`, {
            method: 'POST',
            body: deviceData,
        });
        return response.data;
    },

    // Update an existing device by its ID
    update: async (tenantId, id, updateData) => {
        const response = await client(`/tenants/${tenantId}/devices/${id}`, {
            method: 'PATCH',
            body: updateData,
        });
        return response.data;
    },

    // Delete a device by its ID
    delete: async (tenantId, id) => {
        const response = await client(`/tenants/${tenantId}/devices/${id}`, { method: 'DELETE' });
        return response.data;
    }
};
