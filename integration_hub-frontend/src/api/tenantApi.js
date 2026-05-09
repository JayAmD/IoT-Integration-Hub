import client from './client.js';

export const tenantApi = {
    // Fetch all tenants available to the current user
    list: async () => {
        const response = await client('/tenants', { method: 'GET' });
        return response.data;
    },

    // Fetch a single tenant by its ID
    getById: async (tenantId) => {
        const response = await client(`/tenants/${tenantId}`, { method: 'GET' });
        return response.data;
    },

    // Create a new tenant
    create: async (tenantData) => {
        const response = await client('/tenants', {
            method: 'POST',
            body: tenantData,
        });
        return response.data;
    },

    // Update an existing tenant by its ID
    update: async (tenantId, updateData) => {
        const response = await client(`/tenants/${tenantId}`, {
            method: 'PATCH',
            body: updateData,
        });
        return response.data;
    },

    // Delete a tenant by its ID
    delete: async (tenantId) => {
        const response = await client(`/tenants/${tenantId}`, { method: 'DELETE' });
        return response.data;
    },

    // Add a member to a tenant by email
    addMember: async (tenantId, memberData) => {
        const response = await client(`/tenants/${tenantId}/members`, {
            method: 'POST',
            body: memberData,  // { email, role }
        });
        return response.data;
    },

    // Remove a member from a tenant
    removeMember: async (tenantId, userId) => {
        const response = await client(`/tenants/${tenantId}/members/${userId}`, { method: 'DELETE' });
        return response.data;
    },

    // Update a member's role
    updateMemberRole: async (tenantId, userId, roleData) => {
        const response = await client(`/tenants/${tenantId}/members/${userId}`, {
            method: 'PATCH',
            body: roleData,
        });
        return response.data;
    },
};
