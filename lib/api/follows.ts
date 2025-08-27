import apiClient from './client';
import { API_ENDPOINTS } from './config';
import type {
  FollowRequest,
  Follow,
  FollowsResponse,
  UnfollowRequest,
  FollowsQueryParams,
} from './types';

/**
 * Follows API Service
 */
export const followsApi = {
  /**
   * Follow a team or league
   */
  async followEntity(followData: FollowRequest): Promise<{ message: string; follow: Follow }> {
    return apiClient(API_ENDPOINTS.FOLLOWS.BASE, {
      method: 'POST',
      body: JSON.stringify(followData),
    });
  },

  /**
   * Unfollow a team or league
   */
  async unfollowEntity(unfollowData: UnfollowRequest): Promise<{ message: string }> {
    return apiClient(API_ENDPOINTS.FOLLOWS.BASE, {
      method: 'DELETE',
      body: JSON.stringify(unfollowData),
    });
  },

  /**
   * Get user's followed entities
   */
  async getUserFollows(params?: FollowsQueryParams): Promise<FollowsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.entityType) {
      searchParams.append('entityType', params.entityType);
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.FOLLOWS.BASE}?${queryString}` : API_ENDPOINTS.FOLLOWS.BASE;
    
    return apiClient<FollowsResponse>(endpoint);
  },

  /**
   * Get followed teams only
   */
  async getFollowedTeams(): Promise<FollowsResponse> {
    return this.getUserFollows({ entityType: 'team' });
  },

  /**
   * Get followed leagues only
   */
  async getFollowedLeagues(): Promise<FollowsResponse> {
    return this.getUserFollows({ entityType: 'league' });
  },

  /**
   * Follow a team with default notification settings
   */
  async followTeam(teamId: string, notificationType: 'all' | 'goals' | 'matches' | 'none' = 'all'): Promise<{ message: string; follow: Follow }> {
    return this.followEntity({
      entityType: 'team',
      entityId: teamId,
      notificationType,
    });
  },

  /**
   * Unfollow a team
   */
  async unfollowTeam(teamId: string): Promise<{ message: string }> {
    return this.unfollowEntity({
      entityType: 'team',
      entityId: teamId,
    });
  },

  /**
   * Follow a league with default notification settings
   */
  async followLeague(leagueId: string, notificationType: 'all' | 'goals' | 'matches' | 'none' = 'matches'): Promise<{ message: string; follow: Follow }> {
    return this.followEntity({
      entityType: 'league',
      entityId: leagueId,
      notificationType,
    });
  },

  /**
   * Unfollow a league
   */
  async unfollowLeague(leagueId: string): Promise<{ message: string }> {
    return this.unfollowEntity({
      entityType: 'league',
      entityId: leagueId,
    });
  },
};
