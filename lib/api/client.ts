/**
 * API client with authentication handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333';

// Store for ongoing requests to prevent duplicate refreshes
let refreshPromise: Promise<string | null> | null = null;

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Enhanced fetch client with auth handling
 */
async function apiClient<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Add auth header if not skipping auth
  const headers = new Headers(fetchOptions.headers || {});
  
  if (!skipAuth) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  
  // Set Content-Type for JSON requests
  if (!headers.has('Content-Type') && fetchOptions.body) {
    headers.set('Content-Type', 'application/json');
  }
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });
    
    // Handle 401 Unauthorized - attempt token refresh
    if (response.status === 401 && !skipAuth) {
      console.log('Token expired, attempting refresh...');
      const newToken = await handleTokenRefresh();
      
      if (newToken) {
        console.log('Token refreshed successfully, retrying request...');
        // Retry with new token
        headers.set('Authorization', `Bearer ${newToken}`);
        const retryResponse = await fetch(url, {
          ...fetchOptions,
          headers,
        });
        
        if (!retryResponse.ok) {
          throw new Error(`API error: ${retryResponse.status}`);
        }
        
        return await retryResponse.json();
      }
      
      // If refresh failed, clear tokens and redirect to login
      console.error('Token refresh failed, clearing auth state');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      
      throw new Error('Authentication failed - please login again');
    }
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      
      try {
        const errorData = await response.json();
        console.log('API Error Response:', errorData); // Debug log for better error visibility
        
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.messages && Array.isArray(errorData.messages)) {
          // Handle messages array from backend (can be strings or objects)
          errorMessage = errorData.messages.map((msg: any) => 
            typeof msg === 'string' ? msg : (msg.message || msg.text || JSON.stringify(msg))
          ).join('; ');
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.errors) {
          // Handle validation errors array or object
          if (Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.join(', ');
          } else if (typeof errorData.errors === 'object') {
            // Handle validation errors object (field: [messages])
            const validationErrors = Object.entries(errorData.errors)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('; ');
            errorMessage = `Validation errors: ${validationErrors}`;
          } else {
            errorMessage = JSON.stringify(errorData.errors);
          }
        } else if (errorData.details) {
          // Handle additional error details
          errorMessage = Array.isArray(errorData.details) 
            ? errorData.details.join(', ')
            : JSON.stringify(errorData.details);
        }
      } catch (parseError) {
        // If we can't parse the error response, use the status
        console.warn('Could not parse error response:', parseError);
      }
      
      // Ensure errorMessage is always a string
      const finalErrorMessage = typeof errorMessage === 'string' 
        ? errorMessage 
        : JSON.stringify(errorMessage);
      
      throw new Error(finalErrorMessage);
    }
    
    // For empty responses (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Handle token refresh with request queuing to prevent multiple refresh attempts
 */
async function handleTokenRefresh(): Promise<string | null> {
  // If a refresh is already in progress, wait for it
  if (refreshPromise) {
    return refreshPromise;
  }
  
  const refreshTokenValue = localStorage.getItem('refreshToken');
  if (!refreshTokenValue) {
    // No refresh token available, can't refresh
    return null;
  }
  
  // Create a new refresh promise
  refreshPromise = new Promise<string | null>(async (resolve) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });
      
      if (!response.ok) {
        throw new Error(`Refresh token error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle different possible response structures
      let accessToken = null;
      
      if (data.tokens?.accessToken) {
        // Structure: { tokens: { accessToken, refreshToken } }
        accessToken = data.tokens.accessToken;
        localStorage.setItem('accessToken', accessToken);
        if (data.tokens.refreshToken) {
          localStorage.setItem('refreshToken', data.tokens.refreshToken);
        }
      } else if (data.accessToken) {
        // Structure: { accessToken, refreshToken }
        accessToken = data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
      }
      
      if (accessToken) {
        console.log('Token refresh successful');
        resolve(accessToken);
      } else {
        console.error('Invalid refresh response structure:', data);
        // Refresh failed, clear tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        resolve(null);
      }
    } catch (error) {
      // Refresh failed, clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      console.error('Token refresh failed:', error);
      resolve(null);
    } finally {
      refreshPromise = null;
    }
  });
  
  return refreshPromise;
}

export default apiClient;
