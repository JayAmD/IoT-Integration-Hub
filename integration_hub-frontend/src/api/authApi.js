import client from './client.js';

export const authApi = {
    login: async (email, password) => {
        return await client('/auth/login', {
            method: 'POST',
            body: { email, password }
        });
    },

    signup: async (email, password) => {
        return await client('/auth/signup', {
            method: 'POST',
            body: { email, password }
        });
    }
};
