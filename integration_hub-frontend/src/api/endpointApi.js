import client from './client.js';

export const endpointApi = {
    // Fetch all endpoints for a tenant
    list: async (tenantId) => {
        const response = await client(`/tenants/${tenantId}/endpoints`, { method: 'GET' });
        return response.data;
    },

    // Fetch a single endpoint by its ID
    getById: async (tenantId, id) => {
        const response = await client(`/tenants/${tenantId}/endpoints/${id}`, { method: 'GET' });
        return response.data;
    },

    // Create a new endpoint
    create: async (tenantId, endpointData) => {
        const response = await client(`/tenants/${tenantId}/endpoints`, {
            method: 'POST',
            body: endpointData,
        });
        return response.data;
    },

    // Update an existing endpoint
    update: async (tenantId, id, updateData) => {
        const response = await client(`/tenants/${tenantId}/endpoints/${id}`, {
            method: 'PATCH',
            body: updateData,
        });
        return response.data;
    },

    // Delete an endpoint
    delete: async (tenantId, id) => {
        const response = await client(`/tenants/${tenantId}/endpoints/${id}`, { method: 'DELETE' });
        return response.data;
    }
};
