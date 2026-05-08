import client from './client.js';

export const groupApi = {
    // Fetch all groups
    list: async (tenantId) => {
        return await client(`/tenants/${tenantId}/groups`, { method: 'GET' });
    },

    // Fetch a single group by its ID
    getById: async (tenantId, id) => {
        return await client(`/tenants/${tenantId}/groups/${id}`, { method: 'GET' });
    },

    // Create a new group
    create: async (tenantId, groupData) => {
        return await client(`/tenants/${tenantId}/groups`, {
            method: 'POST',
            body: groupData,
        });
    },

    // Update an existing group by its ID
    update: async (tenantId, id, updateData) => {
        return await client(`/tenants/${tenantId}/groups/${id}`, {
            method: 'PATCH',
            body: updateData,
        });
    },

    // Delete a group by its ID
    delete: async (tenantId, id) => {
        return await client(`/tenants/${tenantId}/groups/${id}`, { method: 'DELETE' });
    }
};