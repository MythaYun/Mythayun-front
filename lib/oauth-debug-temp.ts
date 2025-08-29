/**
 * Temporary OAuth Debug Service - Enhanced version with detailed logging
 * 
 * This service provides debugging for the Google OAuth token exchange issue
 */

// OAuth Configuration with debugging
const OAUTH_CONFIG = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scope: 'openid email profile',
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  }
}

/**
 * Enhanced OAuth Debug Service
 */
export class OAuthDebugService {
  /**
   * Handle Google OAuth callback with detailed debugging
   */
  static async handleGoogleCallback(code: string, state: string): Promise<any> {
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
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '', // Add client_secret
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
      
      console.groupEnd()
      return {
        provider: 'google',
        user: { id: 'debug', email: 'debug@test.com', name: 'Debug User' },
        accessToken: tokenData.access_token
      }

    } catch (error) {
      console.error('❌ Google OAuth Error:', error)
      console.groupEnd()
      throw error
    }
  }
}
