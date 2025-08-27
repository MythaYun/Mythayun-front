/**
 * API endpoints configuration
 * Maps all available backend endpoints for easy reference
 */

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
  
  // User profile endpoints
  PROFILE: {
    GET: '/api/v1/profile',
    UPDATE: '/api/v1/profile',
  },
  
  // Match/Fixtures endpoints
  MATCHES: {
    ALL: '/api/v1/fixtures',
    LIVE: '/api/v1/fixtures/live',
    DETAIL: (id: string) => `/api/v1/matches/${id}`,
  },
  
  // Follows endpoints
  FOLLOWS: {
    LIST: '/api/v1/follows',
    FOLLOW: '/api/v1/follows',
    UNFOLLOW: (id: string) => `/api/v1/follows/${id}`,
  },
  
  // Stadium guides
  STADIUMS: {
    GUIDE: (venueId: string) => `/api/v1/stadiums/${venueId}/guide`,
  },
  
  // Admin endpoints
  ADMIN: {
    HEALTH: '/admin/v1/health',
    JOBS: '/admin/v1/jobs',
    JOB_TRIGGER: (jobName: string) => `/admin/v1/jobs/${jobName}/trigger`,
    METRICS: '/admin/v1/metrics',
  },
  
  // Health check
  HEALTH: {
    CHECK: '/api/v1/health',
  },
};
