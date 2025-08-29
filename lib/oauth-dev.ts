/**
 * OAuth Development Helper
 * 
 * Provides mock OAuth functionality for development and testing
 * when real OAuth credentials are not available
 */

import { OAuthResult, OAuthUser } from './oauth'

export class OAuthDevHelper {
  /**
   * Check if we're in development mode without OAuth credentials
   */
  static isDevelopmentMode(): boolean {
    const hasGoogleClientId = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const hasFacebookAppId = !!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
    
    return !hasGoogleClientId || !hasFacebookAppId
  }

  /**
   * Get development configuration status
   */
  static getConfigStatus() {
    return {
      googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
      facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ? 'SET' : 'NOT SET',
      apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'NOT SET',
      isDevelopmentMode: this.isDevelopmentMode()
    }
  }

  /**
   * Create mock OAuth result for development testing
   */
  static createMockOAuthResult(provider: 'google' | 'facebook'): OAuthResult {
    const mockUsers: Record<string, OAuthUser> = {
      google: {
        id: 'dev-google-123',
        email: 'dev.user@gmail.com',
        name: 'Dev User (Google)',
        picture: 'https://via.placeholder.com/150/4285f4/ffffff?text=G'
      },
      facebook: {
        id: 'dev-facebook-456',
        email: 'dev.user@facebook.com',
        name: 'Dev User (Facebook)',
        picture: 'https://via.placeholder.com/150/1877f2/ffffff?text=F'
      }
    }

    return {
      provider,
      user: mockUsers[provider],
      accessToken: `dev-token-${provider}-${Date.now()}`
    }
  }

  /**
   * Show development configuration guide
   */
  static showConfigGuide() {
    const status = this.getConfigStatus()
    
    console.group('🔧 OAuth Development Configuration')
    console.log('Current Status:', status)
    
    if (status.isDevelopmentMode) {
      console.warn('⚠️  OAuth credentials not configured for development')
      console.log('📖 To set up OAuth:')
      console.log('1. Create .env.local file in project root')
      console.log('2. Add the following variables:')
      console.log('   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id')
      console.log('   NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id')
      console.log('   NEXT_PUBLIC_API_BASE_URL=your-backend-url')
      console.log('3. See OAUTH_SETUP.md for detailed setup instructions')
    } else {
      console.log('✅ OAuth credentials configured')
    }
    
    console.groupEnd()
  }

  /**
   * Enhanced error logging for OAuth debugging
   */
  static logOAuthError(provider: string, error: any, context: any = {}) {
    console.group(`❌ ${provider} OAuth Error`)
    console.error('Error:', error.message || error)
    console.log('Context:', context)
    console.log('Configuration:', this.getConfigStatus())
    console.log('Troubleshooting:')
    console.log('1. Check environment variables are set')
    console.log('2. Verify OAuth app configuration')
    console.log('3. Check redirect URIs match exactly')
    console.log('4. Ensure backend is accessible')
    console.groupEnd()
  }
}

/**
 * Development OAuth flow simulator
 */
export class MockOAuthService {
  /**
   * Simulate Google OAuth flow for development
   */
  static async simulateGoogleAuth(): Promise<OAuthResult> {
    console.log('🔄 Simulating Google OAuth flow for development...')
    
    // Simulate OAuth delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return OAuthDevHelper.createMockOAuthResult('google')
  }

  /**
   * Simulate Facebook OAuth flow for development
   */
  static async simulateFacebookAuth(): Promise<OAuthResult> {
    console.log('🔄 Simulating Facebook OAuth flow for development...')
    
    // Simulate OAuth delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return OAuthDevHelper.createMockOAuthResult('facebook')
  }
}
