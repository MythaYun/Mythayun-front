import { create } from 'zustand';
import { matchesApi } from '@/lib/api/matches';
import { MatchDetails as APIMatchDetails, MatchStatistics, MatchEvent } from '@/lib/api/types';

// Enhanced match details interface - extends API types with additional UI properties
export interface MatchDetails extends APIMatchDetails {
  // Additional UI-specific properties
  stadium?: {
    name: string;
    location?: string;
    capacity?: number;
    image?: string;
    architect?: string;
    opened?: number;
    cost?: string;
    nickname?: string;
  };
  weather?: {
    temperature?: number;
    condition?: string;
    humidity?: number;
    windSpeed?: number;
  };
  referee?: string;
  attendance?: number;
  lineups?: {
    home: {
      formation: string;
      players: Array<{
        name: string;
        number: number;
        position: string;
      }>;
    };
    away: {
      formation: string;
      players: Array<{
        name: string;
        number: number;
        position: string;
      }>;
    };
  };
}

interface MatchDetailsStore {
  matchDetails: MatchDetails | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  fetchMatchDetails: (matchId: string) => Promise<void>;
  clearMatchDetails: () => void;
  refreshMatchDetails: (matchId: string) => Promise<void>;
}

// Helper function to convert API response to our MatchDetails interface
// Map API status to our status types
const mapStatus = (apiStatus: string): 'not_started' | 'in_progress' | 'finished' | 'postponed' | 'cancelled' => {
  switch (apiStatus?.toLowerCase()) {
    case 'live':
    case 'in_progress':
    case '1h':
    case '2h':
    case 'ht':
      return 'in_progress';
    case 'finished':
    case 'ft':
    case 'aet':
    case 'pen':
      return 'finished';
    case 'upcoming':
    case 'not_started':
    case 'ns':
      return 'not_started';
    case 'postponed':
    case 'pst':
      return 'postponed';
    case 'cancelled':
    case 'canc':
      return 'cancelled';
    default:
      return 'not_started';
  }
};

