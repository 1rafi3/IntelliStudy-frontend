import React, { createContext, useContext, useEffect } from 'react';
import { useUserQuery, useLogoutMutation } from '../hooks';
import { AuthResponse } from '../types';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hasAccessToken = !!localStorage.getItem('access_token');
  const { data: user, isLoading, refetch } = useUserQuery(hasAccessToken);
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    // If access token is present but user data is not cached, fetch it
    if (hasAccessToken && !user) {
      void refetch();
    }
  }, [hasAccessToken, user, refetch]);

  const value: AuthContextType = {
    user: user || null,
    isLoading: hasAccessToken ? isLoading : false,
    isAuthenticated: !!user,
    logout: () => {
      logoutMutation.mutate();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthProvider;
