import api from './api';

export const dashboardService = {
    getSummary: async () => {
        try {
            const response = await api.get('/dashboard/summary');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Dashboard summary fetch error:', error);
            return { success: false, message: error.response?.data?.message || 'İstatistikler alınamadı' };
        }
    }
};
