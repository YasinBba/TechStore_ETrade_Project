import api from './api';

const API_URL = '/reviews';

export const reviewService = {
    // Get reviews for a product
    async getProductReviews(productId, includeUnapproved = false) {
        const response = await api.get(`${API_URL}/product/${productId}`, {
            params: { includeUnapproved }
        });
        return response.data;
    },

    // Get review summary for a product
    async getProductReviewSummary(productId) {
        const response = await api.get(`${API_URL}/product/${productId}/summary`);
        return response.data;
    },

    // Get current user's reviews
    async getMyReviews() {
        const response = await api.get(`${API_URL}/my-reviews`);
        return response.data;
    },

    // Get pending reviews (admin only)
    async getPendingReviews() {
        const response = await api.get(`${API_URL}/pending`);
        return response.data;
    },

    // Get single review by ID
    async getReviewById(id) {
        const response = await api.get(`${API_URL}/${id}`);
        return response.data;
    },

    // Create new review
    async createReview(data) {
        const response = await api.post(API_URL, data);
        return response.data;
    },

    // Update review
    async updateReview(id, data) {
        const response = await api.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    // Delete review
    async deleteReview(id) {
        const response = await api.delete(`${API_URL}/${id}`);
        return response.data;
    },

    // Mark review as helpful
    async markAsHelpful(id) {
        const response = await api.post(`${API_URL}/${id}/helpful`);
        return response.data;
    },

    // Approve review (admin only)
    async approveReview(id) {
        const response = await api.put(`${API_URL}/${id}/approve`);
        return response.data;
    }
};
