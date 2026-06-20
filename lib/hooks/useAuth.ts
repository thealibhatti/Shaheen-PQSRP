'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi, clearTokens, getAccessToken } from '@/lib/api';
import { LoginRequest, RegisterRequest, User } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    retry: false,
    enabled: !!getAccessToken(),
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
        variant: 'destructive',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      toast({
        title: 'Account created!',
        description: 'Please log in with your new credentials.',
      });
      router.push('/login');
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      // Ignore errors during logout
    } finally {
      clearTokens();
      queryClient.clear();
      router.push('/login');
    }
  };

  return {
    user,
    isLoading,
    isError,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout,
    refetch,
  };
}