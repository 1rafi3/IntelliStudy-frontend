import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services';
import { UpdateProfileDto, ChangePasswordDto } from '../types';
import toast from 'react-hot-toast';

export const useProfileQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
    enabled,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => profileService.updateProfile(dto),
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      toast.success('Profile updated successfully');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (dto: ChangePasswordDto) => profileService.changePassword(dto),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to change password';
      toast.error(msg);
    },
  });
};

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (avatar: string) => profileService.uploadAvatar(avatar),
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      toast.success('Avatar updated successfully');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to update avatar';
      toast.error(msg);
    },
  });
};
