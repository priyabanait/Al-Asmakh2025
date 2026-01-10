import { NextResponse } from 'next/server';

// Backend API base URL
// Use localhost for local development, production URL for deployed environments
const BACKEND_URL = process.env.BACKEND_API_URL || 
    (process.env.NODE_ENV === 'production' || process.env.VERCEL ? 'http://4.213.213.99' : 'http://localhost:3003');
const FETCH_TIMEOUT = 15000; // 15 seconds timeout (increased for Elasticsearch queries)

// Helper function to create a fetch with timeout
async function fetchWithTimeout(url, options = {}, timeout = FETCH_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout: Backend service did not respond in time');
        }
        throw error;
    }
}

/**
 * Fallback: Fetch properties from property service and apply client-side filtering
 */
async function fallbackSearch(searchParams) {
    try {
        console.log('[Search Proxy] Using fallback: fetching from property service');
        
        // Extract search parameters
        const q = searchParams.get('q') || searchParams.get('locationSearch') || '';
        const type = searchParams.get('type') || searchParams.get('propertyType');
        const category = searchParams.get('category');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const priceType = searchParams.get('priceType') || 'sale';
        const bedrooms = searchParams.getAll('bedrooms');
        const bathrooms = searchParams.getAll('bathrooms');
        const locationLevel1 = searchParams.get('locationLevel1');
        const locationLevel2 = searchParams.get('locationLevel2');
        const locationLevel3 = searchParams.get('locationLevel3');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;
        const status = searchParams.get('status') || 'published';

        // Fetch all properties from property service (we'll filter client-side)
        // Fetch in larger batches to get more data for filtering
        const fetchLimit = Math.max(limit * 5, 100); // Fetch more to filter from
        let allProperties = [];
        let currentPage = 1;
        let hasMore = true;
        const maxPages = 10; // Limit to prevent excessive requests

        while (hasMore && currentPage <= maxPages) {
            try {
                // Try both /api/properties and /api/v1/properties endpoints
                const propertyUrl = `${BACKEND_URL}/api/properties?page=${currentPage}&limit=${fetchLimit}&status=${status}`;
                const propertyUrlV1 = `${BACKEND_URL}/api/v1/properties?page=${currentPage}&limit=${fetchLimit}&status=${status}`;
                
                let propertyResponse;
                try {
                    propertyResponse = await fetchWithTimeout(propertyUrl, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' },
                        cache: 'no-store',
                    });
                    // If 404, try v1 endpoint
                    if (propertyResponse.status === 404) {
                        console.log(`[Search Proxy] Trying v1 endpoint: ${propertyUrlV1}`);
                        propertyResponse = await fetchWithTimeout(propertyUrlV1, {
                            method: 'GET',
                            headers: { 'Accept': 'application/json' },
                            cache: 'no-store',
                        });
                    }
                } catch (err) {
                    // If first endpoint fails, try v1
                    console.log(`[Search Proxy] Primary endpoint failed, trying v1: ${propertyUrlV1}`);
                    propertyResponse = await fetchWithTimeout(propertyUrlV1, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' },
                        cache: 'no-store',
                    });
                }

                if (propertyResponse.ok) {
                    const propertyData = await propertyResponse.json();
                    // Handle different response formats
                    let properties = [];
                    if (Array.isArray(propertyData)) {
                        properties = propertyData;
                    } else if (propertyData.properties && Array.isArray(propertyData.properties)) {
                        properties = propertyData.properties;
                    } else if (propertyData.data && Array.isArray(propertyData.data)) {
                        properties = propertyData.data;
                    }
                    
                    console.log(`[Search Proxy] Fetched ${properties.length} properties from page ${currentPage}`);
                    
                    if (properties.length === 0) {
                        hasMore = false;
                    } else {
                        allProperties = allProperties.concat(properties);
                        // Check if we have enough data or reached the end
                        const pagination = propertyData.pagination;
                        if (pagination && currentPage >= pagination.pages) {
                            hasMore = false;
                        } else if (properties.length < fetchLimit || allProperties.length >= 500) {
                            hasMore = false;
                        } else {
                            currentPage++;
                        }
                    }
                } else {
                    console.error(`[Search Proxy] Property service returned ${propertyResponse.status}`);
                    const errorText = await propertyResponse.text();
                    console.error(`[Search Proxy] Error response:`, errorText.substring(0, 200));
                    hasMore = false;
                }
            } catch (err) {
                console.error(`[Search Proxy] Error fetching page ${currentPage}:`, err.message);
                hasMore = false;
            }
        }

        console.log(`[Search Proxy] Fetched ${allProperties.length} properties for filtering`);

        // Apply client-side filtering
        let filteredProperties = allProperties;

        // Text search (name, location, description) - improved multi-word matching
        if (q) {
            const searchLower = q.toLowerCase().trim();
            // Split query into words and filter out common words
            const searchWords = searchLower.split(/\s+/).filter(word => 
                word.length > 2 && !['the', 'in', 'at', 'on', 'for', 'with', 'and', 'or'].includes(word)
            );
            
            // If no meaningful words after filtering, use original query
            const wordsToMatch = searchWords.length > 0 ? searchWords : [searchLower];
            
            filteredProperties = filteredProperties.filter(prop => {
                // Get all searchable text fields
                const searchableText = [
                    prop.titleEn || prop.title || '',
                    prop.titleAr || '',
                    prop.descriptionEn || prop.description || '',
                    prop.descriptionAr || '',
                    prop.locationLevel1 || '',
                    prop.locationLevel2 || '',
                    prop.locationLevel3 || '',
                    prop.address || '',
                    prop.city || '',
                    prop.district || '',
                    prop.type || prop.propertyType || '',
                    String(prop.bedrooms || ''),
                    String(prop.bathrooms || '')
                ].join(' ').toLowerCase();
                
                // Check if all search words appear in the searchable text
                // This allows "Modern 4BR Townhouse in Lusail" to match properties
                // that contain "Modern", "4BR", "Townhouse", and "Lusail" anywhere
                return wordsToMatch.every(word => searchableText.includes(word)) ||
                       // Also check for exact phrase match
                       searchableText.includes(searchLower);
            });
            
            console.log(`[Search Proxy] Filtered ${filteredProperties.length} properties from ${allProperties.length} using query: "${q}"`);
        }

        // Property type filter
        if (type) {
            const typeLower = type.toLowerCase();
            filteredProperties = filteredProperties.filter(prop => {
                const propType = (prop.type || prop.propertyType || '').toLowerCase();
                return propType === typeLower;
            });
        }

        // Category filter
        if (category) {
            filteredProperties = filteredProperties.filter(prop => {
                return (prop.category || '').toLowerCase() === category.toLowerCase();
            });
        }

        // Location filters
        if (locationLevel1) {
            filteredProperties = filteredProperties.filter(prop => {
                return (prop.locationLevel1 || '').toLowerCase() === locationLevel1.toLowerCase();
            });
        }
        if (locationLevel2) {
            filteredProperties = filteredProperties.filter(prop => {
                return (prop.locationLevel2 || '').toLowerCase() === locationLevel2.toLowerCase();
            });
        }
        if (locationLevel3) {
            filteredProperties = filteredProperties.filter(prop => {
                return (prop.locationLevel3 || '').toLowerCase() === locationLevel3.toLowerCase();
            });
        }

        // Bedrooms filter
        if (bedrooms.length > 0) {
            filteredProperties = filteredProperties.filter(prop => {
                const propBedrooms = String(prop.bedrooms || '');
                return bedrooms.some(bed => {
                    if (bed === 'Studio' || bed === 'studio') {
                        return propBedrooms === '0' || propBedrooms === 'studio' || propBedrooms === 'Studio';
                    }
                    if (bed === '7+') {
                        return parseInt(propBedrooms) >= 7;
                    }
                    return propBedrooms === bed || propBedrooms === String(bed);
                });
            });
        }

        // Bathrooms filter
        if (bathrooms.length > 0) {
            filteredProperties = filteredProperties.filter(prop => {
                const propBathrooms = String(prop.bathrooms || '');
                return bathrooms.some(bath => {
                    if (bath.endsWith('+')) {
                        const minBath = parseInt(bath);
                        return parseInt(propBathrooms) >= minBath;
                    }
                    return propBathrooms === bath || propBathrooms === String(bath);
                });
            });
        }

        // Price filter
        if (minPrice || maxPrice) {
            filteredProperties = filteredProperties.filter(prop => {
                const price = prop.priceAmount || prop.price || 0;
                const propPriceType = prop.priceType || 'sale';
                
                // Only filter by price if priceType matches
                if (priceType && propPriceType !== priceType) {
                    return false;
                }
                
                if (minPrice && price < parseInt(minPrice)) {
                    return false;
                }
                if (maxPrice && price > parseInt(maxPrice)) {
                    return false;
                }
                return true;
            });
        } else if (priceType) {
            // Filter by price type only
            filteredProperties = filteredProperties.filter(prop => {
                return (prop.priceType || 'sale') === priceType;
            });
        }

        // Sort by relevance (if search query) or by date
        if (q) {
            // Simple relevance: properties with query in title get higher priority
            filteredProperties.sort((a, b) => {
                const aTitle = (a.titleEn || a.title || '').toLowerCase();
                const bTitle = (b.titleEn || b.title || '').toLowerCase();
                const searchLower = q.toLowerCase();
                
                const aInTitle = aTitle.includes(searchLower);
                const bInTitle = bTitle.includes(searchLower);
                
                if (aInTitle && !bInTitle) return -1;
                if (!aInTitle && bInTitle) return 1;
                return 0;
            });
        } else {
            // Sort by creation date (newest first)
            filteredProperties.sort((a, b) => {
                const dateA = new Date(a.createdAt || a.updatedAt || 0);
                const dateB = new Date(b.createdAt || b.updatedAt || 0);
                return dateB - dateA;
            });
        }

        // Pagination
        const total = filteredProperties.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

        return {
            properties: paginatedProperties,
            hits: paginatedProperties, // For backward compatibility
            pagination: {
                total: total,
                page: page,
                limit: limit,
                pages: Math.ceil(total / limit)
            },
            total: total,
            fallback: true // Indicate this is a fallback response
        };
    } catch (error) {
        console.error('[Search Proxy] Fallback search error:', error);
        throw error;
    }
}

