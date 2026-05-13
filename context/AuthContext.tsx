'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface AuthUser {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  rol: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
}

function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async (t: string) => {
    try {
      const userData = await api.auth.me(t);
      setUser(userData);
      setRol(userData.rol);
    } catch {
      localStorage.removeItem('capi_token');
      setToken(null);
      setUser(null);
      setRol(null);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const savedToken = localStorage.getItem('capi_token');
        if (savedToken) {
          const payload = decodeTokenPayload(savedToken);
          setToken(savedToken);
          setRol((payload?.rol as string) || 'user');
          setUser({ id_usuario: 0, nombre: '', email: '', rol: '' });
          await fetchUser(savedToken);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [fetchUser]);

  const login = (newToken: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('capi_token', newToken);
      }
      const payload = decodeTokenPayload(newToken);
      setToken(newToken);
      setRol((payload?.rol as string) || 'user');
      setUser({ id_usuario: 0, nombre: '', email: '', rol: '' });
      fetchUser(newToken);

      setTimeout(() => {
        router.replace('/');
      }, 10);
    } catch (err) {
      console.error('Error saving token:', err);
    }
  };

  const logout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('capi_token');
      }
      setToken(null);
      setUser(null);
      setRol(null);
      router.replace('/login');
    } catch (err) {
      console.error('Error clearing session:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, rol, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
