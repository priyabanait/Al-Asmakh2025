import axios from "axios";

// Production URLs - AKS LoadBalancer IP: 40.81.255.90
// Services are accessed through nginx on port 80
// Use Next.js API proxy to avoid mixed content issues (HTTPS frontend -> HTTP backend)
const PRODUCTION_BASE_URL = "http://40.81.255.90";

// Local development URL - NGINX gateway on port 8080
// const PRODUCTION_BASE_URL = "http://localhost:3002";

// Helper function to get API base URL (called at runtime to detect HTTPS)
const getApiBaseUrl = () => {
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
        // On HTTPS (Vercel) - use proxy to avoid mixed content
        return `${window.location.origin}/api/proxy/api/v1`;
    }
    // On HTTP (local dev) - use direct backend
    return `${PRODUCTION_BASE_URL}/api/v1`;
};

// Helper function to get Auth base URL
const getAuthBaseUrl = () => {
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
        // On HTTPS (Vercel) - use proxy
        return `${window.location.origin}/api/proxy`;
    }
    // On HTTP (local dev) - use direct backend
    return PRODUCTION_BASE_URL;
};

// These will be set at runtime when functions are called
let API_BASE_URL = `${PRODUCTION_BASE_URL}/api/v1`;
let AUTH_API_BASE_URL = PRODUCTION_BASE_URL;

/**
 * Format property data for PropertyListView component
 * @param {Object} property - Raw property object from API
 * @returns {Object} Formatted property object
 */
export const formatProperty = (property) => {
    // Get first image URL
    let imageUrl = "/div.property-thumbnail-wrapper.png";
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
        imageUrl = property.images[0].url || property.images[0].thumbnailUrl || imageUrl;
    }

    // Format location
    let location = "Location not specified";
    if (property.locationLevel1) {
        location = property.locationLevel1;
        if (property.locationLevel2) location += `, ${property.locationLevel2}`;
        if (property.locationLevel3) location += `, ${property.locationLevel3}`;
    } else if (property.address) {
        location = property.address;
    }

    // Format price
    let price = "Price on request";
    if (property.priceAmount) {
        price = property.priceAmount.toLocaleString();
    }

    return {
        id: property.id,
        title: property.titleEn || property.title || "Property",
        location: location,
        bedrooms: property.bedrooms || property.beds || 0,
        bathrooms: property.bathrooms || property.baths || 0,
        area: property.size || property.area || 0,
        price: price,
        image: imageUrl,
    };
};

/**
 * Fetch properties from backend API
 * @param {Object} params - Query parameters
 * @param {string} params.priceType - "rent" or "sale"
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 50)
 * @param {string} params.status - Property status (default: "published")
 * @param {string} params.type - Property type filter
 * @param {string} params.category - Property category filter
 * @param {string} params.locationLevel1 - Location level 1 filter
 * @param {string} params.locationLevel2 - Location level 2 filter
 * @param {string} params.locationLevel3 - Location level 3 filter
 * @param {string} params.bedrooms - Number of bedrooms filter
 * @param {string} params.bathrooms - Number of bathrooms filter
 * @param {string} params.minPrice - Minimum price filter
 * @param {string} params.maxPrice - Maximum price filter
 * @returns {Promise<Object>} Object containing properties array and pagination info
 */
export const fetchProperties = async (params = {}) => {
    // Update URLs at runtime to handle HTTPS proxy
    API_BASE_URL = getApiBaseUrl();

    try {
        let {
            priceType = "rent",
            page = 1,
            limit = 50,
            status, // Optional - if not provided, backend will show all statuses
            type,
            category,
            locationLevel1,
            locationLevel2,
            locationLevel3,
            bedrooms,
            bathrooms,
            minPrice,
            maxPrice,
        } = params;

        // Normalize priceType: "lease" -> "rent" (backend uses "rent")
        if (priceType && priceType.toLowerCase() === "lease") {
            priceType = "rent";
        }

        // Build query parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            priceType: priceType,
        });

        // Only add status filter if explicitly provided
        if (status) {
            queryParams.append("status", status);
        }

        // Add optional filters
        if (type) queryParams.append("type", type);
        if (category) queryParams.append("category", category);
        if (locationLevel1) queryParams.append("locationLevel1", locationLevel1);
        if (locationLevel2) queryParams.append("locationLevel2", locationLevel2);
        if (locationLevel3) queryParams.append("locationLevel3", locationLevel3);
        if (bedrooms) queryParams.append("bedrooms", bedrooms);
        if (bathrooms) queryParams.append("bathrooms", bathrooms);
        if (minPrice) queryParams.append("minPrice", minPrice);
        if (maxPrice) queryParams.append("maxPrice", maxPrice);

        const response = await axios.get(`${API_BASE_URL}/properties?${queryParams.toString()}`);

        if (response.data) {
            const propertiesData = response.data.properties || [];
            const formattedProperties = propertiesData.map(formatProperty);

            return {
                properties: formattedProperties,
                totalProperties: response.data.pagination?.total || formattedProperties.length,
                pagination: response.data.pagination || {
                    total: formattedProperties.length,
                    page: page,
                    limit: limit,
                    pages: Math.ceil((response.data.pagination?.total || formattedProperties.length) / limit),
                },
            };
        } else {
            return {
                properties: [],
                totalProperties: 0,
                pagination: {
                    total: 0,
                    page: page,
                    limit: limit,
                    pages: 0,
                },
            };
        }
    } catch (error) {
        console.error("Error fetching properties:", error);
        throw {
            message: error.response?.data?.message || error.message || "Failed to load properties",
            status: error.response?.status,
            data: error.response?.data,
        };
    }
};

