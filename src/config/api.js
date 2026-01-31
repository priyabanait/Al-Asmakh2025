// API Configuration Constants
// Production API URLs - Hardcoded for production deployment (CORS configured properly)
// DO NOT depend on environment variables - using hardcoded production URLs

// Production API base URL - Hardcoded
const PRODUCTION_API_URL = 'https://api.alasmakhrealestate.com';
const PRODUCTION_SEARCH_API_URL = 'https://api.alasmakhrealestate.com';

// Use direct API calls (no proxy needed)
export const API_BASE_URL = PRODUCTION_API_URL;
export const SEARCH_API_BASE_URL = PRODUCTION_SEARCH_API_URL;

// Get full API URL
export const getApiUrl = (endpoint) => {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    // Ensure base URL doesn't end with slash
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${baseUrl}/${cleanEndpoint}`;
};

// Get full Search API URL
export const getSearchApiUrl = (endpoint) => {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    // Ensure base URL doesn't end with slash
    const baseUrl = SEARCH_API_BASE_URL.endsWith('/') ? SEARCH_API_BASE_URL.slice(0, -1) : SEARCH_API_BASE_URL;
    return `${baseUrl}/${cleanEndpoint}`;
};

