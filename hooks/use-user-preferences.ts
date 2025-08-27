import { useUserPreferencesStore, type Team } from '@/lib/store/user-preferences-store';

/**
 * Custom hook for managing user preferences
 * Provides easy access to user preferences and common operations
 */
export const useUserPreferences = () => {
  const store = useUserPreferencesStore();

  return {
    // Core preferences
    selectedTeams: store.selectedTeams,
    notificationsEnabled: store.notificationsEnabled,
    onboardingCompleted: store.onboardingCompleted,
    favoriteLeagues: store.favoriteLeagues,
    theme: store.theme,
    
    // Match preferences
    showLiveScores: store.showLiveScores,
    showUpcomingMatches: store.showUpcomingMatches,
    showFinishedMatches: store.showFinishedMatches,
    
    // Notification preferences
    matchStartNotifications: store.matchStartNotifications,
    goalNotifications: store.goalNotifications,
    finalResultNotifications: store.finalResultNotifications,
    
    // Actions
    setSelectedTeams: store.setSelectedTeams,
    addTeam: store.addTeam,
    removeTeam: store.removeTeam,
    setNotificationsEnabled: store.setNotificationsEnabled,
    setOnboardingCompleted: store.setOnboardingCompleted,
    updatePreferences: store.updatePreferences,
    resetPreferences: store.resetPreferences,
    
    // Utility functions
    getTeamsByLeague: store.getTeamsByLeague,
    isTeamFollowed: store.isTeamFollowed,
    getFollowedTeamIds: store.getFollowedTeamIds,
    
    // Computed values
    hasSelectedTeams: store.selectedTeams.length > 0,
    selectedTeamsCount: store.selectedTeams.length,
    
    // Helper functions for common use cases
    toggleTeamFollow: (team: Team) => {
      if (store.isTeamFollowed(team.id)) {
        store.removeTeam(team.id);
      } else {
        store.addTeam(team);
      }
    },
    
    // Get teams for specific leagues
    getPremierLeagueTeams: () => store.getTeamsByLeague('Premier League'),
    getLaLigaTeams: () => store.getTeamsByLeague('La Liga'),
    getBundesligaTeams: () => store.getTeamsByLeague('Bundesliga'),
    getLigue1Teams: () => store.getTeamsByLeague('Ligue 1'),
    
    // Check if user follows teams from specific leagues
    followsPremierLeague: () => store.getTeamsByLeague('Premier League').length > 0,
    followsLaLiga: () => store.getTeamsByLeague('La Liga').length > 0,
    followsBundesliga: () => store.getTeamsByLeague('Bundesliga').length > 0,
    followsLigue1: () => store.getTeamsByLeague('Ligue 1').length > 0,
  };
};