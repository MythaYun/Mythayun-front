# OAuth Configuration Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=https://your-railway-backend.railway.app

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Facebook OAuth Configuration  
NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id
NEXT_PUBLIC_FACEBOOK_APP_SECRET=your-facebook-app-secret
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback/google` (development)
   - `https://your-domain.com/auth/callback/google` (production)
7. Copy the Client ID to `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

## Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing one
3. Add "Facebook Login" product
4. In Facebook Login settings, add Valid OAuth Redirect URIs:
   - `http://localhost:3000/auth/callback/facebook` (development)
   - `https://your-domain.com/auth/callback/facebook` (production)
5. Copy App ID to `NEXT_PUBLIC_FACEBOOK_APP_ID`
6. Copy App Secret to `NEXT_PUBLIC_FACEBOOK_APP_SECRET`

## Testing OAuth Flow

1. Ensure backend is running and accessible
2. Start frontend development server: `npm run dev`
3. Navigate to `/auth/login`
4. Click "Continue with Google" or "Continue with Facebook"
5. Complete OAuth flow on provider's site
6. Verify callback handling and JWT storage

## Security Notes

- Never commit `.env.local` to version control
- Use different OAuth apps for development and production
- Regularly rotate OAuth secrets
- Implement proper CORS settings on backend
- Monitor OAuth usage and rate limits

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**
   - Check that redirect URIs match exactly in OAuth provider settings
   - Ensure protocol (http/https) matches

2. **"OAuth error: access_denied"**
   - User cancelled OAuth flow
   - Check OAuth app permissions and scopes

3. **"Failed to exchange code for token"**
   - Check client ID/secret configuration
   - Verify network connectivity to OAuth provider

4. **"Authentication failed" on callback**
   - Check backend `/auth/social-auth` endpoint
   - Verify JWT token generation and storage

### Debug Steps:

1. Check browser console for errors
2. Verify network requests in DevTools
3. Check backend logs for API errors
4. Validate environment variables are loaded correctly

## Backend Integration

The frontend sends the following data to `/auth/social-auth`:

```typescript
{
  provider: 'google' | 'facebook',
  providerId: string,
  email: string,
  name: string,
  avatar?: string
}
```

Expected backend response:

```typescript
{
  message: 'Social authentication successful',
  user: User,
  tokens: { accessToken: string, refreshToken: string, ... },
  isNewUser: boolean
}
```
