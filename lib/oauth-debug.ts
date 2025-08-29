/**
 * OAuth Debug Service - Enhanced version with detailed logging
 * 
 * This service provides the same OAuth functionality as the main service
 * but with comprehensive debugging to help identify token exchange issues
 */

import { OAuthResult, OAuthUser } from './oauth'

// OAuth Configuration with debugging
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
 * Enhanced OAuth Service with Debugging
 */
export class OAuthDebugService {
  /**
   * Handle Google OAuth callback with detailed debugging
   */
  static async handleGoogleCallback(code: string, state: string): Promise<OAuthResult> {
    const config = OAUTH_CONFIG.google
    
    console.group('🔍 Google OAuth Debug - Starting Token Exchange')
    
    // Verify state parameter
    const storedState = sessionStorage.getItem('oauth_state')
    console.log('State Verification:', {
      receivedState: state,
      storedState: storedState,
      match: state === storedState
    })
    
    if (state !== storedState) {
      console.error('❌ State parameter mismatch - possible CSRF attack')
      throw new Error('Invalid state parameter - possible CSRF attack')
    }

    // Get stored PKCE verifier
    const codeVerifier = sessionStorage.getItem('oauth_code_verifier')
    console.log('PKCE Verification:', {
      hasCodeVerifier: !!codeVerifier,
      codeVerifierLength: codeVerifier?.length || 0
    })
    
    if (!codeVerifier) {
      console.error('❌ Missing code verifier - invalid OAuth flow')
      throw new Error('Missing code verifier - invalid OAuth flow')
    }

    // Log configuration status
    console.log('OAuth Configuration:', {
      clientId: config.clientId ? `${config.clientId.substring(0, 20)}...` : 'NOT SET',
      tokenUrl: config.tokenUrl,
      redirectUri: `${window.location.origin}/auth/callback/google`,
      code: code ? `${code.substring(0, 30)}...` : 'NOT SET'
    })

    // Prepare token exchange request
    const tokenRequestBody = new URLSearchParams({
      client_id: config.clientId,
      code: code,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code',
      redirect_uri: `${window.location.origin}/auth/callback/google`,
    })

    console.log('Token Request Body:', {
      client_id: config.clientId ? 'SET' : 'NOT SET',
      code: code ? 'SET' : 'NOT SET',
      code_verifier: codeVerifier ? 'SET' : 'NOT SET',
      grant_type: 'authorization_code',
      redirect_uri: `${window.location.origin}/auth/callback/google`
    })

    try {
      // Exchange code for access token
      console.log('🚀 Making token exchange request to:', config.tokenUrl)
      
      const tokenResponse = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenRequestBody,
      })