/**
 * Fetch properties by offering type (Lease, Rent, Sale, Marketing)
 * Maps offeringType to priceType and formats properties for Services components
 * @param {string} offeringType - Offering type: "lease", "rent", "sale", "marketing"
 * @param {Object} options - Additional options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 50)
 * @returns {Promise<Array>} Array of formatted property objects
 */
export const fetchPropertiesByOfferingType = async (offeringType, options = {}) => {
    // Update URLs at runtime to handle HTTPS proxy
    API_BASE_URL = getApiBaseUrl();

    // Normalize offeringType to priceType for API
    // Convert "lease" to "rent" (backend uses "rent", frontend may use "lease")
    const normalizedOfferingType = offeringType?.toLowerCase();
    const validPriceTypes = ["lease", "rent", "sale", "marketing"];

    // Normalize: "lease" -> "rent", otherwise use as-is if valid
    let priceType = "rent"; // default
    if (normalizedOfferingType && validPriceTypes.includes(normalizedOfferingType)) {
        priceType = normalizedOfferingType === "lease" ? "rent" : normalizedOfferingType;
    }

    console.log(offeringType, "offeringType -> priceType:", priceType);
    const {
        page = 1,
        limit = 50,
        type, // Property type: "commercial", "industrial", "residential"
        category, // Category: "luxury", "standard", "budget"
        luxury, // Luxury filter: "true" or "false"
        development, // Development filter: "true" or "false"
    } = options;

    try {
        // Build query parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            priceType: priceType,
        });

        // Add optional filters
        // Note: If category="luxury" is passed, we still pass luxury="true" to ensure
        // the backend luxury filter (which checks priceAmount >= 5000000 OR category = 'luxury' OR type = 'luxury')
        // works correctly. This ensures properties with high prices or luxury category/type are included.
        if (type) queryParams.append("type", type);
        if (category) queryParams.append("category", category);
        // Always pass luxury filter if category is luxury or luxury is explicitly set
        if (luxury || category === "luxury") {
            queryParams.append("luxury", luxury || "true");
        }
        if (development) queryParams.append("development", development);

        console.log("API Query Params:", queryParams.toString());

        // Fetch raw data from API
        const response = await axios.get(`${API_BASE_URL}/properties?${queryParams.toString()}`);

        console.log("API Response:", {
            totalProperties: response.data?.properties?.length || 0,
            pagination: response.data?.pagination,
            sampleProperty: response.data?.properties?.[0] ? {
                id: response.data.properties[0].id,
                titleEn: response.data.properties[0].titleEn,
                category: response.data.properties[0].category,
                type: response.data.properties[0].type,
                priceType: response.data.properties[0].priceType,
                priceAmount: response.data.properties[0].priceAmount,
            } : null
        });

        if (response.data && response.data.properties) {
            const propertiesData = response.data.properties || [];

            // Map raw API response to component format
            const mappedProperties = propertiesData.map((prop) => {
                // Format location from raw API data
                let location = "Location not specified";
                if (prop.locationLevel1) {
                    location = prop.locationLevel1;
                    if (prop.locationLevel2) location += `, ${prop.locationLevel2}`;
                    if (prop.locationLevel3) location += `, ${prop.locationLevel3}`;
                } else if (prop.address) {
                    location = prop.address;
                }

                // Format price from raw API data
                let price = "Price on request";
                if (prop.priceAmount) {
                    price = `QAR ${prop.priceAmount.toLocaleString()}`;
                }

                // Get image from raw API data
                let image = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
                if (prop.images && Array.isArray(prop.images) && prop.images.length > 0) {
                    image = prop.images[0].url || prop.images[0].thumbnailUrl || image;
                }

                // Get year from createdAt or use current year
                const year = prop.createdAt
                    ? new Date(prop.createdAt).getFullYear().toString()
                    : new Date().getFullYear().toString();

                // Determine status and statusType
                let status = "100% Completed";
                let statusType = "completed";

                if (prop.projectStatus) {
                    if (prop.projectStatus === "completed") {
                        status = "100% Completed";
                        statusType = "completed";
                    } else if (prop.projectStatus === "off_plan" || prop.projectStatus === "ongoing") {
                        status = "30% Ongoing";
                        statusType = "ongoing";
                    }
                }

                return {
                    id: prop.id || prop._id,
                    title: prop.titleEn || prop.title || "Untitled Property",
                    location: location,
                    year: year,
                    units: prop.bedrooms || prop.units || "N/A",
                    status: status,
                    statusType: statusType,
                    price: price,
                    image: image,
                };
            });

            return mappedProperties;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching properties by offering type:", error);
        throw {
            message: error.response?.data?.message || error.message || "Failed to load properties",
            status: error.response?.status,
            data: error.response?.data,
        };
    }
};

