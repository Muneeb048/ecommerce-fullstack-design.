import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, meRequest, registerRequest } from '../lib/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'ecomm_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async (activeToken) => {
    const t = activeToken ?? localStorage.getItem(TOKEN_KEY);
    if (!t) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await meRequest();
      setUser(data.user);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      refreshUser(token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setLoading(false);
    }
  }, [token, refreshUser]);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest({ email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await registerRequest(payload);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      setToken,
      isAdmin: user?.role === 'admin',
    }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
