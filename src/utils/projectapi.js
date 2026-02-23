import axios from "axios";
import { getApiUrl } from "@/config/api";

// API Base URL for projects
const API_BASE_URL = getApiUrl('api/v1/projects');

/**
 * Format project data for PropertyListDev component
 * @param {Object} project - Raw project object from API
 * @returns {Object} Formatted project object
 */
export const formatProject = (project) => {
    // Get cover picture or first gallery image
    let imageUrl = "/div.property-thumbnail-wrapper.png";
    if (project.coverPicture) {
        imageUrl = project.coverPicture;
    } else if (project.gallery && Array.isArray(project.gallery) && project.gallery.length > 0) {
        const firstImage = project.gallery[0];
        imageUrl = typeof firstImage === 'string' ? firstImage : (firstImage.url || firstImage.thumbnailUrl || imageUrl);
    }

    // Format location
    let location = "Location not specified";
    if (project.locationLevel1) {
        location = project.locationLevel1;
        if (project.locationLevel2) location += `, ${project.locationLevel2}`;
        if (project.locationLevel3) location += `, ${project.locationLevel3}`;
    }

    // Get year from projectDate, createdAt, or default to current year
    let year = new Date().getFullYear().toString();
    if (project.projectDate) {
        try {
            year = new Date(project.projectDate).getFullYear().toString();
        } catch (e) {
            // Use default if date parsing fails
        }
    } else if (project.createdAt) {
        try {
            year = new Date(project.createdAt).getFullYear().toString();
        } catch (e) {
            // Use default if date parsing fails
        }
    }

    // Determine status and statusType based on project completion
    let status = "100% Completed";
    let statusType = "completed";

    // Check if project has completion date and compare with current date
    if (project.projectCompletionDate) {
        const completionDate = new Date(project.projectCompletionDate);
        const now = new Date();
        if (completionDate > now) {
            status = "30% Ongoing";
            statusType = "ongoing";
        }
    } else if (project.projectStartDate) {
        // If only start date exists, assume ongoing
        const startDate = new Date(project.projectStartDate);
        const now = new Date();
        if (startDate <= now) {
            status = "30% Ongoing";
            statusType = "ongoing";
        }
    }

    // Get units from propertiesCount if available
    const units = project.propertiesCount || "N/A";

    // Price - projects might not have price, use "Price on request"
    const price = "Price on request";

    return {
        id: project.id,
        title: project.nameEn || project.name || "Untitled Project",
        location: location,
        year: year,
        units: units,
        status: status,
        statusType: statusType,
        price: price,
        image: imageUrl,
        // Preserve raw project fields
        projectType: project.projectType,
        descriptionEn: project.descriptionEn,
        descriptionAr: project.descriptionAr,
        developer: project.developer,
        amenities: project.amenities,
        gallery: project.gallery,
        coverPicture: project.coverPicture,
    };
};

/**
 * Fetch projects from backend API
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 50)
 * @param {string} params.status - Project status filter (default: "active")
 * @param {string} params.projectType - Project type filter (e.g., "Residential", "Commercial", "Mixed-Use")
 * @param {string} params.areaId - Area ID filter
 * @returns {Promise<Object>} Object containing projects array and pagination info
 */
export const fetchProjects = async (params = {}) => {
    try {
        const {
            page = 1,
            limit = 50,
            status = "active",
            projectType,
            areaId,
        } = params;

        // Build query parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        // Add optional filters
        if (status) queryParams.append("status", status);
        if (areaId) queryParams.append("areaId", areaId);
        // Add projectType to query params (backend may support it in future, or we filter on frontend)
        if (projectType) queryParams.append("projectType", projectType);

        // Call API
        const response = await axios.get(`${API_BASE_URL}?${queryParams.toString()}`);

        if (response.data && response.data.projects) {
            let projectsData = response.data.projects || [];

            // Backend now filters by projectType, but we keep frontend filtering as fallback
            if (projectType) {
                const projectTypeLower = projectType.toLowerCase();
                projectsData = projectsData.filter(p => {
                    if (!p.projectType) return false;
                    const pType = p.projectType.toLowerCase();

                    // Exact match
                    if (pType === projectTypeLower) return true;

                    // Support "Luxury Residences" -> "Residential" mapping
                    if (projectTypeLower === "luxury residences" || projectTypeLower === "luxury") {
                        return pType === "residential";
                    }

                    // Support "Industrial"
                    if (projectTypeLower === "industrial") {
                        return pType === "industrial";
                    }

                    return false;
                });
            }

            // Format projects for component
            const formattedProjects = projectsData.map((project, index) => {
                try {
                    return formatProject(project);
                } catch (error) {
                    // Return a minimal formatted project if formatting fails
                    return {
                        id: project.id || `unknown-${index}`,
                        title: project.nameEn || project.name || "Untitled Project",
                        location: project.locationLevel1 || "Location not specified",
                        year: new Date().getFullYear().toString(),
                        units: project.propertiesCount || "N/A",
                        status: "100% Completed",
                        statusType: "completed",
                        price: "Price on request",
                        image: project.coverPicture || "/div.property-thumbnail-wrapper.png",
                    };
                }
            });

            return {
                projects: formattedProjects,
                totalProjects: response.data.pagination?.total || formattedProjects.length,
                pagination: response.data.pagination || {
                    total: formattedProjects.length,
                    page: page,
                    limit: limit,
                    pages: Math.ceil((response.data.pagination?.total || formattedProjects.length) / limit),
                },
            };
        } else {
            return {
                projects: [],
                totalProjects: 0,
                pagination: {
                    total: 0,
                    page: page,
                    limit: limit,
                    pages: 0,
                },
            };
        }
    } catch (error) {
        throw {
            message: error.response?.data?.message || error.message || "Failed to load projects",
            status: error.response?.status,
            data: error.response?.data,
        };
    }
};

