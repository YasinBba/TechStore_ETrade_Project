import axios from 'axios';

const API_URL = '/products';

export const productService = {
    getAll: async (params) => {
        try {
            const response = await axios.get(API_URL, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getBySlug: async (slug) => {
        try {
            const response = await axios.get(`${API_URL}/slug/${slug}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getFeatured: async (count = 10) => {
        try {
            const response = await axios.get(`${API_URL}/featured`, { params: { count } });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
