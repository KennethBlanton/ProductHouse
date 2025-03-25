// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  // For development, let's implement a mock login
  useEffect(() => {
    // Simulate checking authentication status
    const checkAuth = async () => {
      try {
        // For development, we'll default to not authenticated
        // In production, this would check session/token validity
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: 'Failed to check authentication status',
        });
      }
    };

    checkAuth();
  }, []);

  const login = async () => {
    try {
      setAuthState({
        ...authState,
        loading: true,
        error: null,
      });

      // Simulate login process
      // In production, this would call your authentication API
      const mockUser: User = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      };

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setAuthState({
        isAuthenticated: true,
        user: mockUser,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        ...authState,
        loading: false,
        error: 'Failed to login',
      });
    }
  };

  const logout = async () => {
    try {
      setAuthState({
        ...authState,
        loading: true,
        error: null,
      });

      // Simulate logout process
      // In production, this would call your authentication API
      await new Promise(resolve => setTimeout(resolve, 500));

      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        ...authState,
        loading: false,
        error: 'Failed to logout',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}