import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recommendationService } from '../services';
import toast from 'react-hot-toast';

export const useRecommendationsQuery = () => {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: () => recommendationService.getAll(),
  });
};

export const useRefreshRecommendationsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => recommendationService.refresh(),
    onSuccess: (data) => {
      queryClient.setQueryData(['recommendations'], data);
      toast.success('Recommendations updated successfully!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to refresh recommendations';
      toast.error(msg);
    },
  });
};

export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recommendationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      toast.success('Task marked as completed');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to update recommendation';
      toast.error(msg);
    },
  });
};

export const useDeleteRecommendationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recommendationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      toast.success('Recommendation dismissed');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to dismiss recommendation';
      toast.error(msg);
    },
  });
};
