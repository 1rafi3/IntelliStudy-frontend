import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roadmapsService } from '../services';
import { CreateRoadmapDto, UpdateRoadmapDto, ListRoadmapsQueryParams } from '../types';
import toast from 'react-hot-toast';

// ─── Query Hooks ──────────────────────────────────────────────────────────────

export const useRoadmapsQuery = (params?: ListRoadmapsQueryParams) => {
  return useQuery({
    queryKey: ['roadmaps', params],
    queryFn: async () => {
      const res = await roadmapsService.list(params);
      return res.data;
    },
  });
};

export const useRoadmapQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['roadmap', id],
    queryFn: async () => {
      const res = await roadmapsService.getById(id);
      return res.data;
    },
    enabled: !!id && enabled,
  });
};

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export const useCreateRoadmapMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoadmapDto) => roadmapsService.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      toast.success(res.message || 'Roadmap created successfully');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to create roadmap';
      toast.error(msg);
    },
  });
};

export const useUpdateRoadmapMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoadmapDto }) => 
      roadmapsService.update(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap', variables.id] });
      toast.success(res.message || 'Roadmap updated successfully');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to update roadmap';
      toast.error(msg);
    },
  });
};

export const useToggleArchiveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roadmapsService.toggleArchive(id),
    onSuccess: (res, id) => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap', id] });
      toast.success(res.message || 'Roadmap updated successfully');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to update archive status';
      toast.error(msg);
    },
  });
};

export const useDeleteRoadmapMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roadmapsService.delete(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      toast.success(res.message || 'Roadmap deleted successfully');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to delete roadmap';
      toast.error(msg);
    },
  });
};
