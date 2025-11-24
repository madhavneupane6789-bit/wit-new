import React, { createContext, useEffect, useState } from 'react';
import * as authApi from '../services/authApi';
import { User } from '../services/authApi';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<User | null>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
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
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const refresh = async () => {
    try {
      const me = await authApi.refresh();
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    } finally {
      setInitialized(true);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const me = await authApi.login({ email, password });
      setUser(me);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, initialized, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};
