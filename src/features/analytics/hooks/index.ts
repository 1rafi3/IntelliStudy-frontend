import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services';

export const useAnalyticsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: () => analyticsService.getAnalytics(),
    enabled,
  });
};