/**
 * Fetch projects by project type (for luxury, commercial, industrial pages)
 * @param {string} projectType - Project type: "Residential", "Commercial", "Industrial", "Mixed-Use"
 * @param {Object} options - Additional options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 50)
 * @param {string} options.status - Project status (default: "active")
 * @returns {Promise<Array>} Array of formatted project objects
 */
export const fetchProjectsByType = async (projectType, options = {}) => {
    try {
        const {
            page = 1,
            limit = 50,
            status = "active",
        } = options;

        // Fetch projects and filter by type
        const result = await fetchProjects({
            page,
            limit,
            status,
            projectType,
        });

        return result.projects || [];
    } catch (error) {
        throw {
            message: error.response?.data?.message || error.message || "Failed to load projects",
            status: error.response?.status,
            data: error.response?.data,
        };
    }
};

/**
 * Fetch a single project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Full response object including project, properties, agents, etc.
 */
export const fetchProjectById = async (projectId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${projectId}`);

        if (!response.data) {
            throw new Error("Project not found - empty response");
        }

        let data = response.data;
        
        // CRITICAL FIX: Handle case where response.data is a JSON string (production issue)
        // This can happen if Content-Type is wrong or axios doesn't auto-parse
        // Also handle case where response contains multiple JSON objects concatenated (data + error)
        if (typeof data === 'string') {
            try {
                // First, try normal parsing
                data = JSON.parse(data);
            } catch (parseError) {
                // If parsing fails, the response might contain multiple JSON objects concatenated
                // (e.g., valid data + error object at the end like: {...}{"error":"..."})
                // Extract the first complete JSON object
                console.warn("Initial JSON parse failed, attempting to extract first JSON object:", parseError.message);
                
                try {
                    // Find the first complete JSON object by finding matching braces
                    let jsonString = data.trim();
                    let braceCount = 0;
                    let firstJsonEnd = -1;
                    let inString = false;
                    let escapeNext = false;
                    
                    for (let i = 0; i < jsonString.length; i++) {
                        const char = jsonString[i];
                        
                        if (escapeNext) {
                            escapeNext = false;
                            continue;
                        }
                        
                        if (char === '\\') {
                            escapeNext = true;
                            continue;
                        }
                        
                        if (char === '"') {
                            inString = !inString;
                            continue;
                        }
                        
                        if (!inString) {
                            if (char === '{') {
                                braceCount++;
                            } else if (char === '}') {
                                braceCount--;
                                if (braceCount === 0 && firstJsonEnd === -1) {
                                    firstJsonEnd = i + 1;
                                    break;
                                }
                            }
                        }
                    }
                    
                    // Extract first JSON object if we found it
                    if (firstJsonEnd > 0) {
                        jsonString = jsonString.substring(0, firstJsonEnd);
                        data = JSON.parse(jsonString);
                        console.log("Successfully extracted first JSON object from concatenated response");
                    } else {
                        throw parseError;
                    }
                } catch (fallbackError) {
                    console.error("Failed to parse response.data as JSON string:", parseError);
                    console.error("Fallback extraction also failed:", fallbackError);
                    throw new Error("Invalid JSON response from server");
                }
            }
        }
        
        // Ensure data is an object before proceeding
        if (!data || typeof data !== 'object') {
            console.error("Invalid data structure:", typeof data, data);
            throw new Error("Invalid response format from server");
        }
        
        // Handle case where data might be wrapped
        if (data.data && typeof data.data === 'object') {
            data = data.data;
        }
        
        // Handle error response
        if (data.error && !data.project && !data.properties) {
            throw new Error(data.message || data.error || "Failed to load project");
        }
        
        // Ensure properties is an array
        if (data.properties) {
            if (typeof data.properties === 'string') {
                try {
                    data.properties = JSON.parse(data.properties);
                } catch (parseError) {
                    data.properties = [];
                }
            }
            
            if (!Array.isArray(data.properties)) {
                if (data.properties && typeof data.properties === 'object') {
                    data.properties = Object.values(data.properties);
                } else {
                    data.properties = [];
                }
            }
        } else {
            data.properties = [];
        }
        
        // Ensure projectAssignedAgentsList is an array
        if (data.projectAssignedAgentsList) {
            if (typeof data.projectAssignedAgentsList === 'string') {
                try {
                    data.projectAssignedAgentsList = JSON.parse(data.projectAssignedAgentsList);
                } catch (parseError) {
                    data.projectAssignedAgentsList = [];
                }
            }
            
            if (!Array.isArray(data.projectAssignedAgentsList)) {
                if (data.projectAssignedAgentsList && typeof data.projectAssignedAgentsList === 'object') {
                    data.projectAssignedAgentsList = Object.values(data.projectAssignedAgentsList);
                } else {
                    data.projectAssignedAgentsList = [];
                }
            }
        } else {
            data.projectAssignedAgentsList = [];
        }
        
        // Parse JSON string fields in project object (e.g., amenities, gallery)
        if (data.project && typeof data.project === 'object') {
            Object.keys(data.project).forEach(key => {
                const value = data.project[key];
                if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
                    try {
                        data.project[key] = JSON.parse(value);
                    } catch (e) {
                        // Not JSON, keep as is
                    }
                }
            });
        }
        
        return data;
    } catch (error) {
        throw {
            message: error.response?.data?.message || error.message || "Failed to load project",
            status: error.response?.status,
            data: error.response?.data,
        };
    }
};

