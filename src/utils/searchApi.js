import axios from 'axios';
import { getSearchApiUrl } from '@/config/api';

/**
 * Search properties using Elasticsearch with comprehensive filters
 * Supports all filters from MoreFiltersModal component
 * 
 * @param {Object} filters - Search filters
 * @param {string} filters.q - Text search query
 * @param {string} filters.locationSearch - Location search text
 * @param {string} filters.locationLevel1 - Location level 1
 * @param {string} filters.locationLevel2 - Location level 2
 * @param {string} filters.locationLevel3 - Location level 3
 * @param {string|Array} filters.type - Property type(s)
 * @param {string} filters.category - Property category
 * @param {string} filters.sizeRange - Size range (e.g., "0 - 500 sqft")
 * @param {number} filters.minSize - Minimum size
 * @param {number} filters.maxSize - Maximum size
 * @param {string} filters.agentId - Agent ID
 * @param {string} filters.agentName - Agent name
 * @param {string} filters.projectId - Project ID
 * @param {string} filters.projectName - Project name
 * @param {Array|string} filters.bedrooms - Bedrooms (array or single)
 * @param {Array|string} filters.bathrooms - Bathrooms (array or single)
 * @param {number} filters.minPrice - Minimum price
 * @param {number} filters.maxPrice - Maximum price
 * @param {string} filters.priceType - Price type (rent/sale)
 * @param {Array|string} filters.amenities - Amenities array
 * @param {string} filters.status - Property status
 * @param {number} filters.page - Page number
 * @param {number} filters.limit - Items per page
 * @returns {Promise<Object>} Search results with properties and pagination
 */
export const searchProperties = async (filters = {}) => {
    try {
        const {
            q,
            locationSearch,
            locationLevel1,
            locationLevel2,
            locationLevel3,
            type,
            category,
            sizeRange,
            minSize,
            maxSize,
            agentId,
            agentName,
            projectId,
            projectName,
            bedrooms,
            bathrooms,
            minPrice,
            maxPrice,
            priceType,
            amenities,
            status = 'published',
            page = 1,
            limit = 20,
        } = filters;

        // Build query parameters
        const queryParams = new URLSearchParams();

        // Text search
        if (q) queryParams.append('q', q);
        if (locationSearch) queryParams.append('locationSearch', locationSearch);

        // Location filters
        if (locationLevel1) queryParams.append('locationLevel1', locationLevel1);
        if (locationLevel2) queryParams.append('locationLevel2', locationLevel2);
        if (locationLevel3) queryParams.append('locationLevel3', locationLevel3);

        // Property filters
        if (type) {
            if (Array.isArray(type)) {
                type.forEach(t => queryParams.append('type', t));
            } else {
                queryParams.append('type', type);
            }
        }
        if (category) queryParams.append('category', category);

        // Size filters
        if (sizeRange) queryParams.append('sizeRange', sizeRange);
        if (minSize) queryParams.append('minSize', minSize.toString());
        if (maxSize) queryParams.append('maxSize', maxSize.toString());

        // Agent filter
        if (agentId) queryParams.append('agentId', agentId);
        if (agentName) queryParams.append('agentName', agentName);

        // Project filter
        if (projectId) queryParams.append('projectId', projectId);
        if (projectName) queryParams.append('projectName', projectName);

        // Bedrooms filter
        if (bedrooms) {
            if (Array.isArray(bedrooms)) {
                bedrooms.forEach(b => queryParams.append('bedrooms', b));
            } else {
                queryParams.append('bedrooms', bedrooms);
            }
        }

        // Bathrooms filter
        if (bathrooms) {
            if (Array.isArray(bathrooms)) {
                bathrooms.forEach(b => queryParams.append('bathrooms', b));
            } else {
                queryParams.append('bathrooms', bathrooms);
            }
        }

        // Price filters
        if (minPrice) queryParams.append('minPrice', minPrice.toString());
        if (maxPrice) queryParams.append('maxPrice', maxPrice.toString());
        if (priceType) queryParams.append('priceType', priceType);

        // Amenities filter
        if (amenities) {
            if (Array.isArray(amenities)) {
                queryParams.append('amenities', JSON.stringify(amenities));
            } else {
                queryParams.append('amenities', amenities);
            }
        }

        // Status
        if (status) queryParams.append('status', status);

        // Pagination
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());

        // Call API directly
        const response = await axios.get(`${getSearchApiUrl('api/v1/properties/search')}?${queryParams.toString()}`);

        if (response.data) {
            return {
                properties: response.data.properties || response.data.hits || [],
                pagination: response.data.pagination || {
                    total: response.data.total || 0,
                    page: page,
                    limit: limit,
                    pages: Math.ceil((response.data.total || 0) / limit),
                },
                total: response.data.total || 0,
            };
        } else {
            return {
                properties: [],
                pagination: {
                    total: 0,
                    page: page,
                    limit: limit,
                    pages: 0,
                },
                total: 0,
            };
        }
    } catch (error) {
        console.error('Search properties error:', error);
        throw {
            message: error.response?.data?.message || error.message || 'Search failed',
            status: error.response?.status,
            data: error.response?.data,
        };
    }
};

