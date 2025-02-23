'use client';

import { authService } from '@/services/auth/service';
import { Profile } from '@/services/auth/types';
import { useRouter } from 'next/navigation';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { toast } from 'sonner';

interface AuthContextType {
  user: Profile | null | undefined;
  loading: boolean;
  logout: () => void;
  fetchProfile: (_user_id_prop?: string) => Promise<Profile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Profile | undefined | null>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const { push } = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const logout = (): void => {
    setUser(undefined);
    localStorage.removeItem('user_id');
    toast.success('Logged out successfully');
    push('/login');
  };

  const fetchProfile = async (user_id_prop?: string) => {
    setUser(undefined);
    setLoading(true);
    const user_id =
      user_id_prop || (localStorage.getItem('user_id') as string | undefined);
    if (user_id) {
      const response = await authService.fetchProfile(
        {
          user_id
        },
        {}
      );
      if (response.error) {
        setUser(null);
        if (response.error.response?.data.message === 'not found') {
          localStorage.removeItem('user_id');
          toast.error('Account not found. Please log in again');
          push(`/login`);
        }
        return null;
      } else if (response.data) {
        localStorage.setItem('user_id', response.data.id);
        setUser(response.data);
        return response.data;
      }
    } else {
      setUser(null);
      return null;
    }
    setLoading(false);
    return null;
  };

  const value = {
    user,
    loading,
    logout,
    fetchProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
