import client from './client.js';

export const groupApi = {
    // Fetch all groups
    list: async (tenantId) => {
        const response = await client(`/tenants/${tenantId}/groups`, { method: 'GET' });
        return response.data;
    },

    // Fetch a single group by its ID
    getById: async (tenantId, id) => {
        const response = await client(`/tenants/${tenantId}/groups/${id}`, { method: 'GET' });
        return response.data;
    },

    // Create a new group
    create: async (tenantId, groupData) => {
        const response = await client(`/tenants/${tenantId}/groups`, {
            method: 'POST',
            body: groupData,
        });
        return response.data;
    },

    // Update an existing group by its ID
    update: async (tenantId, id, updateData) => {
        const response = await client(`/tenants/${tenantId}/groups/${id}`, {
            method: 'PATCH',
            body: updateData,
        });
        return response.data;
    },

    // Delete a group by its ID
    delete: async (tenantId, id) => {
        const response = await client(`/tenants/${tenantId}/groups/${id}`, { method: 'DELETE' });
        return response.data;
    }
};