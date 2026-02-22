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

        if (response.data) {
            let data = response.data;
            
            // Ensure arrays are properly formatted
            if (data.properties && !Array.isArray(data.properties)) {
                data.properties = [];
            }
            
            if (data.projects && !Array.isArray(data.projects)) {
                data.projects = [];
            }
            
            if (data.agents && !Array.isArray(data.agents)) {
                data.agents = [];
            }

            // Parse JSON string fields if needed
            if (data.area) {
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
        } else {
            throw new Error("Area not found - empty response");
        }
    } catch (error) {
        throw {
            message: error.response?.data?.message || error.message || "Failed to load area data",
            status: error.response?.status,
            data: error.response?.data,
        };
    }
};
