'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  synced: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOKEN: 'sel_auth_token',
  USER: 'sel_auth_user',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Auth from LocalStorage on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const savedUserStr = localStorage.getItem(STORAGE_KEYS.USER);

        if (savedToken && savedUserStr) {
          const parsedUser = JSON.parse(savedUserStr);
          // Normalize role to Uppercase to match the User interface
          if (parsedUser.role) {
            parsedUser.role = parsedUser.role.toUpperCase();
          }
          
          setToken(savedToken);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Auth recovery failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (userId: string, password: string) => {
    setIsLoading(true);
    try {
      // Use relative URL to avoid CORS issues and work with any backend origin
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, password }),
        credentials: 'include', 
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // 3. Map backend response to our User interface
      // Note: your backend returns user info inside data.user
      const userObj: User = {
        id: data.user.id,
        email: data.user.dbData?.email || data.user.id,
        role: data.user.role.toUpperCase(), 
        synced: data.synced,
      };

      // 4. Update Local Storage for persistence across refreshes
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.access_token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));

      // 5. Update State
      setToken(data.access_token);
      setUser(userObj);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    // Force a full redirect to clear any residual state/cookies
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isLoading, 
        login, 
        logout, 
        isAuthenticated: !!token && !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};