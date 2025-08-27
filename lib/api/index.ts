// API Services - Centralized exports
export { default as apiClient } from './client';
export { API_CONFIG, API_ENDPOINTS } from './config';
export { authApi } from './auth';
export { matchesApi } from './matches';
export { followsApi } from './follows';
export { stadiumsApi } from './stadiums';

// Export all types
export * from './types';

// Health check utility
export const healthCheck = async (): Promise<{ status: string; timestamp: string; services: any }> => {
  const { default: apiClient } = await import('./client');
  return apiClient('/health', { skipAuth: true });
};
