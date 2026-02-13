import api from './api';

export const contentService = {
    getBanners: async (activeOnly = true) => {
        try {
            const response = await api.get(`/content/banners?activeOnly=${activeOnly}`);
            return response.data;
        } catch (error) {
            console.error('Banners fetch error:', error);
            return { success: false, message: 'Bannerlar alınamadı' };
        }
    },

    createBanner: async (bannerData) => {
        try {
            const response = await api.post('/content/banners', bannerData);
            return response.data;
        } catch (error) {
            console.error('Banner create error:', error);
            return { success: false, message: error.response?.data?.message || 'Banner oluşturulamadı' };
        }
    },

    updateBanner: async (id, bannerData) => {
        try {
            const response = await api.put(`/content/banners/${id}`, bannerData);
            return response.data;
        } catch (error) {
            console.error('Banner update error:', error);
            return { success: false, message: error.response?.data?.message || 'Banner güncellenemedi' };
        }
    },

    deleteBanner: async (id) => {
        try {
            const response = await api.delete(`/content/banners/${id}`);
            return response.data;
        } catch (error) {
            console.error('Banner delete error:', error);
            return { success: false, message: 'Banner silinemedi' };
        }
    }
};
