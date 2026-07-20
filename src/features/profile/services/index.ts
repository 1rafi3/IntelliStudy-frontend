import { api } from '@lib/axios';
import { UserProfile, UpdateProfileDto, ChangePasswordDto } from '../types';

export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    const res = await api.get('/profile');
    return res.data.data;
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<UserProfile> => {
    const res = await api.put('/profile', dto);
    return res.data.data;
  },

  changePassword: async (dto: ChangePasswordDto): Promise<void> => {
    await api.put('/profile/password', dto);
  },

  uploadAvatar: async (avatar: string): Promise<UserProfile> => {
    const res = await api.put('/profile/avatar', { avatar });
    return res.data.data;
  },
};

export default profileService;
