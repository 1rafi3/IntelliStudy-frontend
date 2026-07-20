import { api } from '@lib/axios';
import { ApiResponse } from '@/types';
import { RegisterDto, LoginDto, AuthResponse } from '../types';

export const authService = {
  register: async (data: RegisterDto): Promise<ApiResponse<AuthResponse>> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data;
  },

  login: async (data: LoginDto): Promise<ApiResponse<AuthResponse>> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const res = await api.post<ApiResponse<null>>('/auth/logout');
    return res.data;
  },

  loginWithGoogle: async (idToken: string): Promise<ApiResponse<AuthResponse>> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/google', { idToken });
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: AuthResponse['user'] }>> => {
    const res = await api.get<ApiResponse<{ user: AuthResponse['user'] }>>('/auth/me');
    return res.data;
  },
};
export default authService;
