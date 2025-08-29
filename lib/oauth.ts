/**
 * Native OAuth Service for Google and Facebook Authentication
 * 
 * Implements secure OAuth 2.0 flows with PKCE for Google and state parameter for Facebook
 * No external dependencies - uses native browser APIs for maximum compatibility
 */

// OAuth Configuration
const OAUTH_CONFIG = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scope: 'openid email profile',
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    userInfoUrl: 'https://graph.facebook.com/me',
    scope: 'email,public_profile',
    clientId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
  }
}

// OAuth Types
export interface OAuthUser {
  id: string
  email: string
  name: string
  picture?: string
}

export interface OAuthResult {
  provider: 'google' | 'facebook'
  user: OAuthUser
  accessToken: string
}

// Utility functions for PKCE (Google)
function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// Generate random state for CSRF protection
function generateState(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array)).replace(/[+/=]/g, '')
}

/**
 * OAuth Service Class
 */
export class OAuthService {
  private static instance: OAuthService
  
  static getInstance(): OAuthService {
    if (!OAuthService.instance) {
      OAuthService.instance = new OAuthService()
    }
    return OAuthService.instance
  }

  /**
   * Initiate Google OAuth flow
   */
  async initiateGoogleAuth(): Promise<void> {
    const config = OAUTH_CONFIG.google
    
    if (!config.clientId) {
      throw new Error('Google Client ID not configured')
    }

    // Generate PKCE parameters
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    const state = generateState()

    // Store PKCE parameters in sessionStorage
    sessionStorage.setItem('oauth_code_verifier', codeVerifier)
    sessionStorage.setItem('oauth_state', state)
    sessionStorage.setItem('oauth_provider', 'google')

    // Build authorization URL
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: `${window.location.origin}/auth/callback/google`,
      response_type: 'code',
      scope: config.scope,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state: state,
      access_type: 'offline',
      prompt: 'consent'
    })

    const authUrl = `${config.authUrl}?${params.toString()}`
    
    // Redirect to Google OAuth
    window.location.href = authUrl
  }

  /**
   * Initiate Facebook OAuth flow
   */
  async initiateFacebookAuth(): Promise<void> {
    const config = OAUTH_CONFIG.facebook
    
    if (!config.clientId) {
      throw new Error('Facebook App ID not configured')
    }

    // Generate state for CSRF protection
    const state = generateState()

    // Store state in sessionStorage
    sessionStorage.setItem('oauth_state', state)
    sessionStorage.setItem('oauth_provider', 'facebook')

    // Build authorization URL
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: `${window.location.origin}/auth/callback/facebook`,
      response_type: 'code',
      scope: config.scope,
      state: state
    })

    const authUrl = `${config.authUrl}?${params.toString()}`
    
    // Redirect to Facebook OAuth
    window.location.href = authUrl
  }

  /**
   * Handle Google OAuth callback
   */
  async handleGoogleCallback(code: string, state: string): Promise<OAuthResult> {
    const config = OAUTH_CONFIG.google
    
    // Verify state parameter
    const storedState = sessionStorage.getItem('oauth_state')
    if (state !== storedState) {
      throw new Error('Invalid state parameter - possible CSRF attack')
    }

    // Get stored PKCE verifier
    const codeVerifier = sessionStorage.getItem('oauth_code_verifier')
    if (!codeVerifier) {
      throw new Error('Missing code verifier - invalid OAuth flow')
    }

    // Exchange code for access token
    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
        code: code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: `${window.location.origin}/auth/callback/google`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()
    
    // Get user info
    const userResponse = await fetch(`${config.userInfoUrl}?access_token=${tokenData.access_token}`)
    
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info')
    }

    const userData = await userResponse.json()

    // Clean up session storage
    sessionStorage.removeItem('oauth_code_verifier')
    sessionStorage.removeItem('oauth_state')
    sessionStorage.removeItem('oauth_provider')

    return {
      provider: 'google',
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture
      },
      accessToken: tokenData.access_token
    }
  }

  /**
   * Handle Facebook OAuth callback
   */
  async handleFacebookCallback(code: string, state: string): Promise<OAuthResult> {
    const config = OAUTH_CONFIG.facebook
    
    // Verify state parameter
    const storedState = sessionStorage.getItem('oauth_state')
    if (state !== storedState) {
      throw new Error('Invalid state parameter - possible CSRF attack')
    }

    // Exchange code for access token
    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: process.env.NEXT_PUBLIC_FACEBOOK_APP_SECRET || '',
        code: code,
        redirect_uri: `${window.location.origin}/auth/callback/facebook`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()
    
    // Get user info
    const userResponse = await fetch(`${config.userInfoUrl}?fields=id,name,email,picture&access_token=${tokenData.access_token}`)
    
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info')
    }

    const userData = await userResponse.json()

    // Clean up session storage
    sessionStorage.removeItem('oauth_state')
    sessionStorage.removeItem('oauth_provider')

    return {
      provider: 'facebook',
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture?.data?.url
      },
      accessToken: tokenData.access_token
    }
  }

  /**
   * Get current OAuth provider from session
   */
  getCurrentProvider(): string | null {
    return sessionStorage.getItem('oauth_provider')
  }

  /**
   * Clear OAuth session data
   */
  clearSession(): void {
    sessionStorage.removeItem('oauth_code_verifier')
    sessionStorage.removeItem('oauth_state')
    sessionStorage.removeItem('oauth_provider')
  }
}

// Export singleton instance
export const oauthService = OAuthService.getInstance()
