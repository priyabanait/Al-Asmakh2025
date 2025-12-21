# OAuth Frontend Implementation Guide

## Overview

This frontend implementation supports OAuth authentication for **Google**, **Microsoft**, and **LinkedIn**. Users can sign up or log in using their social media accounts directly from the login and signup pages.

## Features

✅ **Google Sign-In** - Using Google Identity Services (GSI)  
✅ **Microsoft Sign-In** - Using MSAL.js (Microsoft Authentication Library)  
✅ **LinkedIn Sign-In** - Using OAuth 2.0 redirect flow  
✅ **Automatic Account Linking** - Links OAuth accounts to existing email accounts  
✅ **Loading States** - Visual feedback during OAuth flows  
✅ **Error Handling** - Comprehensive error messages

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed:

- `@azure/msal-browser` - Microsoft authentication
- `@azure/msal-react` - React integration for MSAL

### 2. Configure Environment Variables

1. Copy `sample.env.local` to `.env.local`:

   ```bash
   cp sample.env.local .env.local
   ```

2. Add your OAuth credentials to `.env.local`:

   ```env
   # Backend API URL
   NEXT_PUBLIC_API_URL=https://albackend.x-360.ai

   # Google OAuth - Get from Google Cloud Console
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

   # Microsoft OAuth - Get from Azure Portal
   NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_microsoft_client_id_here

   # LinkedIn OAuth - Get from LinkedIn Developer Portal
   NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
   ```

### 3. Get OAuth Credentials

#### **Google OAuth Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google Identity API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain (e.g., `https://yourdomain.com`)
7. Copy the **Client ID** and add to `.env.local`

#### **Microsoft OAuth Setup**

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Set redirect URI: `http://localhost:3000` (for development)
5. Copy the **Application (client) ID** and add to `.env.local`

#### **LinkedIn OAuth Setup**

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add redirect URL: `http://localhost:3000/auth/linkedin/callback`
4. Request access to "Sign In with LinkedIn using OpenID Connect"
5. Copy the **Client ID** and add to `.env.local`

## How It Works

### **Login Flow**

1. User clicks OAuth button (Google/Microsoft/LinkedIn)
2. OAuth provider authentication popup/redirect opens
3. User authenticates with provider
4. Provider returns token/ID token
5. Frontend sends token to backend: `POST /api/users/oauth/:provider`
6. Backend verifies token and creates/logs in user
7. Frontend receives JWT token and redirects to dashboard

### **Signup Flow**

- Same as login flow
- Backend automatically creates account if user doesn't exist
- If email exists, links OAuth account to existing account

## File Structure

```
frontend-project/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.js          # Login page with OAuth buttons
│   │   ├── signup/
│   │   │   └── page.js          # Signup page with OAuth buttons
│   │   └── auth/
│   │       └── linkedin/
│   │           └── callback/
│   │               └── page.js   # LinkedIn OAuth callback handler
│   ├── config/
│   │   └── oauthConfig.js       # OAuth configuration
│   ├── contexts/
│   │   └── AuthContext.js        # Auth context with oauthLogin function
│   └── utils/
│       └── oauthService.js       # OAuth service functions
└── sample.env.local              # Environment variables template
```

## OAuth Service Functions

### `signInWithGoogle()`

- Initializes Google Identity Services
- Opens Google Sign-In popup
- Returns Google ID token

### `signInWithMicrosoft()`

- Uses MSAL.js for authentication
- Opens Microsoft authentication popup
- Returns Microsoft access token

### `signInWithLinkedIn()`

- Redirects to LinkedIn OAuth page
- Returns to callback page with authorization code
- Requires backend endpoint to exchange code for token

## Usage in Components

```javascript
import { useAuth } from "../../contexts/AuthContext";
import {
  signInWithGoogle,
  signInWithMicrosoft,
  signInWithLinkedIn,
} from "../../utils/oauthService";

function MyComponent() {
  const { oauthLogin } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const token = await signInWithGoogle();
      await oauthLogin("google", token);
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  // Similar for Microsoft and LinkedIn...
}
```

## Error Handling

The implementation includes comprehensive error handling:

- **Network errors** - Displayed to user
- **OAuth errors** - Provider-specific error messages
- **Configuration errors** - Clear messages if credentials missing
- **Loading states** - Visual feedback during OAuth flows

## Production Considerations

1. **Environment Variables**: Make sure to set production OAuth credentials
2. **Redirect URIs**: Update OAuth provider redirect URIs for production domain
3. **HTTPS**: OAuth requires HTTPS in production
4. **LinkedIn Callback**: Implement backend endpoint for LinkedIn code exchange
5. **Error Monitoring**: Add error tracking (e.g., Sentry) for production

## Troubleshooting

### Google Sign-In Not Working

- Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
- Verify authorized JavaScript origins include your domain
- Check browser console for errors

### Microsoft Sign-In Not Working

- Check `NEXT_PUBLIC_MICROSOFT_CLIENT_ID` is set correctly
- Verify redirect URI matches Azure app registration
- Check browser console for MSAL errors

### LinkedIn Sign-In Not Working

- Check `NEXT_PUBLIC_LINKEDIN_CLIENT_ID` is set correctly
- Verify redirect URI matches LinkedIn app settings
- Note: LinkedIn requires backend endpoint for code exchange

## Next Steps

1. ✅ Add OAuth credentials to `.env.local`
2. ✅ Test each OAuth provider
3. ✅ Update redirect URIs for production
4. ⚠️ Implement LinkedIn code exchange endpoint (if needed)

## Support

For backend OAuth implementation details, see `backend-project/OAUTH_IMPLEMENTATION.md`
