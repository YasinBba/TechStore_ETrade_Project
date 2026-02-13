import api from './api';

const API_URL = '/orders';

export const orderService = {
    create: async (orderData) => {
        try {
            const response = await api.post(API_URL, orderData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAll: async () => {
        try {
            const response = await api.get(API_URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateStatus: async (id, status) => {
        try {
            const response = await api.put(`${API_URL}/${id}/status`, JSON.stringify(status), {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
