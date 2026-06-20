/**
 * Mock Auth API for Presentation Mode
 */

import { User, LoginRequest, RegisterRequest, AuthTokens } from '@/types';
import { mockDb } from './mockDb';

const isClient = typeof window !== 'undefined';
const CURRENT_USER_KEY = 'pqc_current_user';
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<User> => {
    // Delay to simulate network
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = mockDb.getUsers();
    const existing = users.find(u => u.email === data.email);
    if (existing) {
      throw {
        response: {
          data: {
            message: 'Email already registered',
          }
        }
      };
    }

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
      id: newId,
      email: data.email,
      full_name: data.full_name || null,
      organization_name: data.organization_name || null,
      is_active: true,
      is_superuser: false,
      is_verified: true,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };

    mockDb.saveUser(newUser);
    return newUser;
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<AuthTokens> => {
    // Delay to simulate network
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const users = mockDb.getUsers();
    const user = users.find(u => u.email === data.email);
    
    // Accept Shield@1234 or direct match for demo
    if (!user || (data.password !== 'Shield@1234' && data.password !== 'password')) {
      throw {
        response: {
          data: {
            message: 'Invalid email or password',
          }
        }
      };
    }

    if (isClient) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      localStorage.setItem(ACCESS_TOKEN_KEY, 'mock-access-token-' + user.id);
      localStorage.setItem(REFRESH_TOKEN_KEY, 'mock-refresh-token-' + user.id);
    }

    return {
      access_token: 'mock-access-token-' + user.id,
      refresh_token: 'mock-refresh-token-' + user.id,
      token_type: 'bearer',
      expires_in: 3600,
    };
  },

  /**
   * Logout user
   */
  logout: async (refreshToken: string): Promise<void> => {
    if (isClient) {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<User> => {
    if (!isClient) return mockDb.getUsers()[0];
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    if (!userStr) {
      throw {
        response: {
          status: 401,
          data: { message: 'Not authenticated' }
        }
      };
    }
    return JSON.parse(userStr);
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const user = await authApi.getCurrentUser();
    const updatedUser = { ...user, ...data };
    
    mockDb.saveUser(updatedUser);
    if (isClient) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
    return updatedUser;
  },

  /**
   * Update password
   */
  updatePassword: async (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },

  /**
   * Refresh tokens
   */
  refreshTokens: async (refreshToken: string): Promise<AuthTokens> => {
    const user = await authApi.getCurrentUser();
    return {
      access_token: 'mock-access-token-' + user.id,
      refresh_token: 'mock-refresh-token-' + user.id,
      token_type: 'bearer',
      expires_in: 3600,
    };
  },
};