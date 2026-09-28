'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { oauthService } from '@/lib/oauth'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/auth-store'

function FacebookCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string>('')
  
  const { setUser, setTokens, setLoading, setError: setAuthError } = useAuthStore()
  // OAuth codes are single-use; React Strict Mode runs effects twice in dev
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const handleCallback = async () => {
      try {
        setLoading(true)
        
        // Get OAuth parameters from URL
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')

        // Handle OAuth errors
        if (error) {
          throw new Error(`OAuth error: ${error}`)
        }

        if (!code || !state) {
          throw new Error('Missing OAuth parameters')
        }

        // Validate state, then let the backend exchange the code with Facebook
        const exchange = oauthService.handleFacebookCallback(code, state)
        const authResponse = await authApi.socialAuth(exchange)

        // Store user and tokens in auth store
        setUser(authResponse.user)
        setTokens(authResponse.tokens.accessToken, authResponse.tokens.refreshToken)
        
        setStatus('success')
        
        // Redirect to onboarding for new users, or matches for existing users
        if (authResponse.isNewUser) {
          router.replace('/auth/onboarding')
        } else {
          router.replace('/matches')
        }

      } catch (err) {
        console.error('Facebook OAuth callback error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
        setError(errorMessage)
        setAuthError(errorMessage)
        setStatus('error')
        
        // Clean up OAuth session
        oauthService.clearSession()
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.replace('/auth/login?error=oauth_failed')
        }, 3000)
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [searchParams, router, setUser, setTokens, setLoading, setAuthError])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Authenticating with Facebook...
              </h2>
              <p className="text-blue-200">
                Please wait while we complete your sign-in.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Authentication Successful!
              </h2>
              <p className="text-blue-200">
                Redirecting you to the app...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Authentication Failed
              </h2>
              <p className="text-red-200 mb-4">
                {error}
              </p>
              <p className="text-blue-200 text-sm">
                Redirecting to login page...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Loading fallback component
function CallbackLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Loading...
          </h2>
          <p className="text-blue-200">
            Please wait while we process your request.
          </p>
        </div>
      </div>
    </div>
  )
}

// Main component wrapped in Suspense
export default function FacebookCallbackPage() {
  return (
    <Suspense fallback={<CallbackLoading />}>
      <FacebookCallbackContent />
    </Suspense>
  )
}
