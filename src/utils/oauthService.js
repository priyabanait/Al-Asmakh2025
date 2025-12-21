/**
 * OAuth Service for handling Google, Microsoft, and LinkedIn authentication
 */

import { OAUTH_CONFIG } from '../config/oauthConfig';

/**
 * Initialize Google Sign-In
 * Loads Google Identity Services script
 */
export const initGoogleSignIn = () => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.google && window.google.accounts) {
      resolve();
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.accounts) {
        resolve();
      } else {
        reject(new Error('Failed to load Google Identity Services'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Google Identity Services script'));
    document.head.appendChild(script);
  });
};

/**
 * Sign in with Google using popup flow
 * Opens Google Sign-In popup and returns ID token
 */
export const signInWithGoogle = () => {
  return new Promise((resolve, reject) => {
    initGoogleSignIn()
      .then(() => {
        if (!OAUTH_CONFIG.google.clientId) {
          reject(new Error('Google Client ID is not configured'));
          return;
        }

        // Use Google One Tap or Button flow
        window.google.accounts.id.initialize({
          client_id: OAUTH_CONFIG.google.clientId,
          callback: (response) => {
            if (response.credential) {
              resolve(response.credential); // ID token
            } else {
              reject(new Error('Google sign-in failed'));
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Try One Tap first
        window.google.accounts.id.prompt((notification) => {
          // If One Tap is not displayed or skipped, use button flow
          if (
            notification.isNotDisplayed() ||
            notification.isSkippedMoment() ||
            notification.isDismissedMoment()
          ) {
            // Create a temporary button element
            const buttonDiv = document.createElement('div');
            buttonDiv.id = 'google-signin-temp';
            buttonDiv.style.position = 'fixed';
            buttonDiv.style.top = '-1000px';
            buttonDiv.style.left = '-1000px';
            document.body.appendChild(buttonDiv);

            // Render button
            window.google.accounts.id.renderButton(
              buttonDiv,
              {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
              }
            );

            // Click the button programmatically
            setTimeout(() => {
              const button = buttonDiv.querySelector('div[role="button"]');
              if (button) {
                button.click();
                // Clean up after a delay
                setTimeout(() => {
                  if (document.body.contains(buttonDiv)) {
                    document.body.removeChild(buttonDiv);
                  }
                }, 1000);
              } else {
                document.body.removeChild(buttonDiv);
                reject(new Error('Failed to initialize Google Sign-In'));
              }
            }, 100);
          }
        });
      })
      .catch(reject);
  });
};

/**
 * Sign in with Microsoft
 * Uses MSAL.js for authentication
 */
export const signInWithMicrosoft = async () => {
  try {
    const { PublicClientApplication } = await import('@azure/msal-browser');

    if (!OAUTH_CONFIG.microsoft.clientId) {
      throw new Error('Microsoft Client ID is not configured');
    }

    const msalConfig = {
      auth: {
        clientId: OAUTH_CONFIG.microsoft.clientId,
        authority: OAUTH_CONFIG.microsoft.authority,
        redirectUri: OAUTH_CONFIG.microsoft.redirectUri,
      },
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
      },
    };

    const msalInstance = new PublicClientApplication(msalConfig);
    await msalInstance.initialize();

    const loginRequest = {
      scopes: ['User.Read'],
    };

    const response = await msalInstance.loginPopup(loginRequest);
    
    if (response.accessToken) {
      return response.accessToken;
    } else {
      throw new Error('Failed to get Microsoft access token');
    }
  } catch (error) {
    console.error('Microsoft sign-in error:', error);
    throw error;
  }
};

/**
 * Sign in with LinkedIn
 * Uses OAuth 2.0 redirect flow (simpler for production)
 */
export const signInWithLinkedIn = () => {
  if (!OAUTH_CONFIG.linkedin.clientId) {
    throw new Error('LinkedIn Client ID is not configured');
  }

  const state = Math.random().toString(36).substring(7);
  sessionStorage.setItem('linkedin_oauth_state', state);
  
  const scope = 'openid profile email';
  const redirectUri = encodeURIComponent(OAUTH_CONFIG.linkedin.redirectUri);
  const clientId = OAUTH_CONFIG.linkedin.clientId;

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

  // Redirect to LinkedIn
  window.location.href = authUrl;
};

/**
 * Send OAuth token to backend for authentication
 */
export const authenticateWithOAuth = async (provider, token) => {
  try {
    const response = await fetch(`${OAUTH_CONFIG.backendUrl}/api/users/oauth/${provider}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `${provider} authentication failed`);
    }

    return data;
  } catch (error) {
    console.error(`OAuth authentication error (${provider}):`, error);
    throw error;
  }
};