export async function GET(request) {
    try {
        // Get query parameters from request
        const { searchParams } = new URL(request.url);

        // Build query string - forward all parameters
        const queryString = searchParams.toString();

        // Build backend URLs - try primary endpoint first, then fallback
        // Media search service routes: /api/v1/search (primary) or /search (fallback)
        const primaryUrl = `${BACKEND_URL}/api/v1/search${queryString ? `?${queryString}` : ''}`;
        const fallbackUrl = `${BACKEND_URL}/search${queryString ? `?${queryString}` : ''}`;

        console.log(`[Search Proxy] Trying primary endpoint: ${primaryUrl}`);

        // Try primary endpoint first
        let response = await fetchWithTimeout(primaryUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-store', // Always fetch fresh data
        });

        // If primary endpoint fails with 502/503/504, try fallback URL
        if (response.status >= 502 && response.status <= 504) {
            console.log(`[Search Proxy] Primary endpoint failed (${response.status}), trying fallback URL: ${fallbackUrl}`);
            try {
                response = await fetchWithTimeout(fallbackUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                    cache: 'no-store',
                });
                // If fallback URL also fails, we'll handle it in the error handling below
            } catch (fallbackError) {
                console.log(`[Search Proxy] Fallback URL also failed, using property service fallback`);
                // Use property service fallback
                try {
                    const fallbackResults = await fallbackSearch(searchParams);
                    return NextResponse.json(fallbackResults, {
                        status: 200,
                        headers: {
                            'Cache-Control': 'no-store, no-cache, must-revalidate',
                            'X-Fallback-Search': 'true'
                        },
                    });
                } catch (propertyFallbackError) {
                    console.error('[Search Proxy] Property service fallback also failed:', propertyFallbackError);
                    // Continue with original error handling
                }
            }
        }

        // Handle 502 Bad Gateway and other 5xx errors - use fallback
        if (response.status >= 500) {
            console.log(`[Search Proxy] Backend error ${response.status}, using fallback search`);
            try {
                const fallbackResults = await fallbackSearch(searchParams);
                return NextResponse.json(fallbackResults, {
                    status: 200,
                    headers: {
                        'Cache-Control': 'no-store, no-cache, must-revalidate',
                        'X-Fallback-Search': 'true'
                    },
                });
            } catch (fallbackError) {
                console.error('[Search Proxy] Fallback also failed:', fallbackError);
                return NextResponse.json(
                    {
                        error: 'Search service unavailable',
                        message: response.status === 502
                            ? 'Backend service is not responding. Please check if the media-search-service is running.'
                            : `Backend returned error ${response.status}`,
                        code: response.status === 502 ? 'BAD_GATEWAY' : 'SERVER_ERROR',
                        properties: [],
                        pagination: { total: 0, page: 1, limit: 20, pages: 0 }
                    },
                    { status: 503 } // Service Unavailable
                );
            }
        }

        // Handle 4xx client errors - use fallback for 404, return error for others
        if (response.status >= 400) {
            const contentType = response.headers.get('content-type') || '';
            const text = await response.text();
            let errorData;

            // Check if response is HTML (nginx error page) or 404 - use fallback
            if (response.status === 404 || contentType.includes('text/html') || text.trim().startsWith('<html')) {
                console.log(`[Search Proxy] Endpoint not found (${response.status}), using fallback search`);
                try {
                    const fallbackResults = await fallbackSearch(searchParams);
                    return NextResponse.json(fallbackResults, {
                        status: 200,
                        headers: {
                            'Cache-Control': 'no-store, no-cache, must-revalidate',
                            'X-Fallback-Search': 'true'
                        },
                    });
                } catch (fallbackError) {
                    console.error('[Search Proxy] Fallback also failed:', fallbackError);
                    errorData = {
                        error: 'Endpoint not found',
                        message: 'The search endpoint is not available. The backend service may not be running or the route is misconfigured.'
                    };
                }
            } else {
                // Try to parse as JSON
                try {
                    errorData = JSON.parse(text);
                } catch (e) {
                    errorData = {
                        error: 'Client error',
                        message: text || `HTTP ${response.status} error`
                    };
                }
            }

            return NextResponse.json(
                {
                    ...errorData,
                    properties: [],
                    pagination: { total: 0, page: 1, limit: 20, pages: 0 }
                },
                { status: response.status === 404 ? 503 : response.status } // Return 503 for 404 to indicate service unavailable
            );
        }

        // Get response data for successful responses
        const contentType = response.headers.get('content-type');
        let responseData;

        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            const text = await response.text();
            try {
                responseData = JSON.parse(text);
            } catch (e) {
                console.error('[Search Proxy] Failed to parse response:', text.substring(0, 200));
                return NextResponse.json(
                    {
                        error: 'Invalid response format',
                        message: 'Backend returned non-JSON response',
                        properties: [],
                        pagination: { total: 0, page: 1, limit: 20, pages: 0 }
                    },
                    { status: 502 }
                );
            }
        }

        // Ensure response has expected structure
        if (!responseData.properties && !responseData.hits) {
            responseData.properties = [];
        }
        if (!responseData.pagination) {
            responseData.pagination = {
                total: responseData.total || 0,
                page: parseInt(searchParams.get('page')) || 1,
                limit: parseInt(searchParams.get('limit')) || 20,
                pages: Math.ceil((responseData.total || 0) / (parseInt(searchParams.get('limit')) || 20))
            };
        }

        // If Elasticsearch returns empty results and no fallback was indicated, try fallback search
        const totalResults = responseData.pagination?.total || responseData.total || 0;
        const hasResults = (responseData.properties?.length || responseData.hits?.length || 0) > 0;
        const isFallback = responseData.fallback === true;
        
        // If no results and no fallback flag, try property service fallback
        if (totalResults === 0 && !hasResults && !isFallback) {
            const hasSearchQuery = searchParams.get('q') || searchParams.get('locationSearch');
            const hasFilters = Array.from(searchParams.keys()).some(key => 
                !['q', 'locationSearch', 'page', 'limit', 'status'].includes(key)
            );
            
            // Only fallback if there are filters or search query (not just empty initial load)
            if (hasSearchQuery || hasFilters) {
                console.log('[Search Proxy] Empty Elasticsearch results, trying property service fallback');
                try {
                    const fallbackResults = await fallbackSearch(searchParams);
                    // Only use fallback if it has results
                    if (fallbackResults.properties?.length > 0 || fallbackResults.total > 0) {
                        return NextResponse.json(fallbackResults, {
                            status: 200,
                            headers: {
                                'Cache-Control': 'no-store, no-cache, must-revalidate',
                                'X-Fallback-Search': 'true'
                            },
                        });
                    }
                } catch (fallbackError) {
                    console.error('[Search Proxy] Fallback search failed:', fallbackError);
                    // Continue with empty Elasticsearch results
                }
            }
        }

        // Return response with proper headers
        return NextResponse.json(responseData, {
            status: response.status,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    } catch (error) {
        console.error('[Search Proxy] Error:', error.message, error.stack);

        // Try fallback search if connection fails
        if (error.message.includes('ECONNREFUSED') || 
            error.message.includes('ENOTFOUND') || 
            error.message.includes('timeout') ||
            error.message.includes('Failed to fetch')) {
            console.log('[Search Proxy] Connection error, trying fallback search');
            try {
                const { searchParams } = new URL(request.url);
                const fallbackResults = await fallbackSearch(searchParams);
                return NextResponse.json(fallbackResults, {
                    status: 200,
                    headers: {
                        'Cache-Control': 'no-store, no-cache, must-revalidate',
                        'X-Fallback-Search': 'true'
                    },
                });
            } catch (fallbackError) {
                console.error('[Search Proxy] Fallback also failed:', fallbackError);
            }
        }

        // Handle specific error types
        let errorMessage = error.message || 'Search request failed';
        let statusCode = 500;

        if (error.message.includes('timeout')) {
            errorMessage = 'Request timeout: Backend service did not respond in time';
            statusCode = 504; // Gateway Timeout
        } else if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
            errorMessage = 'Cannot connect to backend service. Please check if the service is running.';
            statusCode = 503; // Service Unavailable
        }

        return NextResponse.json(
            {
                error: 'Search request failed',
                message: errorMessage,
                code: statusCode === 504 ? 'TIMEOUT' : statusCode === 503 ? 'SERVICE_UNAVAILABLE' : 'INTERNAL_ERROR',
                properties: [],
                pagination: { total: 0, page: 1, limit: 20, pages: 0 }
            },
            { status: statusCode }
        );
    }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

