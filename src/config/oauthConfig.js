// OAuth Configuration
// This file should be updated with your OAuth credentials
import { API_BASE_URL } from './api';

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
  backendUrl: API_BASE_URL, // Environment-aware API URL (development: localhost:3002, production: api.alasmakhrealestate.com)
};

