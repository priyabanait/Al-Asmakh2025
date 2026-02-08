import axios from 'axios';
import { ELASTICSEARCH_API_BASE_URL } from '@/config/api';

/**
 * Elasticsearch API Configuration
 * Points to the media-search-service running on port 3003
 */
const ELASTICSEARCH_API_URL = ELASTICSEARCH_API_BASE_URL;

/**
 * Check if Elasticsearch service is available
 * @returns {Promise<boolean>} True if service is available
 */
export const checkElasticsearchHealth = async () => {
  try {
    const response = await axios.get(`${ELASTICSEARCH_API_URL}/health`, {
      timeout: 2000,
    });
    return response.data?.services?.elasticsearch === 'connected';
  } catch (error) {
    console.warn('Elasticsearch service not available:', error.message);
    return false;
  }
};

/**
 * Search properties using Elasticsearch
 * Supports comprehensive search and filtering
 * 
 * @param {Object} filters - Search filters
 * @param {string} filters.q - Text search query
 * @param {string} filters.locationSearch - Location search text
 * @param {string} filters.locationLevel1 - Location level 1 (e.g., "Doha")
 * @param {string} filters.locationLevel2 - Location level 2 (e.g., "West Bay")
 * @param {string} filters.locationLevel3 - Location level 3
 * @param {string|Array} filters.type - Property type(s) (e.g., "apartment", "villa")
 * @param {string} filters.category - Property category (e.g., "residential", "commercial")
 * @param {string} filters.sizeRange - Size range (e.g., "1000-2000")
 * @param {number} filters.minSize - Minimum size
 * @param {number} filters.maxSize - Maximum size
 * @param {string} filters.agentId - Agent ID
 * @param {string} filters.agentName - Agent name
 * @param {string} filters.projectId - Project ID
 * @param {string} filters.projectName - Project name
 * @param {Array|string} filters.bedrooms - Bedrooms (array or single value)
 * @param {Array|string} filters.bathrooms - Bathrooms (array or single value)
 * @param {number} filters.minPrice - Minimum price
 * @param {number} filters.maxPrice - Maximum price
 * @param {string} filters.priceType - Price type ("rent" or "sale")
 * @param {Array|string} filters.amenities - Amenities array
 * @param {string} filters.status - Property status (default: "published")
 * @param {number} filters.page - Page number (default: 1)
 * @param {number} filters.limit - Items per page (default: 20)
 * @param {string} filters.sort - Sort field
 * @returns {Promise<Object>} Search results with properties and pagination
 */
export const searchPropertiesWithElasticsearch = async (filters = {}) => {
  try {
    const {
      q,
      locationSearch,
      locationLevel1,
      locationLevel2,
      locationLevel3,
      type,
      propertyType,
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
      limit = 50,
      sort,
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

    // Property type filter (support both 'type' and 'propertyType')
    const propertyTypeValue = type || propertyType;
    if (propertyTypeValue) {
      if (Array.isArray(propertyTypeValue)) {
        propertyTypeValue.forEach(t => queryParams.append('type', t));
      } else {
        queryParams.append('type', propertyTypeValue);
      }
    }

    // Category
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
    if (bedrooms !== undefined && bedrooms !== null && bedrooms !== '') {
      if (Array.isArray(bedrooms)) {
        bedrooms.forEach(b => queryParams.append('bedrooms', b));
      } else {
        queryParams.append('bedrooms', bedrooms);
      }
    }

    // Bathrooms filter
    if (bathrooms !== undefined && bathrooms !== null && bathrooms !== '') {
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
        // Join array with comma for Elasticsearch API
        queryParams.append('amenities', amenities.join(','));
      } else {
        queryParams.append('amenities', amenities);
      }
    }

    // Status
    if (status) queryParams.append('status', status);

    // Pagination
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    // Sort
    if (sort) queryParams.append('sort', sort);

    // Call Elasticsearch API
    const response = await axios.get(`${ELASTICSEARCH_API_URL}/search?${queryParams.toString()}`, {
      timeout: 10000, // 10 second timeout
    });

    if (response.data) {
      // Handle nested structure: properties array with {property: {...}} objects
      let propertiesList = response.data.properties || [];
      if (propertiesList.length > 0 && propertiesList[0].property) {
        propertiesList = propertiesList.map(item => item.property || item);
      }

      return {
        properties: propertiesList,
        pagination: response.data.pagination || {
          total: response.data.total || 0,
          page: page,
          limit: limit,
          pages: Math.ceil((response.data.total || 0) / limit),
        },
        total: response.data.total || response.data.pagination?.total || 0,
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
    console.error('Elasticsearch search error:', error);
    // Return empty results instead of throwing to allow fallback
    return {
      properties: [],
      pagination: {
        total: 0,
        page: filters.page || 1,
        limit: filters.limit || 50,
        pages: 0,
      },
      total: 0,
      error: error.response?.data?.message || error.message || 'Elasticsearch search failed',
    };
  }
};

/**
 * Index a property in Elasticsearch
 * @param {Object} property - Property object to index
 * @returns {Promise<Object>} Indexing result
 */
export const indexPropertyInElasticsearch = async (property) => {
  try {
    const response = await axios.post(`${ELASTICSEARCH_API_URL}/index/property`, property, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('Elasticsearch indexing error:', error);
    throw {
      message: error.response?.data?.message || error.message || 'Indexing failed',
      status: error.response?.status,
      data: error.response?.data,
    };
  }
};
