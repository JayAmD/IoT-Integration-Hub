import client from './client.js';

export const credentialApi = {
    // Fetch all credentials
    list: async (tenantId) => {
        const response = await client(`/tenants/${tenantId}/credentials`, { method: 'GET' });
        return response.data || response;
    },

    // Fetch a single credential by its ID
    getById: async (tenantId, id) => {
        const response = await client(`/tenants/${tenantId}/credentials/${id}`, { method: 'GET' });
        return response.data || response;
    },

    // Create a new credential
    create: async (tenantId, credentialData) => {
        const response = await client(`/tenants/${tenantId}/credentials`, {
            method: 'POST',
            body: credentialData,
        });
        return response.data || response;
    },

    // Update an existing credential
    update: async (tenantId, id, updateData) => {
        const response = await client(`/tenants/${tenantId}/credentials/${id}`, {
            method: 'PATCH',
            body: updateData,
        });
        return response.data || response;
    },

    // Delete a credential
    delete: async (tenantId, id) => {
        const response = await client(`/tenants/${tenantId}/credentials/${id}`, { method: 'DELETE' });
        return response.data || response;
    },

    // Reveal the plaintext secret
    reveal: async (tenantId, id) => {
        const response = await client(`/tenants/${tenantId}/credentials/${id}/reveal`, { method: 'POST' });
        return response.data || response;
    }
};
