import apiClient from './client';
import { API_ENDPOINTS } from './config';
import type {
  FixturesResponse,
  MatchDetailsResponse,
  FixturesQueryParams,
} from './types';

/**
 * Matches & Fixtures API Service
 */
export const matchesApi = {
  /**
   * Get fixtures (matches) with optional filtering
   */
  async getFixtures(params?: FixturesQueryParams): Promise<FixturesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.date) searchParams.append('date', params.date);
    if (params?.league) searchParams.append('league', params.league);
    if (params?.team) searchParams.append('team', params.team);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.FIXTURES.LIST}?${queryString}` : API_ENDPOINTS.FIXTURES.LIST;
    
    return apiClient<FixturesResponse>(endpoint);
  },

  /**
   * Get live fixtures (ongoing matches)
   */
  async getLiveFixtures(): Promise<FixturesResponse> {
    return apiClient<FixturesResponse>(API_ENDPOINTS.FIXTURES.LIVE);
  },

  /**
   * Get detailed match information including events and statistics
   */
  async getMatchDetails(matchId: string): Promise<MatchDetailsResponse> {
    return apiClient<MatchDetailsResponse>(`${API_ENDPOINTS.FIXTURES.MATCH_DETAILS}/${matchId}`);
  },

  /**
   * Get fixtures for today
   */
  async getTodayFixtures(): Promise<FixturesResponse> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return this.getFixtures({ date: today });
  },

  /**
   * Get fixtures for a specific team
   */
  async getTeamFixtures(teamId: string, limit?: number): Promise<FixturesResponse> {
    return this.getFixtures({ team: teamId, limit });
  },

  /**
   * Get fixtures for a specific league
   */
  async getLeagueFixtures(leagueId: string, limit?: number): Promise<FixturesResponse> {
    return this.getFixtures({ league: leagueId, limit });
  },
};
