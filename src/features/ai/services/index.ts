import { api } from '@lib/axios';
import { ApiResponse } from '@/types';
import { GenerateRoadmapDto, SaveRoadmapDto, AIHistoryResponse } from '../types';

export const aiService = {
  generateRoadmap: async (data: GenerateRoadmapDto): Promise<ApiResponse<Record<string, any>>> => {
    const res = await api.post<ApiResponse<Record<string, any>>>('/ai/generate-roadmap', data);
    return res.data;
  },

  getHistory: async (): Promise<ApiResponse<AIHistoryResponse[]>> => {
    const res = await api.get<ApiResponse<AIHistoryResponse[]>>('/ai/history');
    return res.data;
  },

  deleteHistory: async (id: string): Promise<ApiResponse<null>> => {
    const res = await api.delete<ApiResponse<null>>(`/ai/history/${id}`);
    return res.data;
  },

  saveRoadmap: async (data: SaveRoadmapDto): Promise<ApiResponse<Record<string, any>>> => {
    const res = await api.post<ApiResponse<Record<string, any>>>('/ai/save-roadmap', data);
    return res.data;
  },
};
export default aiService;
