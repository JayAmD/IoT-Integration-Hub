import client from './client.js';

export const tenantApi = {
    // Fetch all tenants available to the current user
    list: async () => {
        return await client('/tenants', { method: 'GET' });
    },

    // Create a new tenant
    create: async (tenantData) => {
        return await client('/tenants', {
            method: 'POST',
            body: tenantData,
        });
    },
};
