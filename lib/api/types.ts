// API Types based on Mythayun API Documentation

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
  isNewUser?: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  authProvider: string;
  emailVerified?: boolean;
  profilePicture?: string | null;
  timezone?: string | null;
  language?: string | null;
  isPrivate?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  profilePicture?: string;
  timezone?: string;
  language?: string;
  isPrivate?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Team & League Types
export interface Team {
  id: string;
  name: string;
  logo?: string;
}

export interface League {
  id: string;
  name: string;
  logo?: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
}

// Match/Fixture Types
export interface Fixture {
  id: string;
  leagueId: string;
  homeTeamId: string;
  awayTeamId: string;
  venueId: string;
  status: 'not_started' | 'in_progress' | 'finished' | 'postponed' | 'cancelled';
  kickoffTime: string;
  currentMinute?: number;
  homeScore?: number;
  awayScore?: number;
  homeTeam: Team;
  awayTeam: Team;
  league: League;
  venue: Venue;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'own_goal';
  minute: number;
  teamId: string;
  playerId?: string;
  playerName?: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
  detail?: string;
}

// Advanced match statistics from Football API
export interface MatchStatistics {
  possession: {
    home: number | null;
    away: number | null;
  };
  shots: {
    home: {
      total: number | null;
      onTarget: number | null;
      offTarget: number | null;
      blocked: number | null;
    };
    away: {
      total: number | null;
      onTarget: number | null;
      offTarget: number | null;
      blocked: number | null;
    };
  };
  corners: {
    home: number | null;
    away: number | null;
  };
  fouls: {
    home: number | null;
    away: number | null;
  };
  yellowCards: {
    home: number | null;
    away: number | null;
  };
  redCards: {
    home: number | null;
    away: number | null;
  };
  offsides: {
    home: number | null;
    away: number | null;
  };
  passes: {
    home: {
      total: number | null;
      accurate: number | null;
      percentage: number | null;
    };
    away: {
      total: number | null;
      accurate: number | null;
      percentage: number | null;
    };
  };
  saves?: {
    home: number | null;
    away: number | null;
  };
}

export interface MatchDetails extends Fixture {
  events: MatchEvent[];
  statistics: MatchStatistics;
}

// Fixtures API Response Types
export interface FixturesResponse {
  fixtures: Fixture[];
  pagination: PaginationMeta;
}

export interface MatchDetailsResponse {
  match: MatchDetails;
}

// Follow Types
export interface FollowRequest {
  entityType: 'team' | 'league';
  entityId: string;
  notificationType: 'all' | 'goals' | 'matches' | 'none';
}

export interface Follow {
  id: string;
  userId: string;
  entityType: 'team' | 'league';
  entityId: string;
  notificationType: string;
  createdAt: string;
  entity?: Team | League; // Populated entity data
}

export interface FollowsResponse {
  follows: Follow[];
}

export interface UnfollowRequest {
  entityType: 'team' | 'league';
  entityId: string;
}

// Stadium Guide Types
export interface StadiumGuide {
  id: string;
  name: string;
  city: string;
  capacity?: number;
  opened?: string;
  architect?: string;
  cost?: string;
  nickname?: string;
  description?: string;
  image?: string;
  location?: string;
  facilities?: string[];
  transportation?: string[];
  nearbyAttractions?: string[];
}

export interface StadiumGuidesResponse {
  stadiums: StadiumGuide[];
  pagination: PaginationMeta;
}

// Common API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// Query Parameters
export interface FixturesQueryParams {
  date?: string; // YYYY-MM-DD
  league?: string;
  team?: string;
  limit?: number;
  page?: number;
}

export interface FollowsQueryParams {
  entityType?: 'team' | 'league';
}

export interface StadiumGuidesQueryParams {
  venue?: string;
  limit?: number;
  page?: number;
}
