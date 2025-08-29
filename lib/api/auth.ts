import apiClient from './client';
import { API_ENDPOINTS } from './config';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  User,
  ChangePasswordRequest,
  SocialAuthRequest,
} from './types';

/**
 * Authentication API Service
 */
export const authApi = {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true,
    });
  },

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return apiClient<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
      skipAuth: true,
    });
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ tokens: { accessToken: string; refreshToken: string; expiresIn: number; tokenType: string } }> {
    return apiClient(API_ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      skipAuth: true,
    });
  },

  /**
   * Logout user
   */
  async logout(): Promise<{ message: string }> {
    return apiClient(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  },

  /**
   * Get user profile
   */
  async getProfile(): Promise<{ user: User }> {
    return apiClient(API_ENDPOINTS.USER.PROFILE);
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<User>): Promise<{ message: string; user: User }> {
    return apiClient(API_ENDPOINTS.USER.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  /**
   * Change password
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<{ message: string }> {
    return apiClient(API_ENDPOINTS.USER.CHANGE_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },

  /**
   * Delete account
   */
  async deleteAccount(password: string): Promise<{ message: string }> {
    return apiClient(API_ENDPOINTS.AUTH.DELETE_ACCOUNT, {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  },

  /**
   * Social authentication (Google, Facebook)
   */
  async socialAuth(socialData: SocialAuthRequest): Promise<AuthResponse> {
    return apiClient<AuthResponse>(API_ENDPOINTS.AUTH.SOCIAL_AUTH, {
      method: 'POST',
      body: JSON.stringify(socialData),
      skipAuth: true,
    });
  },
};
