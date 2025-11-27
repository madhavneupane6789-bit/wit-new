import React, { createContext, useEffect, useState } from 'react';
import * as authApi from '../services/authApi';
import { User } from '../services/authApi';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<User | null>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  login: async () => {
    return {} as User;
  },
  register: async () => {
    return {} as User;
  },
  logout: async () => {},
  refresh: async () => {
    return null;
  },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const me = await authApi.refresh();
      setUser(me);
      setIsAuthenticated(true);
      return me;
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const initializeAuth = async () => {
    setLoading(true);
    try {
      const me = await authApi.me();
      setUser(me);
      setIsAuthenticated(true);
    } catch {
      // attempt refresh if /me fails (e.g., access token expired)
      try {
        const me = await refresh();
        if (me) {
          setIsAuthenticated(true);
          return;
        }
      } catch {
        // ignore
      }
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setInitialized(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const me = await authApi.login({ email, password });
      setUser(me);
      setIsAuthenticated(true);
      return me;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const me = await authApi.register({ name, email, password });
      setUser(me);
      setIsAuthenticated(true);
      return me;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, initialized, login, register, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
};
