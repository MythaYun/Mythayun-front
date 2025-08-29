import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api';
import type { User, LoginRequest, RegisterRequest } from '@/lib/api';

// Extend API User type with isAdmin for frontend-specific needs
interface AuthUser extends User {
  isAdmin?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<AuthUser>) => Promise<void>;
  
  // Internal setters (for API client)
  setUser: (user: AuthUser | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      
      // API Actions
      login: async (credentials: LoginRequest): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          
          // Store tokens in localStorage for the API client
          localStorage.setItem('accessToken', response.tokens.accessToken);
          localStorage.setItem('refreshToken', response.tokens.refreshToken);
          
          set({
            user: response.user,
            isAuthenticated: true,
            isAdmin: false, // Default to false, can be updated from admin endpoints
            accessToken: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Login failed',
          });
          throw error;
        }
      },
      
      register: async (userData: RegisterRequest): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
          await authApi.register(userData);
          
          // Registration successful - don't auto-login
          // User will need to login manually after registration
          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Registration failed',
          });
          throw error;
        }
      },
      
      logout: async (): Promise<void> => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch (error) {
          console.warn('Logout API call failed:', error);
        } finally {
          // Complete localStorage cleanup - remove all stored data
          localStorage.clear();
          
          // Also clear sessionStorage if any data is stored there
          sessionStorage.clear();
          
          // Reset auth store state
          set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
          });
        }
      },
      
      refreshUserProfile: async (): Promise<void> => {
        try {
          const response = await authApi.getProfile();
          set({
            user: response.user,
            isAuthenticated: true,
            isAdmin: false, // Default to false, can be updated from admin endpoints
          });
        } catch (error: any) {
          console.error('Failed to refresh user profile:', error);
          // If profile fetch fails, user might be logged out
          if (error.status === 401) {
            get().clearAuth();
          }
        }
      },
      
      updateProfile: async (profileData: Partial<User>): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.updateProfile(profileData);
          set({
            user: response.user,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Profile update failed',
          });
          throw error;
        }
      },
      
      // Internal setters (used by API client and other parts)
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin
      }),
      
      setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ 
          accessToken, 
          refreshToken,
        });
      },
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      clearAuth: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          accessToken: null,
          refreshToken: null,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
