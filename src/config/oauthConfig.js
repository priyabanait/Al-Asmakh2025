// OAuth Configuration
// This file should be updated with your OAuth credentials

export const OAUTH_CONFIG = {
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '', // Will be set from environment
  },
  microsoft: {
    clientId: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || '', // Will be set from environment
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  },
  linkedin: {
    clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '', // Will be set from environment
    redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/auth/linkedin/callback` : '',
  },
  backendUrl: process.env.NEXT_PUBLIC_API_URL || 'https://albackend.x-360.ai',
};