const convertApiToMatchDetails = (apiData: any): MatchDetails => {
  // Determine status based on API data
  let status: 'live' | 'upcoming' | 'finished' = 'upcoming';
  let time = 'TBD';
  
  if (apiData.status === 'LIVE' || apiData.phase === 'FIRST_HALF' || apiData.phase === 'SECOND_HALF') {
    status = 'live';
    time = apiData.minute ? `${apiData.minute}'` : 'LIVE';
  } else if (apiData.status === 'FT' || apiData.phase === 'FULL_TIME') {
    status = 'finished';
    time = 'FT';
  } else if (apiData.status === 'NS' || apiData.phase === 'NOT_STARTED') {
    status = 'upcoming';
    if (apiData.startTime) {
      const kickoff = new Date(apiData.startTime);
      time = kickoff.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  }

  return {
    id: apiData.id,
    leagueId: apiData.leagueId || apiData.league?.id || '',
    homeTeamId: apiData.homeTeamId || apiData.homeTeam?.id || '',
    awayTeamId: apiData.awayTeamId || apiData.awayTeam?.id || '',
    venueId: apiData.venueId || apiData.venue?.id || '',
    status: mapStatus(apiData.status),
    kickoffTime: apiData.startTime || apiData.kickoffTime || new Date().toISOString(),
    currentMinute: apiData.currentMinute,
    homeScore: apiData.score?.home ?? apiData.homeScore,
    awayScore: apiData.score?.away ?? apiData.awayScore,
    homeTeam: {
      id: apiData.homeTeam?.id || apiData.homeTeamId || '',
      name: apiData.homeTeam?.name || 'Unknown',
      logo: apiData.homeTeam?.logoUrl || apiData.homeTeam?.logo,
    },
    awayTeam: {
      id: apiData.awayTeam?.id || apiData.awayTeamId || '',
      name: apiData.awayTeam?.name || 'Unknown',
      logo: apiData.awayTeam?.logoUrl || apiData.awayTeam?.logo,
    },
    league: {
      id: apiData.league?.id || apiData.leagueId || '',
      name: apiData.league?.name || 'Unknown League',
      logo: apiData.league?.logo,
    },
    venue: {
      id: apiData.venue?.id || apiData.venueId || '',
      name: apiData.venue?.name || 'Stadium',
      city: apiData.venue?.city || 'Unknown',
    },
    stadium: apiData.venue ? {
      name: apiData.venue.name,
      location: apiData.venue.city,
      capacity: apiData.venue.capacity,
      image: apiData.venue.image,
    } : undefined,
    weather: apiData.weather ? {
      temperature: apiData.weather.temperature,
      condition: apiData.weather.condition,
      humidity: apiData.weather.humidity,
      windSpeed: apiData.weather.windSpeed,
    } : undefined,
    referee: apiData.referee?.name,
    attendance: apiData.attendance,
    events: apiData.events?.map((event: any, index: number) => {
      // Generate truly unique ID by combining multiple factors
      const uniqueId = event.id || 
        `${apiData.id}-${event.minute || 0}-${event.type || 'unknown'}-${event.team || 'neutral'}-${event.player?.name || event.playerName || 'unknown'}-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        id: uniqueId,
        minute: event.minute,
        type: mapEventType(event.type),
        team: event.team === 'home' ? 'home' : 'away',
        player: event.player?.name || event.playerName,
        assist: event.assist?.name || event.assistName,
        playerOut: event.playerOut?.name || event.playerOutName,
      };
    }) || [],
    statistics: apiData.statistics ? {
      possession: apiData.statistics.possession || undefined,
      shots: apiData.statistics.shots || undefined,
      corners: apiData.statistics.corners || undefined,
      fouls: apiData.statistics.fouls || undefined,
      yellowCards: apiData.statistics.yellowCards || undefined,
      redCards: apiData.statistics.redCards || undefined,
      offsides: apiData.statistics.offsides || undefined,
      passes: apiData.statistics.passes || undefined,
      saves: apiData.statistics.saves || undefined,
    } : {
      possession: undefined,
      shots: undefined,
      corners: undefined,
      fouls: undefined,
      yellowCards: undefined,
      redCards: undefined,
      offsides: undefined,
      passes: undefined,
      saves: undefined,
    },
    lineups: apiData.lineups ? {
      home: {
        formation: apiData.lineups.home?.formation || '4-4-2',
        players: apiData.lineups.home?.players?.map((player: any) => ({
          name: player.name,
          number: player.number,
          position: player.position,
        })) || [],
      },
      away: {
        formation: apiData.lineups.away?.formation || '4-4-2',
        players: apiData.lineups.away?.players?.map((player: any) => ({
          name: player.name,
          number: player.number,
          position: player.position,
        })) || [],
      },
    } : undefined,
  };
};

// Helper function to map API event types to our types
const mapEventType = (apiType: string): 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' => {
  switch (apiType?.toLowerCase()) {
    case 'goal':
    case 'penalty_goal':
      return 'goal';
    case 'yellow_card':
    case 'booking':
      return 'yellow_card';
    case 'red_card':
    case 'red':
      return 'red_card';
    case 'substitution':
    case 'sub':
      return 'substitution';
    case 'penalty':
    case 'penalty_miss':
      return 'penalty';
    default:
      return 'goal'; // Default fallback
  }
};

export const useMatchDetailsStore = create<MatchDetailsStore>((set, get) => ({
  matchDetails: null,
  isLoading: false,
  error: null,
  lastUpdated: null,

  fetchMatchDetails: async (matchId: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Fetching match details for ID:', matchId);
      const response = await matchesApi.getMatchDetails(matchId);
      console.log('Match details API response:', response);
      
      // Handle different response structures
      let matchData;
      if (Array.isArray(response)) {
        // If API returns array, take first item
        matchData = response[0];
      } else if (response.match) {
        // If API returns { match: {...} }
        matchData = response.match;
      } else {
        // If API returns direct match object
        matchData = response;
      }
      
      if (!matchData) {
        throw new Error('No match data found');
      }
      
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

  refreshMatchDetails: async (matchId: string) => {
    const { fetchMatchDetails } = get();
    await fetchMatchDetails(matchId);
  },
}));
