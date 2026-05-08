import client from './client.js';

export const groupApi = {
    // Fetch all groups
    list: async () => {
        return await client('/groups', { method: 'GET' });
    },

    // Fetch a single group by its ID
    getById: async (id) => {
        return await client(`/groups/${id}`, { method: 'GET' });
    },

    // Create a new group
    create: async (groupData) => {
        return await client('/groups', {
            method: 'POST',
            body: groupData,
        });
    },

    // Update an existing group by its ID
    update: async (id, updateData) => {
        return await client(`/groups/${id}`, {
            method: 'PATCH',
            body: updateData,
        });
    },

    // Delete a group by its ID
    delete: async (id) => {
        return await client(`/groups/${id}`, { method: 'DELETE' });
    }
};