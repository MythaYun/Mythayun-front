import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Team {
  id: string;
  name: string;
  logo?: string;
  league?: string;
  isCustom?: boolean;
}

export interface UserPreferences {
  // Onboarding data
  selectedTeams: Team[];
  notificationsEnabled: boolean;
  onboardingCompleted: boolean;
  
  // Additional preferences
  favoriteLeagues: string[];
  preferredLanguage: string;
  theme: 'light' | 'dark' | 'auto';
  
  // Match preferences
  showLiveScores: boolean;
  showUpcomingMatches: boolean;
  showFinishedMatches: boolean;
  
  // Notification preferences
  matchStartNotifications: boolean;
  goalNotifications: boolean;
  finalResultNotifications: boolean;
}

interface UserPreferencesState extends UserPreferences {
  // Actions
  setSelectedTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  removeTeam: (teamId: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  
  // Getters
  getTeamsByLeague: (league: string) => Team[];
  isTeamFollowed: (teamId: string) => boolean;
  getFollowedTeamIds: () => string[];
}

const defaultPreferences: UserPreferences = {
  selectedTeams: [],
  notificationsEnabled: true,
  onboardingCompleted: false,
  favoriteLeagues: [],
  preferredLanguage: 'en',
  theme: 'auto',
  showLiveScores: true,
  showUpcomingMatches: true,
  showFinishedMatches: true,
  matchStartNotifications: true,
  goalNotifications: true,
  finalResultNotifications: true,
};

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set, get) => ({
      ...defaultPreferences,
      
      setSelectedTeams: (teams) => set({ selectedTeams: teams }),
      
      addTeam: (team) => set((state) => {
        const exists = state.selectedTeams.some(t => t.id === team.id);
        if (exists) return state;
        return { selectedTeams: [...state.selectedTeams, team] };
      }),
      
      removeTeam: (teamId) => set((state) => ({
        selectedTeams: state.selectedTeams.filter(t => t.id !== teamId)
      })),
      
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
      
      updatePreferences: (preferences) => set((state) => ({
        ...state,
        ...preferences
      })),
      
      resetPreferences: () => set(defaultPreferences),
      
      // Getters
      getTeamsByLeague: (league) => {
        const state = get();
        return state.selectedTeams.filter(team => team.league === league);
      },
      
      isTeamFollowed: (teamId) => {
        const state = get();
        return state.selectedTeams.some(team => team.id === teamId);
      },
      
      getFollowedTeamIds: () => {
        const state = get();
        return state.selectedTeams.map(team => team.id);
      },
    }),
    {
      name: 'user-preferences-storage',
      partialize: (state) => ({
        selectedTeams: state.selectedTeams,
        notificationsEnabled: state.notificationsEnabled,
        onboardingCompleted: state.onboardingCompleted,
        favoriteLeagues: state.favoriteLeagues,
        preferredLanguage: state.preferredLanguage,
        theme: state.theme,
        showLiveScores: state.showLiveScores,
        showUpcomingMatches: state.showUpcomingMatches,
        showFinishedMatches: state.showFinishedMatches,
        matchStartNotifications: state.matchStartNotifications,
        goalNotifications: state.goalNotifications,
        finalResultNotifications: state.finalResultNotifications,
      }),
    }
  )
);