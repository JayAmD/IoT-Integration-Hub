import client from './client.js';

export const credentialApi = {
    // Fetch all credentials
    list: async (tenantId) => {
        return await client(`/tenants/${tenantId}/credentials`, { method: 'GET' });
    },

    // Fetch a single credential by its ID
    getById: async (tenantId, id) => {
        return await client(`/tenants/${tenantId}/credentials/${id}`, { method: 'GET' });
    },

    // Create a new credential
    create: async (tenantId, credentialData) => {
        return await client(`/tenants/${tenantId}/credentials`, {
            method: 'POST',
            body: credentialData,
        });
    },

    // Update an existing credential
    update: async (tenantId, id, updateData) => {
        return await client(`/tenants/${tenantId}/credentials/${id}`, {
            method: 'PATCH',
            body: updateData,
        });
    },

    // Delete a credential
    delete: async (tenantId, id) => {
        return await client(`/tenants/${tenantId}/credentials/${id}`, { method: 'DELETE' });
    }
};
