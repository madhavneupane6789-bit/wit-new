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
  showCookieMessage: boolean;
  dismissCookieMessage: () => void;
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
  showCookieMessage: false,
  dismissCookieMessage: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showCookieMessage, setShowCookieMessage] = useState(false);

  const COOKIE_MESSAGE_DISMISSED_KEY = 'cookieMessageDismissed';
  const COOKIE_MESSAGE_TIMEOUT_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

  const dismissCookieMessage = () => {
    localStorage.setItem(COOKIE_MESSAGE_DISMISSED_KEY, Date.now().toString());
    setShowCookieMessage(false);
  };

  const checkCookieMessage = (currentUser: User | null) => {
    if (!currentUser) {
      setShowCookieMessage(false);
      return;
    }

    const dismissedTimestamp = localStorage.getItem(COOKIE_MESSAGE_DISMISSED_KEY);
    if (dismissedTimestamp) {
      const timeSinceDismissed = Date.now() - parseInt(dismissedTimestamp, 10);
      if (timeSinceDismissed < COOKIE_MESSAGE_TIMEOUT_MS) {
        setShowCookieMessage(false);
        return;
      }
    }

    // Show if lastLoginDate is null (first login) or if it's been more than a day
    const oneDay = 1000 * 60 * 60 * 24;
    const lastLogin = currentUser.lastLoginDate ? new Date(currentUser.lastLoginDate).getTime() : 0;
    const timeSinceLastLogin = Date.now() - lastLogin;

    if (!currentUser.lastLoginDate || timeSinceLastLogin > oneDay) {
      setShowCookieMessage(true);
    } else {
      setShowCookieMessage(false);
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const me = await authApi.refresh();
      setUser(me);
      setIsAuthenticated(true);
      checkCookieMessage(me);
      return me;
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      setShowCookieMessage(false);
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
      checkCookieMessage(me);
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
      setShowCookieMessage(false);
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
      checkCookieMessage(me);
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
      checkCookieMessage(me);
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
      setShowCookieMessage(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, initialized, login, register, logout, refresh, showCookieMessage, dismissCookieMessage }}
    >
      {children}
    </AuthContext.Provider>
  );
};
