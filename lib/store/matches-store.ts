import { create } from 'zustand';
import { matchesApi } from '@/lib/api';
import type { Fixture } from '@/lib/api';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: 'live' | 'upcoming' | 'finished';
  time: string;
  league: string;
  date: string;
  // Additional fields from API
  homeTeamId?: string;
  awayTeamId?: string;
  venue?: string;
  round?: string;
  season?: string;
}

interface MatchesState {
  matches: Match[];
  liveMatches: Match[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  fetchMatches: (forceRefresh?: boolean) => Promise<void>;
  fetchLiveMatches: (forceRefresh?: boolean) => Promise<void>;
  fetchMatchesByDate: (date: string) => Promise<void>;
  fetchMatchesByTeam: (teamId: string) => Promise<void>;
  fetchMatchesByLeague: (leagueId: string) => Promise<void>;
  clearError: () => void;
  refreshMatches: () => Promise<void>;
  // Cache utilities
  isCacheValid: () => boolean;
  getCacheAge: () => number | null;
}

// Helper function to convert real API fixture to our Match interface
const convertFixtureToMatch = (fixture: any): Match => {
  // Determine status based on real API data
  let status: 'live' | 'upcoming' | 'finished' = 'upcoming';
  let time = 'TBD';
  
  // Map real API status values
  if (fixture.status === 'LIVE' || fixture.phase === 'FIRST_HALF' || fixture.phase === 'SECOND_HALF') {
    status = 'live';
    time = fixture.minute ? `${fixture.minute}'` : 'LIVE';
  } else if (fixture.status === 'FT' || fixture.phase === 'FULL_TIME') {
    status = 'finished';
    time = 'FT';
  } else if (fixture.status === 'NS' || fixture.phase === 'NOT_STARTED') {
    status = 'upcoming';
    if (fixture.startTime) {
      const kickoff = new Date(fixture.startTime);
      time = kickoff.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  }

  return {
    id: fixture.id,
    homeTeam: fixture.homeTeam?.name || 'Unknown',
    awayTeam: fixture.awayTeam?.name || 'Unknown',
    homeScore: fixture.score?.home ?? null,
    awayScore: fixture.score?.away ?? null,
    status,
    time,
    league: fixture.league?.name || 'Unknown League',
    date: fixture.startTime ? fixture.startTime.split('T')[0] : new Date().toISOString().split('T')[0],
    homeTeamId: fixture.homeTeam?.id,
    awayTeamId: fixture.awayTeam?.id,
    venue: fixture.venue?.name || 'Unknown Venue',
    round: undefined, // Not available in API
    season: undefined, // Not available in API
  };
};

export const useMatchesStore = create<MatchesState>((set, get) => ({
  matches: [],
  liveMatches: [],
  isLoading: true, // Start with loading true for immediate UX
  error: null,
  lastUpdated: null,

  fetchMatches: async (forceRefresh = false) => {
    const state = get();
    
    // Check cache validity (5 minutes TTL for matches)
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    const isCacheValid = state.lastUpdated && 
      (Date.now() - state.lastUpdated.getTime()) < CACHE_TTL;
    
    // If cache is valid and we have data, don't fetch unless forced
    if (!forceRefresh && isCacheValid && state.matches.length > 0) {
      console.log('Using cached matches data');
      set({ isLoading: false }); // Ensure loading is false
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      console.log('Fetching fresh matches data from API');
      const response = await matchesApi.getFixtures();
      console.log('API Response:', response); // Debug log
      
      // Handle direct array response from API
      let fixturesArray;
      if (Array.isArray(response)) {
        // API returns direct array
        fixturesArray = response;
      } else if (response && response.fixtures && Array.isArray(response.fixtures)) {
        // API returns object with fixtures property
        fixturesArray = response.fixtures;
      } else {
        throw new Error('Invalid API response: no fixtures data found');
      }
      
      const matches = fixturesArray.map(convertFixtureToMatch);
      
      set({
        matches,
        isLoading: false,
        lastUpdated: new Date(),
      });
    } catch (error: any) {
      console.error('Failed to fetch matches:', error);
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch matches',
      });
    }
  },

  fetchLiveMatches: async (forceRefresh = false) => {
    const state = get();
    
    // Check cache validity (1 minute TTL for live matches - more frequent updates)
    const CACHE_TTL = 1 * 60 * 1000; // 1 minute
    const isCacheValid = state.lastUpdated && 
      (Date.now() - state.lastUpdated.getTime()) < CACHE_TTL;
    
    // If cache is valid and we have data, don't fetch unless forced
    if (!forceRefresh && isCacheValid && state.liveMatches.length >= 0) {
      console.log('Using cached live matches data');
      return;
    }
    
    try {
      console.log('Fetching fresh live matches data from API');
      const response = await matchesApi.getLiveFixtures();
      console.log('Live matches API Response:', response); // Debug log
      
      // Handle direct array response from API
      let fixturesArray;
      if (Array.isArray(response)) {
        // API returns direct array
        fixturesArray = response;
      } else if (response && response.fixtures && Array.isArray(response.fixtures)) {
        // API returns object with fixtures property
        fixturesArray = response.fixtures;
      } else {
        console.warn('No live matches data available');
        set({
          liveMatches: [],
          lastUpdated: new Date(),
        });
        return;
      }
      
      // Filter for live matches only
      const liveFixtures = fixturesArray.filter(fixture => 
        fixture.status === 'LIVE' || 
        fixture.phase === 'FIRST_HALF' || 
        fixture.phase === 'SECOND_HALF'
      );
      
      const liveMatches = liveFixtures.map(convertFixtureToMatch);
      
      set({
        liveMatches,
        lastUpdated: new Date(),
      });
    } catch (error: any) {
      console.error('Failed to fetch live matches:', error);
      set({
        error: error.message || 'Failed to fetch live matches',
      });
    }
  },

  fetchMatchesByDate: async (date: string) => {
    set({ isLoading: true, error: null });
    try {
      // Use getTodayFixtures or getFixtures with date filter
      const response = await matchesApi.getTodayFixtures();
      const matches = response.fixtures.map(convertFixtureToMatch);
      
      set({
        matches,
        isLoading: false,
        lastUpdated: new Date(),
      });
    } catch (error: any) {
      console.error('Failed to fetch matches by date:', error);
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch matches by date',
      });
    }
  },

  fetchMatchesByTeam: async (teamId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await matchesApi.getTeamFixtures(teamId);
      const matches = response.fixtures.map(convertFixtureToMatch);
      
      set({
        matches,
        isLoading: false,
        lastUpdated: new Date(),
      });
    } catch (error: any) {
      console.error('Failed to fetch matches by team:', error);
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch matches by team',
      });
    }
  },

  fetchMatchesByLeague: async (leagueId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await matchesApi.getLeagueFixtures(leagueId);
      const matches = response.fixtures.map(convertFixtureToMatch);
      
      set({
        matches,
        isLoading: false,
        lastUpdated: new Date(),
      });
    } catch (error: any) {
      console.error('Failed to fetch matches by league:', error);
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch matches by league',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  refreshMatches: async () => {
    // Force refresh all matches and live matches
    await Promise.all([
      get().fetchMatches(true), // Force refresh
      get().fetchLiveMatches(true), // Force refresh
    ]);
  },

  // Cache utilities
  isCacheValid: () => {
    const state = get();
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    return !!(state.lastUpdated && 
      (Date.now() - state.lastUpdated.getTime()) < CACHE_TTL);
  },

  getCacheAge: () => {
    const state = get();
    if (!state.lastUpdated) return null;
    return Date.now() - state.lastUpdated.getTime();
  },
}));
