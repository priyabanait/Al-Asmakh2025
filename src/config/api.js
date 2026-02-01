// API Configuration Constants
// Development: http://localhost:3002
// Production: https://api.alasmakhrealestate.com

// Determine API URL based on environment
const getApiBaseUrl = () => {
    // Check if NEXT_PUBLIC_API_URL is explicitly set
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    
    // Default to localhost:3002 for development, production URL for production
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3002';
    }
    
    // Production URL
    return 'https://api.alasmakhrealestate.com';
};

// Use environment-aware API URL
export const API_BASE_URL = getApiBaseUrl();
export const SEARCH_API_BASE_URL = getApiBaseUrl();

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

