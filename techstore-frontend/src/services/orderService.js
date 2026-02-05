import axios from 'axios';

const API_URL = '/orders';

export const orderService = {
    create: async (orderData) => {
        try {
            const response = await axios.post(API_URL, orderData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAll: async () => {
        try {
            const response = await axios.get(API_URL);
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
    }
};