/**
 * Helper function to convert MoreFiltersModal state to search filters
 * @param {Object} modalState - State from MoreFiltersModal component
 * @returns {Object} Search filters object
 */
export const convertModalFiltersToSearchParams = (modalState) => {
    const {
        locationSearch,
        selectedBedrooms,
        selectedBathrooms,
        selectedSize,
        selectedAgent,
        selectedProject,
        minPrice,
        maxPrice,
        selectedAmenities = [],
        selectedPropertyType,
        selectedCategory,
        priceType,
    } = modalState;

    const filters = {};

    // Location
    if (locationSearch) {
        filters.locationSearch = locationSearch;
    }

    // Property Type - Map UI values to database values (lowercase)
    if (selectedPropertyType) {
        // Map UI capitalized values to database lowercase values
        const typeMap = {
            "Apartment": "apartment",
            "Villa": "villa",
            "Penthouse": "luxury",  // Penthouse maps to luxury in database
            "Townhouse": "townhouse",
            "Commercial": "commercial",
            "Office": "office"
        };

        // Use mapped value or convert to lowercase
        filters.type = typeMap[selectedPropertyType] || selectedPropertyType.toLowerCase();
    }

    // Category
    if (selectedCategory) {
        filters.category = selectedCategory;
    }

    // Size Range
    if (selectedSize) {
        filters.sizeRange = selectedSize;
    }

    // Agent
    if (selectedAgent) {
        // Try to extract agentId if it's an object, otherwise use as name
        if (typeof selectedAgent === 'object' && selectedAgent.id) {
            filters.agentId = selectedAgent.id;
        } else {
            filters.agentName = selectedAgent;
        }
    }

    // Project
    if (selectedProject) {
        // Try to extract projectId if it's an object, otherwise use as name
        if (typeof selectedProject === 'object' && selectedProject.id) {
            filters.projectId = selectedProject.id;
        } else {
            filters.projectName = selectedProject;
        }
    }

    // Bedrooms - Convert "Studio" to "studio" (lowercase for database)
    if (selectedBedrooms && selectedBedrooms.length > 0) {
        filters.bedrooms = selectedBedrooms.map(bed => {
            if (bed === "Studio") return "studio";  // Convert to lowercase
            return bed;
        });
    }

    // Bathrooms
    if (selectedBathrooms && selectedBathrooms.length > 0) {
        filters.bathrooms = selectedBathrooms;
    }

    // Price Range
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;

    // Price Type
    if (priceType) filters.priceType = priceType;

    // Amenities
    if (selectedAmenities && selectedAmenities.length > 0) {
        filters.amenities = selectedAmenities;
    }

    return filters;
};

