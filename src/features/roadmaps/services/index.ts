import { api } from '@lib/axios';
import { ApiResponse } from '@/types';
import { 
  CreateRoadmapDto, 
  UpdateRoadmapDto, 
  RoadmapResponse, 
  PaginatedRoadmapsResponse, 
  ListRoadmapsQueryParams 
} from '../types';

export const roadmapsService = {
  list: async (params?: ListRoadmapsQueryParams): Promise<ApiResponse<PaginatedRoadmapsResponse>> => {
    const res = await api.get<ApiResponse<PaginatedRoadmapsResponse>>('/roadmaps', { params });
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<RoadmapResponse>> => {
    const res = await api.get<ApiResponse<RoadmapResponse>>(`/roadmaps/${id}`);
    return res.data;
  },

  create: async (data: CreateRoadmapDto): Promise<ApiResponse<RoadmapResponse>> => {
    const res = await api.post<ApiResponse<RoadmapResponse>>('/roadmaps', data);
    return res.data;
  },

  update: async (id: string, data: UpdateRoadmapDto): Promise<ApiResponse<RoadmapResponse>> => {
    const res = await api.patch<ApiResponse<RoadmapResponse>>(`/roadmaps/${id}`, data);
    return res.data;
  },

  toggleArchive: async (id: string): Promise<ApiResponse<RoadmapResponse>> => {
    const res = await api.patch<ApiResponse<RoadmapResponse>>(`/roadmaps/${id}/archive`);
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await api.delete<ApiResponse<null>>(`/roadmaps/${id}`);
    return res.data;
  },
};
export default roadmapsService;
