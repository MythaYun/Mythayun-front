import { create } from 'zustand';
import { matchesApi } from '@/lib/api';
import type { Fixture } from '@/lib/api';

// Extend the basic Match interface with additional details
export interface MatchDetails {
  // Basic match info (same as matches-store)
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: 'live' | 'upcoming' | 'finished';
  time: string;
  league: string;
  date: string;
  homeTeamId?: string;
  awayTeamId?: string;
  venue?: string;
  
  // Additional details for match details page
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  leagueId?: string;
  venueId?: string;
  events?: Array<{
    id: string;
    minute: number;
    type: string;
    team: 'home' | 'away';
    player?: string;
    assist?: string;
  }>;
  statistics?: {
    possession?: { home: number | null; away: number | null };
    shots?: {
      total?: { home: number | null; away: number | null };
      onTarget?: { home: number | null; away: number | null };
      offTarget?: { home: number | null; away: number | null };
      blocked?: { home: number | null; away: number | null };
    };
    corners?: { home: number | null; away: number | null };
    fouls?: { home: number | null; away: number | null };
    yellowCards?: { home: number | null; away: number | null };
    redCards?: { home: number | null; away: number | null };
  };
  weather?: {
    temperature?: number;
    condition?: string;
  };
  referee?: string;
  attendance?: number;
}

interface MatchDetailsState {
  matchDetails: MatchDetails | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  fetchMatchDetails: (matchId: string) => Promise<void>;
  clearMatchDetails: () => void;
}

// Convert API fixture to MatchDetails (same logic as matches-store + additional fields)
const convertApiToMatchDetails = (fixture: any): MatchDetails => {
  // Determine status based on real API data (SAME AS MATCHES-STORE)
  let status: 'live' | 'upcoming' | 'finished' = 'upcoming';
  let time = 'TBD';
  
  // Map real API status values (SAME AS MATCHES-STORE)
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
    // Basic fields (SAME AS MATCHES-STORE)
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
    
    // Additional details
    homeTeamLogo: fixture.homeTeam?.logoUrl,
    awayTeamLogo: fixture.awayTeam?.logoUrl,
    leagueId: fixture.league?.id,
    venueId: fixture.venue?.id,
    events: fixture.events?.map((event: any, index: number) => ({
      id: `${fixture.id}-${event.minute || 0}-${event.type || 'unknown'}-${index}`,
      minute: event.minute || 0,
      type: event.type || 'unknown',
      team: event.teamId === fixture.homeTeam?.id ? 'home' : 'away',
      player: event.playerName,
      assist: event.assistPlayerName,
    })) || [],
    statistics: fixture.statistics ? {
      possession: fixture.statistics.possession || { home: null, away: null },
      shots: fixture.statistics.shots || { home: null, away: null },
      corners: fixture.statistics.corners || { home: null, away: null },
      fouls: fixture.statistics.fouls || { home: null, away: null },
      yellowCards: fixture.statistics.yellowCards || { home: null, away: null },
      redCards: fixture.statistics.redCards || { home: null, away: null },
    } : {
      possession: { home: null, away: null },
      shots: { home: null, away: null },
      corners: { home: null, away: null },
      fouls: { home: null, away: null },
      yellowCards: { home: null, away: null },
      redCards: { home: null, away: null },
    },
    weather: fixture.weather ? {
      temperature: fixture.weather.temperature,
      condition: fixture.weather.condition,
    } : undefined,
    referee: fixture.referee?.name,
    attendance: fixture.attendance,
  };
};

export const useMatchDetailsStore = create<MatchDetailsState>((set, get) => ({
  matchDetails: null,
  isLoading: false,
  error: null,
  lastUpdated: null,

  fetchMatchDetails: async (matchId: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Fetching match details for ID:', matchId);
      
      // Use the SAME API endpoint as matches-store
      const response = await matchesApi.getMatchDetails(matchId);
      console.log('Match details API response:', response);
      
      // Handle different response structures
      let matchData;
      if (Array.isArray(response)) {
        matchData = response[0];
      } else if (response.match) {
        matchData = response.match;
      } else {
        matchData = response;
      }
      
      if (!matchData) {
        throw new Error('No match data found');
      }
      
      // Use the SAME conversion logic as matches-store
      const matchDetails = convertApiToMatchDetails(matchData);
      
      set({
        matchDetails,
        isLoading: false,
        lastUpdated: new Date(),
      });
    } catch (error: any) {
      console.error('Failed to fetch match details:', error);
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch match details',
      });
    }
  },

  clearMatchDetails: () => {
    set({
      matchDetails: null,
      error: null,
      lastUpdated: null,
    });
  },
}));
