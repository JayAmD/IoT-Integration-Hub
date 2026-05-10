import client from './client.js';

export const userApi = {
    getMe: async () => {
        const response = await client('/users/me', {
            method: 'GET'
        });
        return response.data;
    },

    updatePassword: async (oldPassword, newPassword) => {
        const response = await client('/users/password', {
            method: 'PATCH',
            body: { oldPassword, newPassword }
        });
        return response.data;
    },

    deleteMe: async () => {
        const response = await client('/users/me', {
            method: 'DELETE'
        });
        return response.data;
    }
};
