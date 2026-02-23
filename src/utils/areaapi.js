import axios from "axios";
import { getApiUrl } from "@/config/api";

// API Base URL for areas
const API_BASE_URL = getApiUrl('api/v1/areas');

/**
 * Fetch complete area details with projects, properties, and agents
 * @param {string} areaId - Area ID
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 50)
 * @returns {Promise<Object>} Object containing area, projects, properties, agents, and counts
 */
export const fetchAreaComplete = async (areaId, params = {}) => {
    try {
        const {
            page = 1,
            limit = 50,
        } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        const response = await axios.get(`${API_BASE_URL}/${areaId}/complete?${queryParams.toString()}`);

        if (!response.data) {
            throw new Error("Area not found - empty response");
        }

        let data = response.data;
        
        // CRITICAL FIX: Handle malformed JSON from production API (Hibernate proxy + concatenated error)
        // The production backend sometimes returns:
        //   1. A "hibernateLazyInitializer" key with no value (Hibernate proxy artifact)
        //   2. A second error JSON object appended after the main data: {...data...}{"error":"..."}
        // Both problems make the response unparseable as-is.
        if (typeof data === 'string') {
            // Step 1: Remove Hibernate proxy artifacts - "hibernateLazyInitializer" is a key with no value
            // Pattern: ,"hibernateLazyInitializer"} → just }
            let cleanedString = data.replace(/,\s*"hibernateLazyInitializer"\s*(?=\s*})/g, '');
            
            try {
                // Step 2: Try parsing the cleaned string directly
                data = JSON.parse(cleanedString);
            } catch (parseError) {
                // Step 3: If it still fails (e.g., trailing error object appended), 
                // extract only the first complete JSON object by brace matching
                console.warn("Direct parse failed after cleanup, extracting first JSON object:", parseError.message);
                
                try {
                    let braceCount = 0;
                    let firstJsonEnd = -1;
                    let inString = false;
                    let escapeNext = false;
                    
                    for (let i = 0; i < cleanedString.length; i++) {
                        const char = cleanedString[i];
                        
                        if (escapeNext) { escapeNext = false; continue; }
                        if (char === '\\') { escapeNext = true; continue; }
                        if (char === '"') { inString = !inString; continue; }
                        
                        if (!inString) {
                            if (char === '{') braceCount++;
                            else if (char === '}') {
                                braceCount--;
                                if (braceCount === 0) {
                                    firstJsonEnd = i + 1;
                                    break;
                                }
                            }
                        }
                    }
                    
                    if (firstJsonEnd > 0) {
                        data = JSON.parse(cleanedString.substring(0, firstJsonEnd));
                        console.log("Successfully parsed first JSON object after cleanup");
                    } else {
                        throw parseError;
                    }
                } catch (fallbackError) {
                    console.error("All JSON parsing attempts failed:", fallbackError.message);
                    throw new Error("Invalid JSON response from server");
                }
            }
        }
        
        // Ensure data is an object before proceeding
        if (!data || typeof data !== 'object') {
            console.error("Invalid data structure:", typeof data, data);
            throw new Error("Invalid response format from server");
        }
            
        // Ensure arrays are properly formatted
        if (data.properties) {
            if (typeof data.properties === 'string') {
                try {
                    const parsed = JSON.parse(data.properties);
                    data.properties = Array.isArray(parsed) ? parsed : (typeof parsed === 'object' ? Object.values(parsed) : []);
                } catch (e) {
                    data.properties = [];
                }
            } else if (!Array.isArray(data.properties)) {
                if (data.properties && typeof data.properties === 'object') {
                    data.properties = Object.values(data.properties);
                } else {
                    data.properties = [];
                }
            }
        } else {
            data.properties = [];
        }
        
        if (data.projects) {
            if (typeof data.projects === 'string') {
                try {
                    const parsed = JSON.parse(data.projects);
                    data.projects = Array.isArray(parsed) ? parsed : (typeof parsed === 'object' ? Object.values(parsed) : []);
                } catch (e) {
                    data.projects = [];
                }
            } else if (!Array.isArray(data.projects)) {
                if (data.projects && typeof data.projects === 'object') {
                    data.projects = Object.values(data.projects);
                } else {
                    data.projects = [];
                }
            }
        } else {
            data.projects = [];
        }
        
        if (data.agents) {
            if (typeof data.agents === 'string') {
                try {
                    const parsed = JSON.parse(data.agents);
                    data.agents = Array.isArray(parsed) ? parsed : (typeof parsed === 'object' ? Object.values(parsed) : []);
                } catch (e) {
                    data.agents = [];
                }
            } else if (!Array.isArray(data.agents)) {
                if (data.agents && typeof data.agents === 'object') {
                    data.agents = Object.values(data.agents);
                } else {
                    data.agents = [];
                }
            }
        } else {
            data.agents = [];
        }

        // Parse JSON string fields if needed
        if (data.area && typeof data.area === 'object') {
            Object.keys(data.area).forEach(key => {
                const value = data.area[key];
                if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
                    try {
                        data.area[key] = JSON.parse(value);
                    } catch (e) {
                        // Not JSON, keep as is
                    }
                }
            });
        }

        return data;
    } catch (error) {
        throw {
            message: error.response?.data?.message || error.message || "Failed to load area data",
            status: error.response?.status,
            data: error.response?.data,
        };
    }
};
