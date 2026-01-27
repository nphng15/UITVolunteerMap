import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, ApiResponse, LoginResponse } from '@uit-volunteer-map/shared';
import { API_ROUTES, STORAGE_KEYS } from '@uit-volunteer-map/shared';
import { AuthContext } from './AuthContext';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch(API_ROUTES.AUTH.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const response: ApiResponse<LoginResponse> = await res.json();

    if (!res.ok || !response.success || !response.data) {
      throw new Error(response.error || 'Login failed');
    }

    const { token: newToken, user: newUser } = response.data;

    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(newUser));
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(API_ROUTES.AUTH.LOGOUT, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
    } catch {
      // Ignore logout API errors
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
