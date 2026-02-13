import api from './api';

const cartService = {
    // Get user's cart
    getCart: async () => {
        try {
            const response = await api.get('/carts');
            return response.data;
        } catch (error) {
            console.error('Get cart error:', error);
            return { success: false, message: error.response?.data?.message || 'Sepet yüklenirken hata oluştu' };
        }
    },

    // Add item to cart
    addItem: async (productId, quantity = 1) => {
        try {
            const response = await api.post('/carts/items', { productId, quantity });
            return response.data;
        } catch (error) {
            console.error('Add to cart error:', error);
            return { success: false, message: error.response?.data?.message || 'Sepete eklenirken hata oluştu' };
        }
    },

    // Update cart item quantity
    updateItem: async (cartItemId, quantity) => {
        try {
            const response = await api.put(`/carts/items/${cartItemId}`, { quantity });
            return response.data;
        } catch (error) {
            console.error('Update cart item error:', error);
            return { success: false, message: error.response?.data?.message || 'Güncelleme başarısız' };
        }
    },

    // Remove item from cart
    removeItem: async (cartItemId) => {
        try {
            const response = await api.delete(`/carts/items/${cartItemId}`);
            return response.data;
        } catch (error) {
            console.error('Remove from cart error:', error);
            return { success: false, message: error.response?.data?.message || 'Silme başarısız' };
        }
    },

    // Clear cart
    clearCart: async () => {
        try {
            const response = await api.delete('/carts');
            return response.data;
        } catch (error) {
            console.error('Clear cart error:', error);
            return { success: false, message: error.response?.data?.message || 'Sepet temizlenemedi' };
        }
    }
};

export default cartService;
