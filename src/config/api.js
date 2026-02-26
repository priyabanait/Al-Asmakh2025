// API Configuration Constants
// Development: http://localhost:3002 (property-service-spring)
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

// Marketing API URL (auth-service on port 3001)
const getMarketingApiBaseUrl = () => {
    // Check if NEXT_PUBLIC_MARKETING_API_URL is explicitly set
    if (process.env.NEXT_PUBLIC_MARKETING_API_URL) {
        return process.env.NEXT_PUBLIC_MARKETING_API_URL;
    }
    
    // Default to localhost:3001 for development (auth-service where marketing endpoint is hosted)
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3001';
    }
    
    // Production URL (marketing endpoint is on auth-service)
    return 'https://api.alasmakhrealestate.com';
};

// Elasticsearch API URL (media-search-service on port 3003)
const getElasticsearchApiBaseUrl = () => {
    // Check if NEXT_PUBLIC_ELASTICSEARCH_API_URL is explicitly set
    if (process.env.NEXT_PUBLIC_ELASTICSEARCH_API_URL) {
        return process.env.NEXT_PUBLIC_ELASTICSEARCH_API_URL;
    }
    
    // Default to localhost:3003 for development
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3003';
    }
    
    // Production / staging default:
    // Use the main API gateway domain and route traffic to the media-search-service
    // Health:  https://api.alasmakhrealestate.com/api/media/health
    // Search:  https://api.alasmakhrealestate.com/api/media/search
    return 'https://api.alasmakhrealestate.com/api/media';
};

// Use environment-aware API URL
export const API_BASE_URL = getApiBaseUrl();
export const SEARCH_API_BASE_URL = getApiBaseUrl();
export const MARKETING_API_BASE_URL = getMarketingApiBaseUrl();
export const ELASTICSEARCH_API_BASE_URL = getElasticsearchApiBaseUrl();

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

// Get full Marketing API URL (for blogs/articles - uses port 3001)
export const getMarketingApiUrl = (endpoint) => {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    // Ensure base URL doesn't end with slash
    const baseUrl = MARKETING_API_BASE_URL.endsWith('/') ? MARKETING_API_BASE_URL.slice(0, -1) : MARKETING_API_BASE_URL;
    return `${baseUrl}/${cleanEndpoint}`;
};

// Get full Elasticsearch API URL (for search - uses port 3003)
export const getElasticsearchApiUrl = (endpoint) => {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    // Ensure base URL doesn't end with slash
    const baseUrl = ELASTICSEARCH_API_BASE_URL.endsWith('/') ? ELASTICSEARCH_API_BASE_URL.slice(0, -1) : ELASTICSEARCH_API_BASE_URL;
    return `${baseUrl}/${cleanEndpoint}`;
};
