import api from './api';

const API_URL = '/brands';

export const brandService = {
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

    create: async (data) => {
        try {
            const response = await api.post(API_URL, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id, data) => {
        try {
            const response = await api.put(`${API_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
