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
  login: (token: string, refreshToken?: string) => void;
  logout: () => void;
  clearSession: () => void;
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

  const clearLocalSession = useCallback(() => {
    localStorage.removeItem('capi_token');
    localStorage.removeItem('capi_refresh_token');
    setToken(null);
    setUser(null);
    setRol(null);
  }, []);

  const fetchUser = useCallback(
    async (t: string) => {
      try {
        const userData = await api.auth.me(t);
        setUser(userData);
        setRol(userData.rol);
      } catch {
        const refresh = localStorage.getItem('capi_refresh_token');
        if (refresh) {
          try {
            const renewed = await api.auth.refresh(refresh);
            localStorage.setItem('capi_token', renewed.access_token);
            localStorage.setItem('capi_refresh_token', renewed.refresh_token);
            setToken(renewed.access_token);
            const userData = await api.auth.me(renewed.access_token);
            setUser(userData);
            setRol(userData.rol);
            return;
          } catch {
            // Caemos a cierre de sesión.
          }
        }
        clearLocalSession();
      }
    },
    [clearLocalSession],
  );

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

  const login = (newToken: string, refreshToken?: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('capi_token', newToken);
        if (refreshToken) localStorage.setItem('capi_refresh_token', refreshToken);
      }
      const payload = decodeTokenPayload(newToken);
      setToken(newToken);
      setRol((payload?.rol as string) || 'user');
      setUser({ id_usuario: 0, nombre: '', email: '', rol: '' });
      fetchUser(newToken);

      setTimeout(() => {
        router.replace('/app');
      }, 10);
    } catch (err) {
      console.error('Error saving token:', err);
    }
  };

  const clearSession = useCallback(() => {
    clearLocalSession();
  }, [clearLocalSession]);

  const logout = () => {
    try {
      if (token) api.auth.logout(token).catch(() => undefined);
      clearSession();
      router.replace('/login');
    } catch (err) {
      console.error('Error clearing session:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, rol, login, logout, clearSession, loading, setUser }}>
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
