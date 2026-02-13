import api from './api';

const API_URL = '/addresses';

export const addressService = {
    // Get all user addresses
    async getUserAddresses() {
        const response = await api.get(API_URL);
        return response.data;
    },

    // Get single address
    async getAddress(id) {
        const response = await api.get(`${API_URL}/${id}`);
        return response.data;
    },

    // Create new address
    async createAddress(addressData) {
        const response = await api.post(API_URL, addressData);
        return response.data;
    },

    // Update address
    async updateAddress(id, addressData) {
        const response = await api.put(`${API_URL}/${id}`, addressData);
        return response.data;
    },

    // Delete address
    async deleteAddress(id) {
        const response = await api.delete(`${API_URL}/${id}`);
        return response.data;
    },

    // Set default address
    async setDefaultAddress(id) {
        const response = await api.put(`${API_URL}/${id}/set-default`);
        return response.data;
    }
};
