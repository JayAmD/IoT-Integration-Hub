import client from './client.js';

export const messageApi = {
    // Fetch all messages for a tenant (supports query params for filtering/pagination)
    list: async (tenantId, params = {}) => {
        const query = new URLSearchParams(params).toString();
        const url = `/tenants/${tenantId}/messages${query ? `?${query}` : ''}`;
        return await client(url, { method: 'GET' });
    },

    // Fetch a single message detail
    getById: async (tenantId, messageId) => {
        return await client(`/tenants/${tenantId}/messages/${messageId}`, { method: 'GET' });
    }
};
