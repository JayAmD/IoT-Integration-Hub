import client from './client.js';

export const tenantApi = {
    // Fetch all tenants available to the current user
    list: async () => {
        return await client('/tenants', { method: 'GET' });
    },

    // Fetch a single tenant by its ID
    getById: async (tenantId) => {
        return await client(`/tenants/${tenantId}`, { method: 'GET' });
    },

    // Create a new tenant
    create: async (tenantData) => {
        return await client('/tenants', {
            method: 'POST',
            body: tenantData,
        });
    },

    // Update an existing tenant by its ID
    update: async (tenantId, updateData) => {
        return await client(`/tenants/${tenantId}`, {
            method: 'PATCH',
            body: updateData,
        });
    },

    // Delete a tenant by its ID
    delete: async (tenantId) => {
        return await client(`/tenants/${tenantId}`, { method: 'DELETE' });
    },

    // Add a member to a tenant by email
    addMember: async (tenantId, memberData) => {
        return await client(`/tenants/${tenantId}/members`, {
            method: 'POST',
            body: memberData,  // { email, role }
        });
    },

    // Remove a member from a tenant
    removeMember: async (tenantId, userId) => {
        return await client(`/tenants/${tenantId}/members/${userId}`, { method: 'DELETE' });
    },

    // Update a member's role
    updateMemberRole: async (tenantId, userId, roleData) => {
        return await client(`/tenants/${tenantId}/members/${userId}`, {
            method: 'PATCH',
            body: roleData,
        });
    },
};
