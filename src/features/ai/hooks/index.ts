import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService } from '../services';
import { GenerateRoadmapDto, SaveRoadmapDto } from '../types';
import toast from 'react-hot-toast';

export const useAIHistoryQuery = () => {
  return useQuery({
    queryKey: ['ai-history'],
    queryFn: async () => {
      const res = await aiService.getHistory();
      return res.data;
    },
  });
};

export const useGenerateRoadmapMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateRoadmapDto) => aiService.generateRoadmap(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['ai-history'] });
      toast.success(res.message || 'Roadmap generated successfully!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to generate roadmap';
      toast.error(msg);
    },
  });
};

export const useSaveRoadmapMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveRoadmapDto) => aiService.saveRoadmap(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      toast.success(res.message || 'Roadmap saved to your dashboard');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to save roadmap';
      toast.error(msg);
    },
  });
};

export const useDeleteHistoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiService.deleteHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-history'] });
      toast.success('History record removed');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to remove history record';
      toast.error(msg);
    },
  });
};
