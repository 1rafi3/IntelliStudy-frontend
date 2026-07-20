import { api } from '@/lib/axios';
import { Recommendation } from '../types';

export const recommendationService = {
  /**
   * Fetch all unread recommendations for the user.
   */
  getAll: async (): Promise<Recommendation[]> => {
    const response = await api.get('/recommendations');
    return response.data.data;
  },

  /**
   * Manually trigger regeneration of recommendations.
   */
  refresh: async (): Promise<Recommendation[]> => {
    const response = await api.post('/recommendations/refresh');
    return response.data.data;
  },

  /**
   * Mark a recommendation as read.
   */
  markAsRead: async (id: string): Promise<Recommendation> => {
    const response = await api.patch(`/recommendations/${id}/read`);
    return response.data.data;
  },

  /**
   * Dismiss/Delete a recommendation.
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/recommendations/${id}`);
  },
};
export default recommendationService;
