import axios from 'axios';
import { getSearchApiUrl, ELASTICSEARCH_API_BASE_URL } from '@/config/api';
import { searchPropertiesWithElasticsearch, checkElasticsearchHealth } from './elasticsearchApi';

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
        // Try Elasticsearch first if available
        const isElasticsearchAvailable = await checkElasticsearchHealth();
        
        if (isElasticsearchAvailable) {
            try {
                const result = await searchPropertiesWithElasticsearch(filters);
                if (!result.error) {
                    return result;
                }
            } catch (esError) {
                console.warn('Elasticsearch search failed, trying fallback:', esError.message);
            }
        }

        // Fallback to property service API (if endpoint exists)
        // For now, if Elasticsearch is not available, return empty results
        // or you can implement a direct database query fallback here
        console.warn('Elasticsearch not available, returning empty results. Please ensure Elasticsearch is running.');
        return {
            properties: [],
            pagination: {
                total: 0,
                page: filters.page || 1,
                limit: filters.limit || 20,
                pages: 0,
            },
            total: 0,
        };
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

