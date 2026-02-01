import axios from "axios";
import { getApiUrl } from "@/config/api";

// Use dummy data only if explicitly enabled via environment variable or when API fails
// Set NEXT_PUBLIC_USE_DUMMY_DATA=true in .env.local to enable manual data injection for testing
const USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true' || false;

// API Base URL - Direct API calls (no proxy)
const API_BASE_URL = getApiUrl('api/v1/properties');

// Dummy property data for testing when Azure subscription is unavailable
const DUMMY_PROPERTIES = [
    {
        id: "1",
        titleEn: "Luxury 3 Bedroom Apartment in The Pearl",
        titleAr: "شقة فاخرة 3 غرف نوم في اللؤلؤة",
        descriptionEn: "Beautiful modern apartment with stunning sea views. Features include spacious living areas, modern kitchen, and premium finishes throughout. Located in the prestigious Pearl Qatar area with easy access to amenities.",
        descriptionAr: "شقة حديثة جميلة مع إطلالات بحرية خلابة",
        priceAmount: 15000,
        priceCurrency: "QAR",
        priceFrequency: "monthly",
        priceType: "rent",
        bedrooms: 3,
        bathrooms: 2,
        beds: 3,
        baths: 2,
        size: 180,
        area: 180,
        parkingSlots: 2,
        furnishingType: "Furnished",
        type: "apartment",
        category: "residential",
        status: "published",
        locationLevel1: "The Pearl",
        locationLevel2: "Doha",
        locationLevel3: "Qatar",
        address: "The Pearl Island, Doha, Qatar",
        reference: "PROP-001",
        age: 5,
        numberOfFloors: 15,
        unitNumber: "1503",
        amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Balcony"],
        images: [
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" },
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" },
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" }
        ],
        agent: {
            id: "agent-1",
            firstName: "Ahmed",
            lastName: "Al-Sulaiti",
            email: "ahmed.alsulaiti@alasmakh.com",
            phone: "+974 1234 5678",
            profilePicture: "/div.property-thumbnail-wrapper.png",
            location: {
                city: "Doha",
                district: "West Bay",
                address: "Doha, Qatar"
            }
        },
        createdAt: "2024-01-15T10:00:00Z"
    },
    {
        id: "2",
        titleEn: "Spacious 4 Bedroom Villa in West Bay",
        titleAr: "فيلا واسعة 4 غرف نوم في ويست باي",
        descriptionEn: "Elegant villa with private garden and pool. Perfect for families seeking luxury living in the heart of Doha. Features include maid's room, study, and covered parking for 3 cars.",
        descriptionAr: "فيلا أنيقة مع حديقة خاصة ومسبح",
        priceAmount: 25000,
        priceCurrency: "QAR",
        priceFrequency: "monthly",
        priceType: "rent",
        bedrooms: 4,
        bathrooms: 3,
        beds: 4,
        baths: 3,
        size: 350,
        area: 350,
        plotSize: 500,
        parkingSlots: 3,
        furnishingType: "Semi-Furnished",
        type: "villa",
        category: "residential",
        status: "published",
        locationLevel1: "West Bay",
        locationLevel2: "Doha",
        locationLevel3: "Qatar",
        address: "West Bay, Doha, Qatar",
        reference: "PROP-002",
        age: 8,
        numberOfFloors: 2,
        amenities: ["Private Pool", "Garden", "Maid's Room", "Study", "Parking"],
        images: [
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" },
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" },
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" },
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" }
        ],
        agent: {
            id: "agent-2",
            firstName: "Fatima",
            lastName: "Al-Thani",
            email: "fatima.althani@alasmakh.com",
            phone: "+974 2345 6789",
            profilePicture: "/div.property-thumbnail-wrapper.png",
            location: {
                city: "Doha",
                district: "West Bay",
                address: "Doha, Qatar"
            }
        },
        createdAt: "2024-02-20T10:00:00Z"
    },
    {
        id: "3",
        titleEn: "Modern 2 Bedroom Apartment in Lusail",
        titleAr: "شقة حديثة غرفتين نوم في لوسيل",
        descriptionEn: "Contemporary apartment in the new Lusail City. Features modern design, high-quality finishes, and access to world-class amenities. Perfect for professionals and small families.",
        descriptionAr: "شقة معاصرة في مدينة لوسيل الجديدة",
        priceAmount: 12000,
        priceCurrency: "QAR",
        priceFrequency: "monthly",
        priceType: "rent",
        bedrooms: 2,
        bathrooms: 2,
        beds: 2,
        baths: 2,
        size: 120,
        area: 120,
        parkingSlots: 1,
        furnishingType: "Unfurnished",
        type: "apartment",
        category: "residential",
        status: "published",
        locationLevel1: "Lusail",
        locationLevel2: "Doha",
        locationLevel3: "Qatar",
        address: "Lusail City, Doha, Qatar",
        reference: "PROP-003",
        age: 2,
        numberOfFloors: 20,
        unitNumber: "2005",
        amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Balcony", "Concierge"],
        images: [
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" },
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" }
        ],
        agent: {
            id: "agent-1",
            firstName: "Ahmed",
            lastName: "Al-Sulaiti",
            email: "ahmed.alsulaiti@alasmakh.com",
            phone: "+974 1234 5678",
            profilePicture: "/div.property-thumbnail-wrapper.png",
            location: {
                city: "Doha",
                district: "Lusail",
                address: "Doha, Qatar"
            }
        },
        createdAt: "2024-03-10T10:00:00Z"
    },
    {
        id: "4",
        titleEn: "Premium 5 Bedroom Villa in Al Waab",
        titleAr: "فيلا متميزة 5 غرف نوم في الوعب",
        descriptionEn: "Luxury villa with exceptional design and premium amenities. Features include private cinema, home office, and expansive outdoor entertainment areas. Ideal for large families.",
        descriptionAr: "فيلا فاخرة بتصميم استثنائي ووسائل راحة متميزة",
        priceAmount: 35000,
        priceCurrency: "QAR",
        priceFrequency: "monthly",
        priceType: "rent",
        bedrooms: 5,
        bathrooms: 4,
        beds: 5,
        baths: 4,
        size: 500,
        area: 500,
        plotSize: 800,
        parkingSlots: 4,
        furnishingType: "Furnished",
        type: "villa",
        category: "residential",
        status: "published",
        locationLevel1: "Al Waab",
        locationLevel2: "Doha",
        locationLevel3: "Qatar",
        address: "Al Waab, Doha, Qatar",
        reference: "PROP-004",
        age: 3,
        numberOfFloors: 2,
        amenities: ["Private Pool", "Garden", "Cinema", "Home Office", "Maid's Room", "Parking"],
        images: [
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" },
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" },
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" },
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" },
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" }
        ],
        agent: {
            id: "agent-2",
            firstName: "Fatima",
            lastName: "Al-Thani",
            email: "fatima.althani@alasmakh.com",
            phone: "+974 2345 6789",
            profilePicture: "/div.property-thumbnail-wrapper.png",
            location: {
                city: "Doha",
                district: "Al Waab",
                address: "Doha, Qatar"
            }
        },
        createdAt: "2024-04-05T10:00:00Z"
    },
    {
        id: "5",
        titleEn: "Stylish Studio Apartment in Msheireb",
        titleAr: "استوديو أنيق في مشيريب",
        descriptionEn: "Compact and modern studio apartment in the heart of Msheireb Downtown. Perfect for singles or couples. Features include modern appliances and access to building amenities.",
        descriptionAr: "استوديو مدمج وحديث في قلب مشيريب",
        priceAmount: 8000,
        priceCurrency: "QAR",
        priceFrequency: "monthly",
        priceType: "rent",
        bedrooms: 0,
        bathrooms: 1,
        beds: 0,
        baths: 1,
        size: 45,
        area: 45,
        parkingSlots: 0,
        furnishingType: "Furnished",
        type: "studio",
        category: "residential",
        status: "published",
        locationLevel1: "Msheireb",
        locationLevel2: "Doha",
        locationLevel3: "Qatar",
        address: "Msheireb Downtown, Doha, Qatar",
        reference: "PROP-005",
        age: 1,
        numberOfFloors: 25,
        unitNumber: "1201",
        amenities: ["Gym", "Security", "Concierge"],
        images: [
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" },
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" }
        ],
        agent: {
            id: "agent-1",
            firstName: "Ahmed",
            lastName: "Al-Sulaiti",
            email: "ahmed.alsulaiti@alasmakh.com",
            phone: "+974 1234 5678",
            profilePicture: "/div.property-thumbnail-wrapper.png",
            location: {
                city: "Doha",
                district: "Msheireb",
                address: "Doha, Qatar"
            }
        },
        createdAt: "2024-05-12T10:00:00Z"
    },
    {
        id: "6",
        titleEn: "Commercial Office Space in Business District",
        titleAr: "مساحة مكتبية تجارية في الحي التجاري",
        descriptionEn: "Prime commercial office space in the heart of Doha's business district. Ideal for businesses looking for a prestigious address. Features include modern facilities and excellent connectivity.",
        descriptionAr: "مساحة مكتبية تجارية رئيسية في قلب الحي التجاري",
        priceAmount: 20000,
        priceCurrency: "QAR",
        priceFrequency: "monthly",
        priceType: "rent",
        bedrooms: 0,
        bathrooms: 2,
        beds: 0,
        baths: 2,
        size: 200,
        area: 200,
        parkingSlots: 5,
        furnishingType: "Unfurnished",
        type: "office",
        category: "commercial",
        status: "published",
        locationLevel1: "West Bay",
        locationLevel2: "Doha",
        locationLevel3: "Qatar",
        address: "West Bay Business District, Doha, Qatar",
        reference: "PROP-006",
        age: 10,
        numberOfFloors: 30,
        unitNumber: "2801",
        amenities: ["Parking", "Security", "Reception", "Meeting Rooms"],
        images: [
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" },
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" },
            { url: "/div.property-thumbnail-wrapper.png", thumbnailUrl: "/div.property-thumbnail-wrapper.png" }
        ],
        agent: {
            id: "agent-2",
            firstName: "Fatima",
            lastName: "Al-Thani",
            email: "fatima.althani@alasmakh.com",
            phone: "+974 2345 6789",
            profilePicture: "/div.property-thumbnail-wrapper.png",
            location: {
                city: "Doha",
                district: "West Bay",
                address: "Doha, Qatar"
            }
        },
        createdAt: "2024-06-18T10:00:00Z"
    }
];

