import api from './api';

const API_URL = '/users';

export const userService = {
    // Get user profile
    async getProfile() {
        const response = await api.get(`${API_URL}/profile`);
        return response.data;
    },

    // Update user profile
    async updateProfile(profileData) {
        const response = await api.put(`${API_URL}/profile`, profileData);
        return response.data;
    },

    // Change password
    async changePassword(passwordData) {
        const response = await api.post(`${API_URL}/change-password`, passwordData);
        return response.data;
    }
};
