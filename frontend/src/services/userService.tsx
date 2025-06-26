import { createAuthenticatedApi } from './authService';
import type { UserProfile } from '../types/User';

const api = createAuthenticatedApi();

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<UserProfile>('/api/users/profile');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
}; 