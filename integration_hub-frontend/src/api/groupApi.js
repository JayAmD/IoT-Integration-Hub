import client from './client.js';

export const groupApi = {
    list: async () => {
        return await client('/groups', { method: 'GET' });
    }
};