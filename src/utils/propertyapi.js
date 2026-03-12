import axios from "axios";
import { getApiUrl } from "@/config/api";
import { FALLBACK_PROPERTY_IMAGE, getSafeImage } from "@/utils/imageUtils";

// Use dummy data only if explicitly enabled via environment variable or when API fails
// Set NEXT_PUBLIC_USE_DUMMY_DATA=true in .env.local to enable manual data injection for testing
const USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true' || false;

// API Base URL - Direct API calls (no proxy)
const API_BASE_URL = getApiUrl('api/v1/properties');

// Dummy property data for testing when Azure subscription is unavailable


// All API calls use Next.js proxy - no direct backend calls
// This prevents ERR_NETWORK errors from mixed content (HTTPS -> HTTP)
// The proxy runs server-side, so no CORS or mixed content issues

/**
 * Format property data for PropertyListView component
 * @param {Object} property - Raw property object from API
 * @returns {Object} Formatted property object
 */
export const formatProperty = (property) => {
    // Get first image URL with safe fallback
    let imageUrl = FALLBACK_PROPERTY_IMAGE;
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
        imageUrl = getSafeImage(property.images[0].url || property.images[0].thumbnailUrl);
    }

    // Format location - only use locationLevel2 and locationLevel3, exclude locationLevel1
    let location = "Location not specified";
    if (property.locationLevel2 && property.locationLevel2.trim() !== "") {
        location = property.locationLevel2.trim();
        if (property.locationLevel3 && property.locationLevel3.trim() !== "") {
            location += `, ${property.locationLevel3.trim()}`;
        }
    } else if (property.address && property.address.trim() !== "") {
        location = property.address.trim();
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
        locationLevel2: property.locationLevel2,
        locationLevel3: property.locationLevel3,
        bedrooms: property.bedrooms || property.beds || 0,
        bathrooms: property.bathrooms || property.baths || 0,
        area: property.size || property.area || 0,
        price: price,
        image: imageUrl,
        // Preserve priceType so list views can show RENT / SALE / MARKETING correctly
        priceType: property.priceType,
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
    // If using dummy data, return it immediately
    if (USE_DUMMY_DATA) {
        let {
            priceType = "rent",
            page = 1,
            limit = 50,
            status,
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

        // Normalize priceType: "lease" -> "rent"
        if (priceType && priceType.toLowerCase() === "lease") {
            priceType = "rent";
        }

        // Filter dummy properties based on params
        let filteredProperties = [...DUMMY_PROPERTIES];

        // Filter by priceType
        if (priceType) {
            filteredProperties = filteredProperties.filter(p =>
                p.priceType?.toLowerCase() === priceType.toLowerCase()
            );
        }

        // Filter by status
        if (status) {
            filteredProperties = filteredProperties.filter(p => p.status === status);
        }

        // Filter by type
        if (type) {
            filteredProperties = filteredProperties.filter(p => p.type === type);
        }

        // Filter by category
        if (category) {
            filteredProperties = filteredProperties.filter(p => p.category === category);
        }

        // Filter by location
        if (locationLevel1) {
            filteredProperties = filteredProperties.filter(p =>
                p.locationLevel1?.toLowerCase().includes(locationLevel1.toLowerCase())
            );
        }

        // Filter by bedrooms
        if (bedrooms) {
            filteredProperties = filteredProperties.filter(p => p.bedrooms >= parseInt(bedrooms));
        }

        // Filter by bathrooms
        if (bathrooms) {
            filteredProperties = filteredProperties.filter(p => p.bathrooms >= parseInt(bathrooms));
        }

        // Filter by price range
        if (minPrice) {
            filteredProperties = filteredProperties.filter(p =>
                p.priceAmount >= parseInt(minPrice)
            );
        }
        if (maxPrice) {
            filteredProperties = filteredProperties.filter(p =>
                p.priceAmount <= parseInt(maxPrice)
            );
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
        const formattedProperties = paginatedProperties.map(formatProperty);

        return {
            properties: formattedProperties,
            totalProperties: filteredProperties.length,
            pagination: {
                total: filteredProperties.length,
                page: page,
                limit: limit,
                pages: Math.ceil(filteredProperties.length / limit),
            },
        };
    }

    // API call using Next.js proxy (always same-origin, no ERR_NETWORK)
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

        // Add status filter - default to "published" if not provided
        // This ensures only active/published properties are shown
        const statusFilter = status || "published";
        queryParams.append("status", statusFilter);

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
        if (params.projectId) queryParams.append("projectId", params.projectId);

        // Call API directly
        const response = await axios.get(`${API_BASE_URL}?${queryParams.toString()}`);

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
        console.error("Error fetching properties from API:", error);

        // Fallback to manual data if available (for testing when backend is down)
        // Check if manual data is stored in localStorage
        if (typeof window !== 'undefined') {
            try {
                const manualData = localStorage.getItem('manual_properties_data');
                if (manualData) {
                    console.log("Using manual data from localStorage as fallback");
                    const parsedData = JSON.parse(manualData);
                    const formattedProperties = (parsedData.properties || []).map(formatProperty);
                    return {
                        properties: formattedProperties,
                        totalProperties: parsedData.pagination?.total || formattedProperties.length,
                        pagination: parsedData.pagination || {
                            total: formattedProperties.length,
                            page: page,
                            limit: limit,
                            pages: Math.ceil((parsedData.pagination?.total || formattedProperties.length) / limit),
                        },
                    };
                }
            } catch (e) {
                console.error("Error parsing manual data:", e);
            }
        }

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
    // If using dummy data, return it immediately
    if (USE_DUMMY_DATA) {
        // Normalize offeringType to priceType
        const normalizedOfferingType = offeringType?.toLowerCase();
        const validPriceTypes = ["lease", "rent", "sale", "marketing"];

        let priceType = "rent"; // default
        if (normalizedOfferingType && validPriceTypes.includes(normalizedOfferingType)) {
            priceType = normalizedOfferingType === "lease" ? "rent" : normalizedOfferingType;
        }

        const {
            page = 1,
            limit = 50,
            type,
            category,
            luxury,
            development,
        } = options;

        // Filter dummy properties
        let filteredProperties = DUMMY_PROPERTIES.filter(p =>
            p.priceType?.toLowerCase() === priceType.toLowerCase()
        );

        // Apply additional filters
        if (type) {
            filteredProperties = filteredProperties.filter(p => p.type === type);
        }
        if (category) {
            filteredProperties = filteredProperties.filter(p => p.category === category);
        }
        if (luxury === "true" || category === "luxury") {
            filteredProperties = filteredProperties.filter(p =>
                p.priceAmount >= 5000000 || p.category === "luxury" || p.type === "luxury"
            );
        }

        // Map to component format
        const mappedProperties = filteredProperties.map((prop) => {
            // Format location - only use locationLevel2 and locationLevel3, exclude locationLevel1
            let location = "Location not specified";
            if (prop.locationLevel2 && String(prop.locationLevel2).trim() !== "") {
                location = String(prop.locationLevel2).trim();
                if (prop.locationLevel3 && String(prop.locationLevel3).trim() !== "") {
                    location += `, ${String(prop.locationLevel3).trim()}`;
                }
            } else if (prop.address && String(prop.address).trim() !== "") {
                location = String(prop.address).trim();
            }

            let price = "Price on request";
            if (prop.priceAmount) {
                price = `QAR ${prop.priceAmount.toLocaleString()}`;
            }

            let image = FALLBACK_PROPERTY_IMAGE;
            if (prop.images && Array.isArray(prop.images) && prop.images.length > 0) {
                image = getSafeImage(prop.images[0].url || prop.images[0].thumbnailUrl);
            }

            const year = prop.createdAt
                ? new Date(prop.createdAt).getFullYear().toString()
                : new Date().getFullYear().toString();

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
                locationLevel2: prop.locationLevel2,
                locationLevel3: prop.locationLevel3,
                year: year,
                units: prop.bedrooms || prop.units || "N/A",
                status: status,
                statusType: statusType,
                price: price,
                image: image,
                // Preserve exposure type so listing pages can filter (e.g. "premium")
                exposureType: prop.exposureType,
            };
        });

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return mappedProperties.slice(startIndex, endIndex);
    }

    // API call using Next.js proxy (always same-origin, no ERR_NETWORK)
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

        // Call API directly
        const response = await axios.get(`${API_BASE_URL}?${queryParams.toString()}`);

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
                // Format location from raw API data - only use locationLevel2 and locationLevel3, exclude locationLevel1
                let location = "Location not specified";
                if (prop.locationLevel2 && prop.locationLevel2.trim() !== "") {
                    location = prop.locationLevel2.trim();
                    if (prop.locationLevel3 && prop.locationLevel3.trim() !== "") {
                        location += `, ${prop.locationLevel3.trim()}`;
                    }
                } else if (prop.address && prop.address.trim() !== "") {
                    location = prop.address.trim();
                }

                // Format price from raw API data
                let price = "Price on request";
                if (prop.priceAmount) {
                    price = `QAR ${prop.priceAmount.toLocaleString()}`;
                }

                // Get image from raw API data (with safe fallback)
                let image = FALLBACK_PROPERTY_IMAGE;
                if (prop.images && Array.isArray(prop.images) && prop.images.length > 0) {
                    image = getSafeImage(prop.images[0].url || prop.images[0].thumbnailUrl);
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
                    // Preserve raw property fields for proper formatting
                    bedrooms: prop.bedrooms,
                    bathrooms: prop.bathrooms,
                    size: prop.size,
                    area: prop.size || prop.area,
                    images: prop.images, // Preserve images array for formatProperty
                    priceAmount: prop.priceAmount,
                    priceCurrency: prop.priceCurrency,
                    priceFrequency: prop.priceFrequency,
                    locationLevel1: prop.locationLevel1,
                    locationLevel2: prop.locationLevel2,
                    locationLevel3: prop.locationLevel3,
                    // Preserve exposure type so listing pages can filter (e.g. "premium")
                    exposureType: prop.exposureType,
                };
            });

            return mappedProperties;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching properties by offering type from API:", error);

        // Fallback to manual data if available (for testing when backend is down)
        if (typeof window !== 'undefined') {
            try {
                const manualData = localStorage.getItem('manual_properties_data');
                if (manualData) {
                    console.log("Using manual data from localStorage as fallback");
                    const parsedData = JSON.parse(manualData);
                    const propertiesData = parsedData.properties || [];

                    // Filter by priceType
                    let filteredProperties = propertiesData.filter(p =>
                        p.priceType?.toLowerCase() === priceType.toLowerCase()
                    );

                    // Apply additional filters
                    if (type) filteredProperties = filteredProperties.filter(p => p.type === type);
                    if (category) filteredProperties = filteredProperties.filter(p => p.category === category);
                    if (luxury === "true" || category === "luxury") {
                        filteredProperties = filteredProperties.filter(p =>
                            p.priceAmount >= 5000000 || p.category === "luxury" || p.type === "luxury"
                        );
                    }

                    // Map to component format
                    const mappedProperties = filteredProperties.map((prop) => {
                        // Format location - only use locationLevel2 and locationLevel3, exclude locationLevel1
                        let location = "Location not specified";
                        if (prop.locationLevel2 && String(prop.locationLevel2).trim() !== "") {
                            location = String(prop.locationLevel2).trim();
                            if (prop.locationLevel3 && String(prop.locationLevel3).trim() !== "") {
                                location += `, ${String(prop.locationLevel3).trim()}`;
                            }
                        } else if (prop.address && String(prop.address).trim() !== "") {
                            location = String(prop.address).trim();
                        }

                        let price = "Price on request";
                        if (prop.priceAmount) {
                            price = `QAR ${prop.priceAmount.toLocaleString()}`;
                        }

                        let image = FALLBACK_PROPERTY_IMAGE;
                        if (prop.images && Array.isArray(prop.images) && prop.images.length > 0) {
                            image = getSafeImage(prop.images[0].url || prop.images[0].thumbnailUrl);
                        }

                        const year = prop.createdAt
                            ? new Date(prop.createdAt).getFullYear().toString()
                            : new Date().getFullYear().toString();

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

                    const startIndex = (page - 1) * limit;
                    const endIndex = startIndex + limit;
                    return mappedProperties.slice(startIndex, endIndex);
                }
            } catch (e) {
                console.error("Error parsing manual data:", e);
            }
        }

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
    // If using dummy data, return it immediately
    if (USE_DUMMY_DATA) {
        const property = DUMMY_PROPERTIES.find(p => p.id === propertyId || p.id === String(propertyId));

        if (property) {
            // Return a copy to avoid mutations
            return JSON.parse(JSON.stringify(property));
        } else {
            throw {
                message: "Property not found",
                status: 404,
            };
        }
    }

    // API call directly to backend
    try {
        const response = await axios.get(getApiUrl(`api/v1/properties/${propertyId}`));

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
    // API call using Next.js proxy (always same-origin, no ERR_NETWORK)
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

        // Call API directly
        const response = await axios.get(getApiUrl(`users/agents?${queryParams.toString()}`));

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