      console.log('Token Response Status:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        ok: tokenResponse.ok,
        headers: Object.fromEntries(tokenResponse.headers.entries())
      })

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        console.error('❌ Token Exchange Failed:', {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          error: errorText,
          url: config.tokenUrl
        })
        
        // Try to parse error as JSON for more details
        try {
          const errorJson = JSON.parse(errorText)
          console.error('Parsed Error Details:', errorJson)
        } catch {
          console.error('Raw Error Text:', errorText)
        }
        
        throw new Error(`Google token exchange failed: ${tokenResponse.status} ${tokenResponse.statusText} - ${errorText}`)
      }

      const tokenData = await tokenResponse.json()
      console.log('✅ Token Exchange Success:', {
        hasAccessToken: !!tokenData.access_token,
        tokenType: tokenData.token_type,
        expiresIn: tokenData.expires_in,
        scope: tokenData.scope
      })
      
      // Get user info
      console.log('🚀 Fetching user info from:', config.userInfoUrl)
      
      const userResponse = await fetch(`${config.userInfoUrl}?access_token=${tokenData.access_token}`)
      
      console.log('User Info Response:', {
        status: userResponse.status,
        statusText: userResponse.statusText,
        ok: userResponse.ok
      })
      
      if (!userResponse.ok) {
        const userErrorText = await userResponse.text()
        console.error('❌ User Info Fetch Failed:', {
          status: userResponse.status,
          statusText: userResponse.statusText,
          error: userErrorText
        })
        throw new Error(`Failed to fetch user info: ${userResponse.status} ${userResponse.statusText}`)
      }

      const userData = await userResponse.json()
      console.log('✅ User Info Success:', {
        hasId: !!userData.id,
        hasEmail: !!userData.email,
        hasName: !!userData.name,
        hasPicture: !!userData.picture
      })

      // Clean up session storage
      sessionStorage.removeItem('oauth_code_verifier')
      sessionStorage.removeItem('oauth_state')
      sessionStorage.removeItem('oauth_provider')

      const result: OAuthResult = {
        provider: 'google',
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          picture: userData.picture
        },
        accessToken: tokenData.access_token
      }

      console.log('✅ Google OAuth Complete:', {
        provider: result.provider,
        userId: result.user.id,
        userEmail: result.user.email
      })
      
      console.groupEnd()
      return result

    } catch (error) {
      console.error('❌ Google OAuth Error:', error)
      console.groupEnd()
      throw error
    }
  }

  /**
   * Handle Facebook OAuth callback with detailed debugging
   */
  static async handleFacebookCallback(code: string, state: string): Promise<OAuthResult> {
    const config = OAUTH_CONFIG.facebook
    
    console.group('🔍 Facebook OAuth Debug - Starting Token Exchange')
    
    // Verify state parameter
    const storedState = sessionStorage.getItem('oauth_state')
    console.log('State Verification:', {
      receivedState: state,
      storedState: storedState,
      match: state === storedState
    })
    
    if (state !== storedState) {
      console.error('❌ State parameter mismatch - possible CSRF attack')
      throw new Error('Invalid state parameter - possible CSRF attack')
    }

    console.log('OAuth Configuration:', {
      clientId: config.clientId ? `${config.clientId.substring(0, 20)}...` : 'NOT SET',
      tokenUrl: config.tokenUrl,
      redirectUri: `${window.location.origin}/auth/callback/facebook`,
      code: code ? `${code.substring(0, 30)}...` : 'NOT SET'
    })

    try {
      // Exchange code for access token
      console.log('🚀 Making token exchange request to:', config.tokenUrl)
      
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

      console.log('Token Response Status:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        ok: tokenResponse.ok
      })

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        console.error('❌ Facebook Token Exchange Failed:', {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          error: errorText
        })
        throw new Error(`Facebook token exchange failed: ${tokenResponse.status} ${tokenResponse.statusText}`)
      }

      const tokenData = await tokenResponse.json()
      console.log('✅ Facebook Token Exchange Success:', {
        hasAccessToken: !!tokenData.access_token
      })
      
      // Get user info
      const userResponse = await fetch(`${config.userInfoUrl}?fields=id,name,email,picture&access_token=${tokenData.access_token}`)
      
      if (!userResponse.ok) {
        const userErrorText = await userResponse.text()
        console.error('❌ Facebook User Info Failed:', userErrorText)
        throw new Error('Failed to fetch user info')
      }

      const userData = await userResponse.json()
      console.log('✅ Facebook User Info Success:', {
        hasId: !!userData.id,
        hasEmail: !!userData.email,
        hasName: !!userData.name
      })

      // Clean up session storage
      sessionStorage.removeItem('oauth_state')
      sessionStorage.removeItem('oauth_provider')

      const result: OAuthResult = {
        provider: 'facebook',
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          picture: userData.picture?.data?.url
        },
        accessToken: tokenData.access_token
      }

      console.log('✅ Facebook OAuth Complete')
      console.groupEnd()
      return result

    } catch (error) {
      console.error('❌ Facebook OAuth Error:', error)
      console.groupEnd()
      throw error
    }
  }
}
