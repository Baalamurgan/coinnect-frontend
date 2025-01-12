'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction
} from 'react';
import { useRouter } from 'next/navigation';
import { authService } from 'services/auth/service';
import { toast } from 'sonner';
import { Profile } from 'services/auth/types';

interface AuthContextType {
  user: Profile | null | undefined;
  loading: boolean;
  logout: () => void;
  fetchProfile: () => Promise<void>;
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
    localStorage.removeItem('email');
    toast.success('Logged out successfully');
    push('/login');
  };

  const fetchProfile = async () => {
    setUser(undefined);
    setLoading(true);
    const email = localStorage.getItem('email') as string | undefined;
    if (email) {
      const response = await authService.fetchProfile(
        {
          email
        },
        {}
      );
      if (response.error) setUser(null);
      else if (response.data) setUser(response.data);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const value = {
    user,
    loading,
    logout,
    fetchProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
