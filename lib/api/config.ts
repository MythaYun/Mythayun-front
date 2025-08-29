// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    SOCIAL_AUTH: '/auth/social-auth',
    DELETE_ACCOUNT: '/api/v1/account',
  },
  
  // User
  USER: {
    PROFILE: '/api/v1/profile',
    CHANGE_PASSWORD: '/api/v1/change-password',
    DELETE_ACCOUNT: '/api/v1/account',
  },
  
  // Fixtures & Matches
  FIXTURES: {
    LIST: '/api/v1/fixtures',
    LIVE: '/api/v1/fixtures/live',
    MATCH_DETAILS: '/api/v1/matches',
  },
  
  // Follows
  FOLLOWS: {
    BASE: '/api/v1/follows',
  },
  
  // Stadium Guides
  STADIUMS: {
    GUIDES: '/api/v1/stadium-guides',
  },
  
  // Health
  HEALTH: '/health',
} as const;

// Request/Response Types
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
