import client from './client.js';

export const authApi = {
    login: async (email, password) => {
        const response = await client('/auth/login', {
            method: 'POST',
            body: { email, password }
        });
        return response.data;
    },

    signup: async (email, password) => {
        const response = await client('/auth/signup', {
            method: 'POST',
            body: { email, password }
        });
        return response.data;
    }
};
