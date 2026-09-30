import { create } from 'zustand';
import { matchesApi } from '@/lib/api';
import type { Fixture } from '@/lib/api';
import { describeFixtureStatus, isLiveFixture } from '@/lib/match-status';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: 'live' | 'upcoming' | 'finished';
  time: string;
  league: string;
  date: string; // UTC day of the kick-off
  startTime?: string | null; // Kick-off as sent by the API (ISO), used to filter by the visitor's local day
  minute?: number | null; // Current match minute for live matches
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
  cacheKey: string | null; // UTC days the cached matches were loaded for

  // Actions
  fetchMatches: (forceRefresh?: boolean) => Promise<void>;
  fetchMatchesForDates: (dates: string[], forceRefresh?: boolean) => Promise<void>;
  fetchLiveMatches: (forceRefresh?: boolean) => Promise<void>;
  fetchMatchesByDate: (date: string) => Promise<void>;
  fetchMatchesByTeam: (teamId: string) => Promise<void>;
  fetchMatchesByLeague: (leagueId: string) => Promise<void>;
  clearError: () => void;
  refreshMatches: () => Promise<void>;
  // Cache utilities
  isCacheValid: () => boolean;
  getCacheAge: () => number | null;
  // Optimistic UI
  getMatchFromCache: (matchId: string) => Match | null;
}

const MATCHES_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Only the most recent request may update the list: answers to an
// older request (the visitor changed filter meanwhile) are dropped.
let latestDatesRequest = 0;

// Extracts the fixtures array from an API answer (direct array or { fixtures })
const extractFixtures = (response: any): any[] | null => {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.fixtures)) return response.fixtures;
  return null;
};

// Helper function to convert real API fixture to our Match interface
const convertFixtureToMatch = (fixture: any): Match => {
  const { status, time } = describeFixtureStatus(fixture);

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
    startTime: fixture.startTime ?? null,
    minute: fixture.currentMinute || fixture.minute || null, // Map current minute from API
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
  cacheKey: null,

  // Today's matches (UTC day, like the API default). Used by the home page.
  fetchMatches: async (forceRefresh = false) => {
    await get().fetchMatchesForDates([new Date().toISOString().split('T')[0]], forceRefresh);
  },

  // Matches of one or several consecutive UTC days, loaded with a single request.
  fetchMatchesForDates: async (dates: string[], forceRefresh = false) => {
    if (dates.length === 0) return;

    const state = get();
    const cacheKey = dates.join(',');

    // The cache only counts for the very same days: switching from "Tomorrow"
    // to "Today" must not show tomorrow's matches.
    const isCacheValid = state.lastUpdated &&
      state.cacheKey === cacheKey &&
      (Date.now() - state.lastUpdated.getTime()) < MATCHES_CACHE_TTL;

    if (!forceRefresh && isCacheValid) {
      console.log('Using cached matches data');
      set({ isLoading: false });
      return;
    }

    const requestId = ++latestDatesRequest;
    set({ isLoading: true, error: null });

    try {
      // One day: the classic date query. Several days: one range query, which
      // costs the football provider one request per league however long it is.
      const response = dates.length === 1
        ? await matchesApi.getFixtures({ date: dates[0] })
        : await matchesApi.getFixtures({ from: dates[0], to: dates[dates.length - 1] });
      if (requestId !== latestDatesRequest) return; // a newer request replaced this one

      const fixtures = extractFixtures(response);
      if (!fixtures) {
        throw new Error('Invalid API response: no fixtures data found');
      }

      // A match can only appear once, whatever the provider sent
      const unique = new Map<string, any>();
      fixtures.forEach((fixture) => unique.set(fixture.id, fixture));
      const matches = [...unique.values()]
        .sort((a, b) => String(a.startTime ?? '').localeCompare(String(b.startTime ?? '')))
        .map(convertFixtureToMatch);

      set({
        matches,
        isLoading: false,
        lastUpdated: new Date(),
        cacheKey,
      });
    } catch (error: any) {
      if (requestId !== latestDatesRequest) return;
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
      const liveFixtures = fixturesArray.filter(isLiveFixture);

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

  // One UTC day, always reloaded
  fetchMatchesByDate: async (date: string) => {
    await get().fetchMatchesForDates([date], true);
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
        cacheKey: null,
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
        cacheKey: null,
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
    const { lastUpdated } = get();
    return !!(lastUpdated && (Date.now() - lastUpdated.getTime()) < MATCHES_CACHE_TTL);
  },

  getCacheAge: () => {
    const { lastUpdated } = get();
    return lastUpdated ? Date.now() - lastUpdated.getTime() : null;
  },

  // Optimistic UI: Get match from cache for instant display
  getMatchFromCache: (matchId: string) => {
    const { matches, liveMatches } = get();
    // Search in both regular matches and live matches
    const allMatches = [...matches, ...liveMatches];
    return allMatches.find(match => match.id === matchId) || null;
  },
}));
