import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; password: string; full_name: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: localStorage.getItem('token'),
  });

  useEffect(() => {
    // Check if token exists and validate it
    const token = localStorage.getItem('token');
    if (token) {
      // Here you would typically validate the token with the backend
      setAuthState(prev => ({ ...prev, token, isAuthenticated: true }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      setAuthState({
        user: null, // You'd fetch user data here
        isAuthenticated: true,
        token: access_token,
      });
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: { email: string; password: string; full_name: string }) => {
    try {
      const response = await authAPI.register(userData);
      // Auto-login after registration or redirect to login
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      token: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
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