import { api } from '@lib/axios';
import { AnalyticsData } from '../types';

export const analyticsService = {
  getAnalytics: async (): Promise<AnalyticsData> => {
    const res = await api.get('/analytics');
    return res.data.data;
  },
};
export default analyticsService;
