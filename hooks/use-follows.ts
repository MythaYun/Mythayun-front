import { useEffect } from 'react';
import { useFollowsStore } from '@/lib/store/follows-store';
import { useAuthStore } from '@/lib/store/auth-store';

/**
 * Custom hook for managing follows (teams and leagues)
 * Provides easy access to follow/unfollow functionality and state
 */
export function useFollows() {
  const { isAuthenticated } = useAuthStore();
  const {
    followedTeams,
    followedLeagues,
    isLoading,
    error,
    fetchFollowedTeams,
    fetchFollowedLeagues,
    followTeam,
    unfollowTeam,
    followLeague,
    unfollowLeague,
    isTeamFollowed,
    isLeagueFollowed,
    clearError,
    refreshFollows,
  } = useFollowsStore();

  // Auto-fetch follows when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFollowedTeams();
      fetchFollowedLeagues();
    }
  }, [isAuthenticated, fetchFollowedTeams, fetchFollowedLeagues]);

  // Helper functions
  const toggleTeamFollow = async (teamId: string) => {
    if (isTeamFollowed(teamId)) {
      await unfollowTeam(teamId);
    } else {
      await followTeam(teamId);
    }
  };

  const toggleLeagueFollow = async (leagueId: string) => {
    if (isLeagueFollowed(leagueId)) {
      await unfollowLeague(leagueId);
    } else {
      await followLeague(leagueId);
    }
  };

  // Computed values
  const hasFollowedTeams = followedTeams.length > 0;
  const hasFollowedLeagues = followedLeagues.length > 0;
  const totalFollows = followedTeams.length + followedLeagues.length;

  // Get followed team names for easy filtering
  const followedTeamNames = followedTeams.map(team => team.name.toLowerCase());
  const followedLeagueNames = followedLeagues.map(league => league.name.toLowerCase());

  // Helper to check if a match involves followed teams
  const isMatchFollowed = (homeTeam: string, awayTeam: string) => {
    const homeTeamLower = homeTeam.toLowerCase();
    const awayTeamLower = awayTeam.toLowerCase();
    
    return followedTeamNames.includes(homeTeamLower) || 
           followedTeamNames.includes(awayTeamLower);
  };

  // Helper to check if a match is in a followed league
  const isMatchInFollowedLeague = (leagueName: string) => {
    return followedLeagueNames.includes(leagueName.toLowerCase());
  };

  return {
    // State
    followedTeams,
    followedLeagues,
    isLoading,
    error,
    
    // Actions
    followTeam,
    unfollowTeam,
    followLeague,
    unfollowLeague,
    toggleTeamFollow,
    toggleLeagueFollow,
    refreshFollows,
    clearError,
    
    // Checkers
    isTeamFollowed,
    isLeagueFollowed,
    isMatchFollowed,
    isMatchInFollowedLeague,
    
    // Computed values
    hasFollowedTeams,
    hasFollowedLeagues,
    totalFollows,
    followedTeamNames,
    followedLeagueNames,
  };
}
