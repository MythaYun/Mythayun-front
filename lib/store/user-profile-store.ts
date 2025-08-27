import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api';
import type { User } from '@/lib/api';

interface UserProfile extends User {
  // Additional frontend-specific fields
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  updateAvatar: (avatarFile: File) => Promise<void>;
  clearError: () => void;
  setProfile: (profile: UserProfile | null) => void;
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,

      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.getProfile();
          
          // Convert API User to UserProfile
          const profile: UserProfile = {
            ...response.user,
            displayName: response.user.fullName,
          };
          
          set({
            profile,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Failed to fetch user profile:', error);
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch profile',
          });
        }
      },

      updateProfile: async (profileData: Partial<UserProfile>) => {
        set({ isLoading: true, error: null });
        try {
          // Extract API-compatible fields
          const apiData = {
            fullName: profileData.fullName,
            profilePicture: profileData.profilePicture,
            timezone: profileData.timezone,
            language: profileData.language,
            isPrivate: profileData.isPrivate,
          };

          const response = await authApi.updateProfile(apiData);
          
          // Update local profile with response
          const updatedProfile: UserProfile = {
            ...get().profile!,
            ...response.user,
            displayName: response.user.fullName,
            // Keep frontend-specific fields
            ...profileData,
          };
          
          set({
            profile: updatedProfile,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Failed to update profile:', error);
          set({
            isLoading: false,
            error: error.message || 'Failed to update profile',
          });
          throw error;
        }
      },

      updateAvatar: async (avatarFile: File) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Implement avatar upload when backend supports it
          // For now, we'll create a placeholder URL
          const avatarUrl = URL.createObjectURL(avatarFile);
          
          await get().updateProfile({
            profilePicture: avatarUrl,
          });
        } catch (error: any) {
          console.error('Failed to update avatar:', error);
          set({
            isLoading: false,
            error: error.message || 'Failed to update avatar',
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setProfile: (profile: UserProfile | null) => {
        set({ profile });
      },
    }),
    {
      name: 'user-profile-storage',
      partialize: (state) => ({
        profile: state.profile,
      }),
    }
  )
);
