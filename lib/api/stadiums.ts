import apiClient from './client';
import { API_ENDPOINTS } from './config';
import type {
  StadiumGuide,
  StadiumGuidesResponse,
  StadiumGuidesQueryParams,
} from './types';

/**
 * Stadium Guides API Service
 */
export const stadiumsApi = {
  /**
   * Get stadium guides with optional filtering
   */
  async getStadiumGuides(params?: StadiumGuidesQueryParams): Promise<StadiumGuidesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.venue) searchParams.append('venue', params.venue);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.STADIUMS.GUIDES}?${queryString}` : API_ENDPOINTS.STADIUMS.GUIDES;
    
    return apiClient<StadiumGuidesResponse>(endpoint);
  },

  /**
   * Get stadium guide for a specific venue
   */
  async getStadiumGuide(venueId: string): Promise<{ stadium: StadiumGuide }> {
    return apiClient<{ stadium: StadiumGuide }>(`${API_ENDPOINTS.STADIUMS.GUIDES}/${venueId}`);
  },

  /**
   * Get stadium guide by venue name
   */
  async getStadiumGuideByVenue(venueName: string): Promise<StadiumGuidesResponse> {
    return this.getStadiumGuides({ venue: venueName, limit: 1 });
  },
};
