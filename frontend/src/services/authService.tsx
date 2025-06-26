// frontend/book-manager/src/services/authService.tsx
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE = import.meta.env.VITE_API_URL;

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface UserClaims {
  sub: string;
  name: string;
  role: string;
  exp: number;
}

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      return false;
    }
    
    const tokens: AuthTokens = await response.json();
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

export const signup = async (email: string, username: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });

    if (!response.ok) {
      return false;
    }
    const tokens: AuthTokens = await response.json();
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    return true;
  } catch (error) {
    console.error('Signup failed:', error);
    return false;
  }
};

export const getUser = (): UserClaims | null => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  try {
    return jwtDecode<UserClaims>(token);
  } catch {
    return null;
  }
};

// Create an authenticated API service
export const createAuthenticatedApi = () => {
  const api = axios.create({
    baseURL: API_BASE,
  });

  api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};
