import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { followsApi } from '@/lib/api';
import type { Team, League } from '@/lib/api';

export interface FollowedTeam extends Team {
  followedAt: string;
  league?: League;
}

export interface FollowedLeague extends League {
  followedAt: string;
  teamsCount?: number;
}

interface FollowsState {
  followedTeams: FollowedTeam[];
  followedLeagues: FollowedLeague[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  fetchFollowedTeams: () => Promise<void>;
  fetchFollowedLeagues: () => Promise<void>;
  followTeam: (teamId: string) => Promise<void>;
  unfollowTeam: (teamId: string) => Promise<void>;
  followLeague: (leagueId: string) => Promise<void>;
  unfollowLeague: (leagueId: string) => Promise<void>;
  isTeamFollowed: (teamId: string) => boolean;
  isLeagueFollowed: (leagueId: string) => boolean;
  clearError: () => void;
  refreshFollows: () => Promise<void>;
}

export const useFollowsStore = create<FollowsState>()(
  persist(
    (set, get) => ({
      followedTeams: [],
      followedLeagues: [],
      isLoading: false,
      error: null,
      lastUpdated: null,

      fetchFollowedTeams: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await followsApi.getFollowedTeams();
          // Filter follows for teams and extract entity data
          const followedTeams = response.follows
            .filter(follow => follow.entityType === 'team' && follow.entity)
            .map(follow => ({
              ...(follow.entity as Team),
              followedAt: follow.createdAt,
            }));
          
          set({
            followedTeams,
            isLoading: false,
            lastUpdated: new Date(),
          });
        } catch (error: any) {
          console.error('Failed to fetch followed teams:', error);
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch followed teams',
          });
        }
      },

      fetchFollowedLeagues: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await followsApi.getFollowedLeagues();
          // Filter follows for leagues and extract entity data
          const followedLeagues = response.follows
            .filter(follow => follow.entityType === 'league' && follow.entity)
            .map(follow => ({
              ...(follow.entity as League),
              followedAt: follow.createdAt,
            }));
          
          set({
            followedLeagues,
            isLoading: false,
            lastUpdated: new Date(),
          });
        } catch (error: any) {
          console.error('Failed to fetch followed leagues:', error);
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch followed leagues',
          });
        }
      },

      followTeam: async (teamId: string) => {
        set({ isLoading: true, error: null });
        try {
          await followsApi.followTeam(teamId);
          
          // Refresh followed teams to get updated list
          await get().fetchFollowedTeams();
        } catch (error: any) {
          console.error('Failed to follow team:', error);
          set({
            isLoading: false,
            error: error.message || 'Failed to follow team',
          });
          throw error;
        }
      },

      unfollowTeam: async (teamId: string) => {
        set({ isLoading: true, error: null });
        try {
          await followsApi.unfollowTeam(teamId);
          
          // Remove team from local state
          const currentTeams = get().followedTeams;
          const updatedTeams = currentTeams.filter(team => team.id !== teamId);
          
          set({
            followedTeams: updatedTeams,
            isLoading: false,
            lastUpdated: new Date(),
          });
        } catch (error: any) {
          console.error('Failed to unfollow team:', error);
          set({
            isLoading: false,
            error: error.message || 'Failed to unfollow team',
          });
          throw error;
        }
      },

      followLeague: async (leagueId: string) => {
        set({ isLoading: true, error: null });
        try {
          await followsApi.followLeague(leagueId);
          
          // Refresh followed leagues to get updated list
          await get().fetchFollowedLeagues();
        } catch (error: any) {
          console.error('Failed to follow league:', error);
          set({
            isLoading: false,
            error: error.message || 'Failed to follow league',
          });
          throw error;
        }
      },

      unfollowLeague: async (leagueId: string) => {
        set({ isLoading: true, error: null });
        try {
          await followsApi.unfollowLeague(leagueId);
          
          // Remove league from local state
          const currentLeagues = get().followedLeagues;
          const updatedLeagues = currentLeagues.filter(league => league.id !== leagueId);
          
          set({
            followedLeagues: updatedLeagues,
            isLoading: false,
            lastUpdated: new Date(),
          });
        } catch (error: any) {
          console.error('Failed to unfollow league:', error);
          set({
            isLoading: false,
            error: error.message || 'Failed to unfollow league',
          });
          throw error;
        }
      },

      isTeamFollowed: (teamId: string) => {
        return get().followedTeams.some(team => team.id === teamId);
      },

      isLeagueFollowed: (leagueId: string) => {
        return get().followedLeagues.some(league => league.id === leagueId);
      },

      clearError: () => {
        set({ error: null });
      },

      refreshFollows: async () => {
        // Refresh both teams and leagues
        await Promise.all([
          get().fetchFollowedTeams(),
          get().fetchFollowedLeagues(),
        ]);
      },
    }),
    {
      name: 'follows-storage',
      partialize: (state) => ({
        followedTeams: state.followedTeams,
        followedLeagues: state.followedLeagues,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