// All API calls use Next.js proxy - no direct backend calls
// This prevents ERR_NETWORK errors from mixed content (HTTPS -> HTTP)
// The proxy runs server-side, so no CORS or mixed content issues

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
            let location = "Location not specified";
            if (prop.locationLevel1) {
                location = prop.locationLevel1;
                if (prop.locationLevel2) location += `, ${prop.locationLevel2}`;
                if (prop.locationLevel3) location += `, ${prop.locationLevel3}`;
            } else if (prop.address) {
                location = prop.address;
            }

            let price = "Price on request";
            if (prop.priceAmount) {
                price = `QAR ${prop.priceAmount.toLocaleString()}`;
            }

            let image = "/div.property-thumbnail-wrapper.png";
            if (prop.images && Array.isArray(prop.images) && prop.images.length > 0) {
                image = prop.images[0].url || prop.images[0].thumbnailUrl || image;
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
                        let location = prop.locationLevel1 || "Location not specified";
                        if (prop.locationLevel2) location += `, ${prop.locationLevel2}`;
                        if (prop.locationLevel3) location += `, ${prop.locationLevel3}`;

                        let price = "Price on request";
                        if (prop.priceAmount) {
                            price = `QAR ${prop.priceAmount.toLocaleString()}`;
                        }

                        let image = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
                        if (prop.images && Array.isArray(prop.images) && prop.images.length > 0) {
                            image = prop.images[0].url || prop.images[0].thumbnailUrl || image;
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

