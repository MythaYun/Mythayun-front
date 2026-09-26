/**
 * Native OAuth Service for Google and Facebook Authentication
 * 
 * Implements secure OAuth 2.0 flows with PKCE for Google and state parameter for Facebook
 * No external dependencies - uses native browser APIs for maximum compatibility
 */

import type { SocialAuthRequest } from '@/lib/api/types'

// OAuth Configuration. Only public client IDs live here: the code-for-token
// exchange needs the client secret, so the backend performs it.
const OAUTH_CONFIG = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'openid email profile',
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    scope: 'email,public_profile',
    clientId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
  }
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
   * Handle Google OAuth callback: validate state and build the request the
   * backend uses to exchange the code with Google.
   */
  handleGoogleCallback(code: string, state: string): SocialAuthRequest {
    this.verifyState(state)

    // Get stored PKCE verifier
    const codeVerifier = sessionStorage.getItem('oauth_code_verifier')
    if (!codeVerifier) {
      throw new Error('Missing code verifier - invalid OAuth flow')
    }

    this.clearSession()

    return {
      provider: 'google',
      code,
      codeVerifier,
      redirectUri: `${window.location.origin}/auth/callback/google`,
    }
  }

  /**
   * Handle Facebook OAuth callback: validate state and build the request the
   * backend uses to exchange the code with Facebook.
   */
  handleFacebookCallback(code: string, state: string): SocialAuthRequest {
    this.verifyState(state)
    this.clearSession()

    return {
      provider: 'facebook',
      code,
      redirectUri: `${window.location.origin}/auth/callback/facebook`,
    }
  }

  /**
   * Reject callbacks whose state doesn't match the one we generated (CSRF)
   */
  private verifyState(state: string): void {
    const storedState = sessionStorage.getItem('oauth_state')
    if (!storedState || state !== storedState) {
      throw new Error('Invalid state parameter - possible CSRF attack')
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
