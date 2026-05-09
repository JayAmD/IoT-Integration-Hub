import client from './client.js';

export const messageApi = {
    // Fetch all messages for a tenant (supports query params for filtering/pagination)
    list: async (tenantId, params = {}) => {
        const query = new URLSearchParams(params).toString();
        const url = `/tenants/${tenantId}/messages${query ? `?${query}` : ''}`;
        const response = await client(url, { method: 'GET' });
        return {
            items: response.data,
            pagination: response.pagination
        };
    },

    // Fetch a single message detail
    getById: async (tenantId, messageId) => {
        const response = await client(`/tenants/${tenantId}/messages/${messageId}`, { method: 'GET' });
        return response.data;
    }
};
