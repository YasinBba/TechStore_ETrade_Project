import api from './api';

export const stockService = {
    updateStock: async (productId, newStock, reason) => {
        try {
            const response = await api.post('/stock/update', { productId, newStock, reason });
            return response.data;
        } catch (error) {
            console.error('Stock update error:', error);
            return { success: false, message: error.response?.data?.message || 'Stok güncellenemedi' };
        }
    },

    getHistory: async (productId) => {
        try {
            const response = await api.get(`/stock/history/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Stock history fetch error:', error);
            return { success: false, message: 'Geçmiş alınamadı' };
        }
    },

    getLowStock: async (threshold = 10) => {
        try {
            const response = await api.get(`/stock/low-stock?threshold=${threshold}`);
            return response.data;
        } catch (error) {
            console.error('Low stock fetch error:', error);
            return { success: false, message: 'Veri alınamadı' };
        }
    }
};