/**
 * Fetch a single property by ID
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>} Property object with agent info
 */
export const fetchPropertyById = async (propertyId) => {
    // Update URLs at runtime to handle HTTPS proxy
    API_BASE_URL = getApiBaseUrl();

    try {
        const response = await axios.get(`${API_BASE_URL}/properties/${propertyId}`);

        if (response.data) {
            const propertyData = response.data.property || response.data;
            const agentData = response.data.agent || propertyData.agent;

            // Attach agent to property object for easier access
            if (agentData) {
                propertyData.agent = agentData;
            }

            return propertyData;
        } else {
            throw new Error("Property not found");
        }
    } catch (error) {
        console.error("Error fetching property:", error);
        throw {
            message: error.response?.data?.message || error.message || "Failed to load property",
            status: error.response?.status,
            data: error.response?.data,
        };
    }
};

/**
 * Format agent data for Contact component
 * @param {Object} agent - Raw agent object from API
 * @returns {Object} Formatted agent object
 */
export const formatAgent = (agent) => {
    const agentName = `${agent.firstName || ''} ${agent.lastName || ''}`.trim() ||
        agent.userId?.firstName && agent.userId?.lastName
        ? `${agent.userId.firstName} ${agent.userId.lastName}`.trim()
        : agent.email || agent.userId?.email || 'Agent';

    // Get specialties
    const specialties = agent.specialties && Array.isArray(agent.specialties) && agent.specialties.length > 0
        ? agent.specialties.join(", ")
        : "General Property Specialist";

    // Get languages
    const languages = agent.languages && Array.isArray(agent.languages) && agent.languages.length > 0
        ? agent.languages.join(", ")
        : "English";

    // Get profile picture
    const profilePicture = agent.profilePicture ||
        agent.publicProfile?.imageVariants?.medium?.default ||
        agent.publicProfile?.imageVariants?.large?.default ||
        "/div.png";

    // Get title/position
    const title = agent.publicProfile?.position?.primary ||
        agent.publicProfile?.position?.secondary ||
        "Property Agent";

    // Get phone
    const phone = agent.phone ||
        agent.mobile ||
        agent.publicProfile?.phone ||
        agent.userId?.phone ||
        null;

    // Get email
    const email = agent.email ||
        agent.userId?.email ||
        null;

    return {
        id: agent._id || agent.id,
        name: agentName,
        title: title,
        properties: agent.propertiesCount || agent.totalProperties || 0,
        clients: agent.clientsCount || agent.totalClients || 0,
        specialties: specialties,
        languages: languages,
        image: profilePicture,
        phone: phone,
        email: email,
        location: agent.location ?
            `${agent.location.city || ''}${agent.location.district ? `, ${agent.location.district}` : ''}`.trim() ||
            agent.location.address ||
            'Location not specified'
            : 'Location not specified',
    };
};

/**
 * Fetch agents from backend API
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 50)
 * @param {string} params.status - Agent status filter (default: "active")
 * @returns {Promise<Object>} Object containing agents array and pagination info
 */
export const fetchAgents = async (params = {}) => {
    // Update URLs at runtime to handle HTTPS proxy
    AUTH_API_BASE_URL = getAuthBaseUrl();

    try {
        const {
            page = 1,
            limit = 50,
            status = "active",
        } = params;

        // Build query parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        // Only add status filter if explicitly provided
        if (status) {
            queryParams.append("status", status);
        }

        // Fetch from public agents endpoint
        const response = await axios.get(`${AUTH_API_BASE_URL}/users/agents?${queryParams.toString()}`);

        if (response.data) {
            const agentsData = response.data.agents || [];
            const formattedAgents = agentsData.map(formatAgent);

            return {
                agents: formattedAgents,
                totalAgents: response.data.pagination?.total || formattedAgents.length,
                pagination: response.data.pagination || {
                    total: formattedAgents.length,
                    page: page,
                    limit: limit,
                    pages: Math.ceil((response.data.pagination?.total || formattedAgents.length) / limit),
                },
            };
        } else {
            return {
                agents: [],
                totalAgents: 0,
                pagination: {
                    total: 0,
                    page: page,
                    limit: limit,
                    pages: 0,
                },
            };
        }
    } catch (error) {
        console.error("Error fetching agents:", error);
        // If auth is required, return empty array instead of throwing
        // This allows the component to still render with fallback data
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.warn("Agents endpoint requires authentication. Returning empty array.");
            return {
                agents: [],
                totalAgents: 0,
                pagination: {
                    total: 0,
                    page: params.page || 1,
                    limit: params.limit || 50,
                    pages: 0,
                },
            };
        }
        throw {
            message: error.response?.data?.message || error.message || "Failed to load agents",
            status: error.response?.status,
            data: error.response?.data,
        };
    }
};

