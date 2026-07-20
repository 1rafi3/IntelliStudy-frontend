import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services';
import { RegisterDto, LoginDto } from '../types';
import toast from 'react-hot-toast';

export { useAuth } from '../context/AuthContext';

export const useUserQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const res = await authService.getMe();
      return res.data?.user || null;
    },
    staleTime: Infinity, // User session is stable unless explicitly updated or logged out
    enabled,
    retry: false,
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: (res) => {
      if (res.data) {
        localStorage.setItem('access_token', res.data.accessToken);
        queryClient.setQueryData(['auth-user'], res.data.user);
      }
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
    onSuccess: (res) => {
      if (res.data) {
        localStorage.setItem('access_token', res.data.accessToken);
        queryClient.setQueryData(['auth-user'], res.data.user);
      }
    },
  });
};

export const useGoogleLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idToken: string) => authService.loginWithGoogle(idToken),
    onSuccess: (res) => {
      if (res.data) {
        localStorage.setItem('access_token', res.data.accessToken);
        queryClient.setQueryData(['auth-user'], res.data.user);
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Google sign-in failed';
      toast.error(msg);
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      localStorage.removeItem('access_token');
      queryClient.setQueryData(['auth-user'], null);
      queryClient.invalidateQueries();
      toast.success('Logged out successfully');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Logout failed';
      toast.error(msg);
    },
  });
};
