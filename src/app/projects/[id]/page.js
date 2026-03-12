"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import DreamPropertySection from "@/components/DreamPropertySection";
import { SlidersHorizontal, ArrowDown, Home, MapPin, Bed, Bath, Check } from "lucide-react";
import { FaDollarSign } from "react-icons/fa";
import PropertyListView from "@/components/PropertyListView";
import { fetchProperties } from "../../../utils/propertyapi";
import { searchProperties } from "../../../utils/searchApi";
import { fetchProjectById, fetchProjects } from "../../../utils/projectapi";
import { cleanHtmlDescriptionRegex } from "../../../utils/htmlUtils";
import MoreFiltersModal from "../../../components/MoreFiltersModal";
import { FaArrowRight, FaChevronUp, FaChevronDown, FaBath,  } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";

import { FaHome, FaUser, FaWifi, FaSwimmingPool, FaDumbbell, FaParking, FaSnowflake, FaDog, FaShieldAlt, FaTv, FaUtensils, FaArrowUp, FaBuilding, FaBed, FaRegSquare, FaCar, FaCouch, FaRulerCombined } from "react-icons/fa";
import ShareButton from "@/components/ShareButton";
import { FALLBACK_PROPERTY_IMAGE, getSafeImage, handleImageErrorOnce } from "@/utils/imageUtils";
import Link from "next/link";
import Header from "../../../components/Header";
import LoadingOverlay from "@/components/LoadingOverlay";
import PropertyListDev from "@/components/PropertyListDev";
// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyBS4N8g1D0VhjnOHwSMWRdz1JbTmEUg8Gw";
export default function Sale({ priceType: initialPriceType = "rent" }) {
    const params = useParams();
    const projectId = params?.id;

    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [priceType, setPriceType] = useState(initialPriceType); // "rent" or "sale"
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalProperties, setTotalProperties] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState({});
    const [project, setProject] = useState(null);
    const [projectLoading, setProjectLoading] = useState(true);
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRefs = useRef({});
    const [activeTab, setActiveTab] = useState("overview"); // overview, gallery, document, area, 360view
    const [viewMode, setViewMode] = useState("properties"); // properties or agents
    const [agents, setAgents] = useState([]);
    const [propertiesLoadedFromProject, setPropertiesLoadedFromProject] = useState(false);
    const [relatedProjects, setRelatedProjects] = useState([]);
    const [relatedProjectsLoading, setRelatedProjectsLoading] = useState(false);
    const [heroImageSrc, setHeroImageSrc] = useState("/images_pages/listings.png");
    const [imageError, setImageError] = useState(false);
    const [galleryModalOpen, setGalleryModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Filter options
    const filterOptions = {
        "Type": ["Apartment", "Villa", "Townhouse", "Penthouse", "Studio"],
        Location: ["Doha", "Lusail", "West Bay", "Pearl Qatar", "Al Waab"],
        Beds: ["1", "2", "3", "4", "5+"],
        Baths: ["1", "2", "3", "4", "5+"],
        Price: ["0-5000", "5000-10000", "10000-20000", "20000-50000", "50000+"],
    };

    const [selectedFilters, setSelectedFilters] = useState({
        "Property Type": null,
        Location: null,
        Beds: null,
        Baths: null,
        Price: null,
    });

    // Update priceType when prop changes
    useEffect(() => {
        setPriceType(initialPriceType);
    }, [initialPriceType]);

    // Load properties using search API or fallback to fetchProperties
    const loadProperties = useCallback(async (searchText = "", filters = {}) => {
        try {
            setLoading(true);
            setError(null);

            // Always include projectId in filters
            const filtersWithProjectId = {
                ...filters,
                projectId: projectId,
            };

            // Use search API if there's a search query or filters, otherwise use regular fetch
            const hasSearchOrFilters = searchText || Object.keys(filters).length > 0;

            if (hasSearchOrFilters) {
                // Use search API with all filters including projectId
                const searchFilters = {
                    q: searchText,
                    priceType: priceType,
                    status: "published",
                    page: 1,
                    limit: 50,
                    ...filtersWithProjectId,
                };

                const result = await searchProperties(searchFilters);
                // Handle nested structure: properties array with {property: {...}} objects
                let propertiesList = result.properties || [];
                if (propertiesList.length > 0 && propertiesList[0].property) {
                    propertiesList = propertiesList.map(item => item.property || item);
                }
                setProperties(propertiesList);
                setTotalProperties(result.pagination?.total || result.total || 0);
            } else {
                // Use regular fetch for initial load with projectId
                const result = await fetchProperties({
                    priceType: priceType,
                    page: 1,
                    limit: 50,
                    status: "published",
                    projectId: projectId,
                });

                // Handle nested structure: properties array with {property: {...}} objects
                let propertiesList = result.properties || [];
                if (propertiesList.length > 0 && propertiesList[0].property) {
                    propertiesList = propertiesList.map(item => item.property || item);
                }
                setProperties(propertiesList);
                setTotalProperties(result.totalProperties || 0);
            }
        } catch (err) {
            console.error("Error loading properties:", err);
            setError(err.message || "Failed to load properties");
            setProperties([]);
            setTotalProperties(0);
        } finally {
            setLoading(false);
        }
    }, [priceType, projectId]);

    // Update hero image when project changes
    useEffect(() => {
        if (project?.coverPicture) {
            // Reset error state and set new image source
            setImageError(false);
            setHeroImageSrc(project.coverPicture);
        } else {
            // Use fallback if no cover picture
            setHeroImageSrc("/images_pages/listings.png");
            setImageError(false);
        }
    }, [project?.coverPicture]);

    // Fetch project data
    useEffect(() => {
        const loadProject = async () => {
            if (projectId) {
                try {
                    setProjectLoading(true);
                    setError(null);
                    let projectData = await fetchProjectById(projectId);
                    
                    // CRITICAL FIX: Ensure projectData is an object, not a string
                    if (typeof projectData === 'string') {
                        try {
                            projectData = JSON.parse(projectData);
                        } catch (parseError) {
                            console.error("Failed to parse projectData as JSON string:", parseError);
                            throw new Error("Invalid response format: expected object but got string");
                        }
                    }
                    
                    // Ensure projectData is an object
                    if (!projectData || typeof projectData !== 'object') {
                        console.error("Invalid projectData type:", typeof projectData, projectData);
                        throw new Error("Invalid response format: expected object");
                    }
                    
                    // Handle error in response (data might still be present even if there's an error)
                    if (projectData.error) {
                        console.warn("API returned error but data may still be available:", projectData.error, projectData.message);
                    }
                    
                    // New response format: { project, properties, projectAssignedAgentsList, listingsCount, area, amenitiesCount, propertyAgents, ... }
                    // Extract project info - prioritize project field, fallback to root level
                    let projectInfo = null;
                    
                    // Check if project field exists and is a valid object
                    // Handle both null and undefined cases
                    if (projectData.hasOwnProperty('project')) {
                        if (projectData.project === null) {
                            console.warn("projectData.project is null - will use fallback");
                        } else if (typeof projectData.project === 'object' && projectData.project !== null) {
                            // Check if it has project-like properties (id, name, etc.)
                            if (projectData.project.id || projectData.project._id || projectData.project.nameEn || projectData.project.name || 
                                projectData.project.projectReference || projectData.project.locationLevel1) {
                                projectInfo = projectData.project;
                                console.log("Using project from projectData.project field");
                            } else {
                                console.warn("projectData.project exists but doesn't have expected fields:", Object.keys(projectData.project));
                            }
                        } else {
                            console.warn("projectData.project is not an object:", typeof projectData.project, projectData.project);
                        }
                    } else {
                        console.warn("projectData.project field is missing");
                    }
                    
                    // Fallback: check if root level has project data
                    if (!projectInfo) {
                        const rootHasProjectData = projectData.id || projectData._id || projectData.nameEn || projectData.name || 
                                                   projectData.projectReference || projectData.locationLevel1;
                        if (rootHasProjectData) {
                            projectInfo = projectData;
                            console.log("Using root level as project data");
                        }
                    }
                    
                    // If still no project info, try to construct from available data
                    if (!projectInfo) {
                        console.error("Could not find project data. Response structure:", {
                            projectField: projectData.project,
                            projectFieldType: typeof projectData.project,
                            rootLevel: {
                                id: projectData.id,
                                _id: projectData._id,
                                nameEn: projectData.nameEn,
                                name: projectData.name,
                                projectReference: projectData.projectReference
                            },
                            allKeys: Object.keys(projectData || {}),
                            hasProperties: !!projectData.properties,
                            hasAgents: !!projectData.projectAssignedAgentsList,
                            hasArea: !!projectData.area
                        });
                        
                        // Create a minimal project object from available data
                        // This ensures the page doesn't crash even if project data is missing
                        projectInfo = {
                            id: projectData.id || projectData._id || projectId,
                            _id: projectData._id || projectData.id || projectId,
                            nameEn: projectData.nameEn || projectData.name || "Project",
                            name: projectData.name || projectData.nameEn || "Project",
                            projectReference: projectData.projectReference || projectId,
                            // Include any other fields that might be useful
                            ...(projectData.locationLevel1 && { locationLevel1: projectData.locationLevel1 }),
                            ...(projectData.locationLevel2 && { locationLevel2: projectData.locationLevel2 }),
                            ...(projectData.locationLevel3 && { locationLevel3: projectData.locationLevel3 }),
                            ...(projectData.locationLevel4 && { locationLevel4: projectData.locationLevel4 }),
                            ...(projectData.amenities && { amenities: projectData.amenities }),
                            ...(projectData.gallery && { gallery: projectData.gallery }),
                            ...(projectData.coverPicture && { coverPicture: projectData.coverPicture }),
                        };
                        console.log("Created minimal project object from available data");
                    }
                    
                    // Attach area data to project if available at top level
                    if (projectData.area && typeof projectData.area === 'object') {
                        projectInfo.area = projectData.area;
                    }
                    
                    // Attach amenities count if available
                    if (projectData.amenitiesCount !== undefined) {
                        projectInfo.amenitiesCount = projectData.amenitiesCount;
                    }
                    
                    setProject(projectInfo);
                    
                    // Extract properties from response (already parsed from JSON if needed by API function)
                    // CRITICAL FIX: Handle case where properties might still be a JSON string
                    if (projectData.properties && typeof projectData.properties === 'string') {
                        try {
                            const parsed = JSON.parse(projectData.properties);
                            projectData.properties = Array.isArray(parsed) ? parsed : (typeof parsed === 'object' && parsed !== null ? Object.values(parsed) : []);
                        } catch (parseError) {
                            console.error("Failed to parse properties JSON string:", parseError);
                            projectData.properties = [];
                        }
                    }
                    
                    console.log("📋 Extracting properties from response:", {
                        hasProperties: !!projectData.properties,
                        propertiesType: Array.isArray(projectData.properties) ? 'array' : typeof projectData.properties,
                        propertiesLength: Array.isArray(projectData.properties) ? projectData.properties.length : 'N/A',
                        firstProperty: projectData.properties?.[0],
                        listingsCount: projectData.listingsCount
                    });
                    
                    if (projectData.properties && Array.isArray(projectData.properties)) {
                        // Handle nested structure: properties array with {property: {...}} objects
                        let propertiesList = projectData.properties;
                        console.log("✅ Properties array found, length:", propertiesList.length);
                        
                        if (propertiesList.length > 0) {
                            // Check if properties are nested in property field
                            if (propertiesList[0] && typeof propertiesList[0] === 'object' && propertiesList[0].property) {
                                console.log("🔄 Properties are nested in 'property' field, extracting...");
                                propertiesList = propertiesList.map(item => {
                                    // Handle both {property: {...}} and direct property objects
                                    if (item && typeof item === 'object') {
                                        return item.property || item;
                                    }
                                    return item;
                                });
                        }
                            
                            // Handle JSON string properties (if API didn't parse them)
                            propertiesList = propertiesList.map(item => {
                                if (typeof item === 'string') {
                                    try {
                                        return JSON.parse(item);
                                    } catch (e) {
                                        return item;
                                    }
                                }
                                return item;
                            });
                            
                            // Filter out any null/undefined properties
                            propertiesList = propertiesList.filter(prop => {
                                const isValid = prop !== null && prop !== undefined;
                                if (!isValid) {
                                    console.warn("Filtering out invalid property:", prop);
                                }
                                return isValid;
                            });
                            
                            console.log("✅ After processing, properties count:", propertiesList.length);
                        }
                        
                        setProperties(propertiesList);
                        // Use listingsCount from response, or count from properties array
                        setTotalProperties(projectData.listingsCount || propertiesList.length || 0);
                        setLoading(false);
                        setPropertiesLoadedFromProject(true);
                        console.log("✅✅ Properties set successfully in state:", {
                            count: propertiesList.length,
                            sampleIds: propertiesList.slice(0, 3).map(p => p?.id || p?.propertyId || p?._id || 'no-id'),
                            firstPropertyTitle: propertiesList[0]?.titleEn || propertiesList[0]?.title || 'no-title'
                        });
                    } else {
                        console.warn("⚠️ No properties array in response or properties is not an array");
                        // No properties in response, set empty array
                        setProperties([]);
                        setTotalProperties(projectData.listingsCount || 0);
                        setLoading(false);
                        setPropertiesLoadedFromProject(false);
                    }
                    
                    // Extract agents from response - prioritize projectAssignedAgentsList (already parsed from JSON if needed by API function)
                    // CRITICAL FIX: Handle case where projectAssignedAgentsList might still be a JSON string
                    if (projectData.projectAssignedAgentsList && typeof projectData.projectAssignedAgentsList === 'string') {
                        try {
                            const parsed = JSON.parse(projectData.projectAssignedAgentsList);
                            projectData.projectAssignedAgentsList = Array.isArray(parsed) ? parsed : (typeof parsed === 'object' && parsed !== null ? Object.values(parsed) : []);
                        } catch (parseError) {
                            console.error("Failed to parse projectAssignedAgentsList JSON string:", parseError);
                            projectData.projectAssignedAgentsList = [];
                        }
                    }
                    
                    console.log("👥 Extracting agents from response:", {
                        hasProjectAssignedAgentsList: !!projectData.projectAssignedAgentsList,
                        hasProjectAssignedAgents: !!projectData.projectAssignedAgents,
                        hasPropertyAgents: !!projectData.propertyAgents,
                        projectAssignedAgentsListType: Array.isArray(projectData.projectAssignedAgentsList) ? 'array' : typeof projectData.projectAssignedAgentsList,
                        projectAssignedAgentsListLength: Array.isArray(projectData.projectAssignedAgentsList) ? projectData.projectAssignedAgentsList.length : 'N/A'
                    });
                    
                    let agentsList = [];
                    if (projectData.projectAssignedAgentsList && Array.isArray(projectData.projectAssignedAgentsList)) {
                        agentsList = projectData.projectAssignedAgentsList;
                        console.log("✅ Using projectAssignedAgentsList, count:", agentsList.length);
                    } else if (projectData.projectAssignedAgents) {
                        if (Array.isArray(projectData.projectAssignedAgents)) {
                            agentsList = projectData.projectAssignedAgents;
                            console.log("✅ Using projectAssignedAgents (array), count:", agentsList.length);
                        } else if (typeof projectData.projectAssignedAgents === 'string') {
                            // Try to parse as JSON string
                            try {
                                agentsList = JSON.parse(projectData.projectAssignedAgents);
                                if (!Array.isArray(agentsList)) {
                                    agentsList = Object.values(agentsList);
                                }
                                console.log("✅ Parsed projectAssignedAgents from JSON string, count:", agentsList.length);
                            } catch (e) {
                                console.warn("⚠️ Failed to parse projectAssignedAgents JSON string");
                                agentsList = [];
                            }
                        } else if (typeof projectData.projectAssignedAgents === 'object' && projectData.projectAssignedAgents !== null) {
                        // Convert object to array
                            agentsList = Object.values(projectData.projectAssignedAgents);
                            console.log("✅ Using projectAssignedAgents (object), converted to array, count:", agentsList.length);
                        }
                    } else if (projectData.propertyAgents && typeof projectData.propertyAgents === 'object' && projectData.propertyAgents !== null) {
                        // Fallback to propertyAgents if available
                        if (Array.isArray(projectData.propertyAgents)) {
                            agentsList = projectData.propertyAgents;
                            console.log("✅ Using propertyAgents (array), count:", agentsList.length);
                        } else if (typeof projectData.propertyAgents === 'string') {
                            // Try to parse as JSON string
                            try {
                                agentsList = JSON.parse(projectData.propertyAgents);
                                if (!Array.isArray(agentsList)) {
                                    agentsList = Object.values(agentsList);
                                }
                                console.log("✅ Parsed propertyAgents from JSON string, count:", agentsList.length);
                            } catch (e) {
                                console.warn("⚠️ Failed to parse propertyAgents JSON string");
                                agentsList = [];
                            }
                        } else {
                            agentsList = Object.values(projectData.propertyAgents);
                            console.log("✅ Using propertyAgents (object), converted to array, count:", agentsList.length);
                        }
                    }
                    
                    // Handle JSON string agents in the list
                    agentsList = agentsList.map(agent => {
                        if (typeof agent === 'string') {
                            try {
                                return JSON.parse(agent);
                            } catch (e) {
                                return agent;
                            }
                        }
                        return agent;
                    });
                    
                    // Filter out null/undefined agents
                    agentsList = agentsList.filter(agent => {
                        const isValid = agent !== null && agent !== undefined;
                        if (!isValid) {
                            console.warn("Filtering out invalid agent:", agent);
                        }
                        return isValid;
                    });
                    
                    console.log("✅✅ Agents set successfully in state:", {
                        count: agentsList.length,
                        sampleAgents: agentsList.slice(0, 2).map(a => ({
                            id: a?.id || a?._id || a?.userId || 'no-id',
                            name: a?.name || a?.fullName || a?.firstName || 'no-name'
                        }))
                    });
                    setAgents(agentsList);
                    
                } catch (err) {
                    console.error("Error loading project:", err);
                    setError(err.message || "Failed to load project data");
                    setProject(null);
                    setProperties([]);
                    setAgents([]);
                } finally {
                    setProjectLoading(false);
                }
            }
        };
        loadProject();
    }, [projectId]);

    // Fetch related projects
    useEffect(() => {
        const loadRelatedProjects = async () => {
            if (project && projectId) {
                try {
                    setRelatedProjectsLoading(true);
                    // Try to fetch related projects by areaId first, then by projectType
                    let related = [];
                    
                    // Fetch by areaId (same area)
                    if (project.areaId) {
                        const areaProjects = await fetchProjects({
                            page: 1,
                            limit: 10,
                            status: "active",
                            areaId: project.areaId,
                        });
                        related = (areaProjects.projects || []).filter(p => (p.id || p._id) !== projectId);
                    }
                    
                    // If not enough, fetch by projectType
                    if (related.length < 3 && project.projectType) {
                        const typeProjects = await fetchProjects({
                            page: 1,
                            limit: 10,
                            status: "active",
                            projectType: project.projectType,
                        });
                        const typeRelated = (typeProjects.projects || []).filter(p => {
                            const pId = p.id || p._id;
                            return pId !== projectId && !related.some(r => (r.id || r._id) === pId);
                        });
                        related = [...related, ...typeRelated];
                    }
                    
                    // If still not enough, fetch any active projects
                    if (related.length < 3) {
                        const allProjects = await fetchProjects({
                            page: 1,
                            limit: 10,
                            status: "active",
                        });
                        const otherProjects = (allProjects.projects || []).filter(p => {
                            const pId = p.id || p._id;
                            return pId !== projectId && !related.some(r => (r.id || r._id) === pId);
                        });
                        related = [...related, ...otherProjects];
                    }
                    
                    // Limit to 3 projects
                    setRelatedProjects(related.slice(0, 3));
                } catch (err) {
                    console.error("Error loading related projects:", err);
                    setRelatedProjects([]);
                } finally {
                    setRelatedProjectsLoading(false);
                }
            }
        };
        loadRelatedProjects();
    }, [project, projectId]);

    // Initial load - only if properties weren't loaded from project response
    useEffect(() => {
        if (projectId && !propertiesLoadedFromProject) {
            loadProperties();
        }
    }, [priceType, projectId, propertiesLoadedFromProject]); // Reload when priceType or projectId changes

    // Note: loadProperties is intentionally not in dependencies to avoid infinite loops
    // It uses useCallback with proper dependencies (priceType) which will update when needed

    // Handle search from ListingHeroSection
    const handleSearch = useCallback(async (query) => {
        setSearchQuery(query || "");
        await loadProperties(query || "", activeFilters);
    }, [loadProperties, activeFilters]);

    // Handle filter changes from ListingHeroSection
    const handleFilterChange = useCallback(async (filters) => {
        // Map filter labels to API parameter names
        const mappedFilters = {};

        if (filters["Property Type"]) {
            const typeMap = {
                "Apartment": "apartment",
                "Villa": "villa",
                "Townhouse": "townhouse",
                "Penthouse": "luxury",
                "Studio": "studio",
            };
            mappedFilters.type = typeMap[filters["Property Type"]] || filters["Property Type"].toLowerCase();
        }

        if (filters["Location"]) {
            mappedFilters.locationLevel1 = filters["Location"];
        }

        if (filters["Beds"]) {
            // Handle "Studio" and "5+" formats
            if (filters["Beds"] === "Studio") {
                mappedFilters.bedrooms = "0";
            } else if (filters["Beds"].endsWith("+")) {
                const num = filters["Beds"].replace("+", "");
                mappedFilters.bedrooms = `${num}+`;
            } else {
                mappedFilters.bedrooms = filters["Beds"];
            }
        }

        if (filters["Baths"]) {
            if (filters["Baths"].endsWith("+")) {
                const num = filters["Baths"].replace("+", "");
                mappedFilters.bathrooms = `${num}+`;
            } else {
                mappedFilters.bathrooms = filters["Baths"];
            }
        }

        if (filters["Price"]) {
            // Parse price range like "0-5000" or "50000+"
            if (filters["Price"].includes("-")) {
                const [min, max] = filters["Price"].split("-");
                mappedFilters.minPrice = min;
                mappedFilters.maxPrice = max;
            } else if (filters["Price"].endsWith("+")) {
                mappedFilters.minPrice = filters["Price"].replace("+", "");
            }
        }

        setActiveFilters(mappedFilters);
        await loadProperties(searchQuery, mappedFilters);
    }, [loadProperties, searchQuery, projectId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.keys(dropdownRefs.current).forEach((key) => {
                if (
                    dropdownRefs.current[key] &&
                    !dropdownRefs.current[key].contains(event.target)
                ) {
                    setOpenDropdown(null);
                }
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Keyboard navigation for gallery modal
    useEffect(() => {
        if (!galleryModalOpen || !project || !project.gallery) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setGalleryModalOpen(false);
            } else if (e.key === 'ArrowLeft' && selectedImageIndex > 0) {
                setSelectedImageIndex(selectedImageIndex - 1);
            } else if (e.key === 'ArrowRight' && selectedImageIndex < project.gallery.length - 1) {
                setSelectedImageIndex(selectedImageIndex + 1);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [galleryModalOpen, selectedImageIndex, project]);

    const handleFilterSelect = (filterName, value) => {
        const newFilters = {
            ...selectedFilters,
            [filterName]: selectedFilters[filterName] === value ? null : value,
        };
        setSelectedFilters(newFilters);
        setOpenDropdown(null);
        handleFilterChange(newFilters);
    };

    const getIcon = (label) => {
        switch (label) {
            case "Property Type":
                return <Home size={16} />;
            case "Location":
                return <MapPin size={16} />;
            case "Beds":
                return <Bed size={16} />;
            case "Baths":
                return <Bath size={16} />;
            case "Price":
                return <FaDollarSign size={14} />;
            default:
                return null;
        }
    };

    // Handle search results from MoreFiltersModal
    const handleMoreFiltersSearch = useCallback((results) => {
        // MoreFiltersModal already calls searchProperties, so we just update state with results
        if (results && results.properties) {
            // Handle nested structure: properties array with {property: {...}} objects
            let propertiesList = results.properties || [];
            if (propertiesList.length > 0 && propertiesList[0].property) {
                propertiesList = propertiesList.map(item => item.property || item);
            }
            setProperties(propertiesList);
            setTotalProperties(results.pagination?.total || results.total || 0);
            setShowMoreFilters(false);
            setError(null);
        } else {
            setProperties([]);
            setTotalProperties(0);
            setError("No properties found");
        }
    }, []);

    return (
        <div className="bg-[#F5F7FA]">
            {/* Loading Overlay */}
            <LoadingOverlay isLoading={projectLoading} />

            {/* ---------- HERO SECTION WITH FILTERS ---------- */}

            <section className="bg-[#F5F7FA] relative w-full min-h-[95vh] lg:min-h-[95vh] flex flex-col items-center justify-center overflow-visible">
                {/* Background Image */}
                {heroImageSrc && (
                    <Image
                        src={heroImageSrc}
                        alt={project?.nameEn || project?.name || "Project Cover"}
                        fill
                        className="object-cover"
                        unoptimized={heroImageSrc.startsWith('http')}
                        priority
                        onError={() => {
                            // Only fallback once to prevent infinite loops
                            if (!imageError) {
                                setImageError(true);
                                setHeroImageSrc("/images_pages/listings.png");
                            }
                        }}
                        onLoad={() => {
                            // Reset error state on successful load
                            if (imageError) {
                                setImageError(false);
                            }
                        }}
                    />
                )}

<Header />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/20 z-10"></div>

                {/* Project Title with Glass Effect */}
                {/* <div className="relative z-20 text-center px-4 mb-8">
                    <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-lg px-8 py-6 shadow-2xl">
                        {projectLoading ? (
                            <div className="text-white text-4xl lg:text-6xl font-bold">Loading...</div>
                        ) : project ? (
                            <h1 className="text-white text-4xl lg:text-6xl font-bold drop-shadow-lg">
                                {project.nameEn || project.name || "Project"}
                            </h1>
                        ) : (
                            <h1 className="text-white text-4xl lg:text-6xl font-bold drop-shadow-lg">Project</h1>
                        )}
                    </div>
                </div> */}

                <div className="absolute left-4 md:left-8 lg:left-12 top-[55%] md:top-[56%] lg:top-[57%] transform -translate-y-1/2 z-20 w-[90%] md:w-[60%] lg:w-[60%]">
          <div className="glass-effect text-center rounded-lg shadow-lg p-4 sm:p-6 md:p-10 lg:text-left w-full max-w-5xl mx-auto mt-4 md:mt-6 lg:mt-8">

            {/* Project Name */}
            {projectLoading ? (
              <div className="text-white text-2xl lg:text-3xl font-bold mb-4"></div>
            ) : project ? (
              <>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text4xl font-bold text-[#001730] mb-3 sm:mb-4 px-10 lg:px-0">
                  {project.nameEn || project.name || "Project"}
                </h1>
                
                {/* Location */}
                {project.locationLevel1 || project.locationLevel2 || project.locationLevel3 || project.locationLevel4 ? (
                  <div className="flex items-center gap-2 mb-4 sm:mb-6 px-10 lg:px-0">
                    <MapPin size={18} className="text-[#001730] flex-shrink-0" />
                    <p className="text-sm sm:text-base md:text-lg text-[#001730] font-medium">
                      {[
                        project.locationLevel1,
                        project.locationLevel2,
                        project.locationLevel3,
                        project.locationLevel4
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                ) : null}

                {/* Divider */}
                <div className="w-[80%] h-[0.5px] bg-gray-300 my-4 sm:my-6 mx-auto lg:mx-0 lg:mr-40"></div>

                {/* Amenities Section */}
                {project.amenities && project.amenities.length > 0 && (
                  <div className="px-10 lg:px-0 lg:mr-40">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#001730] mb-3 sm:mb-4">
                      Amenities
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                      {project.amenities.map((amenity, idx) => {
                        // Map amenity names to icons
                        const getAmenityIcon = (amenityName) => {
                          const name = amenityName?.toLowerCase() || '';
                          if (name.includes('wifi') || name.includes('internet')) return <FaWifi className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('pool') || name.includes('swimming')) return <FaSwimmingPool className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('gym') || name.includes('fitness')) return <FaDumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('parking')) return <FaParking className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('ac') || name.includes('air conditioning')) return <FaSnowflake className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('pet') || name.includes('dog')) return <FaDog className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('security') || name.includes('guard')) return <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('elevator') || name.includes('lift')) return <FaArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('tv') || name.includes('television')) return <FaTv className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('kitchen') || name.includes('restaurant')) return <FaUtensils className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          return <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                        };

                        // Format amenity name (convert "shared-pool" to "Shared Pool")
                        const amenityName = amenity
                          .split('-')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');

                        return (
                          <div
                            key={idx}
                            className="
                              flex items-center gap-2 sm:gap-3
                              bg-white/40
                              px-2 sm:px-3
                              h-10 sm:h-10
                              rounded-[5px]
                              shadow-sm
                              backdrop-blur-md
                            "
                          >
                            {/* Icon */}
                            {getAmenityIcon(amenity)}
                            {/* Text */}
                            <p className="font-semibold text-[#001730] text-xs sm:text-sm whitespace-nowrap truncate w-full" title={amenityName}>
                              {amenityName}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <h1 className="text-2xl lg:text-3xl font-bold text-[#001730]">Project</h1>
            )}
          </div>
        </div>
            </section>

<section className="w-full  bg-[#F5F7FA]">


<div className="flex items-center bg-[#F5F7FA] gap-4  mt-5">
          {/* Label on left */}
          {/* <div className="text-gray-400 text-sm font-medium whitespace-nowrap">
            {viewMode === "properties" ? "Viewing properties" : "Viewing agents"}
          </div> */}

          {/* Center line */}
          <div className="flex-1 h-[1px] bg-gray-300 hidden sm:block"></div>

          {/* Properties / Agents buttons (glass style) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("properties")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-all
                ${
                  viewMode === "properties"
                    ? "border border-white/40 backdrop-blur-md bg-[#e3e2d8]/40 text-[#001730] shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                    : "text-gray-600"
                }`}
            >
              <FaHome size={14} />
              <span>Properties</span>
            </button>

            {/* Divider */}
            <div className="h-4 w-[1px] bg-gray-300 mx-0.5 hidden sm:block"></div>

            <button
              onClick={() => setViewMode("agents")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-all
                ${
                  viewMode === "agents"
                    ? "border border-white/40 backdrop-blur-md bg-[#e3e2d8]/40 text-[#001730] shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                    : "text-gray-600"
                }`}
            >
              <FaUser size={14} />
              <span>Agents</span>
            </button>
          </div>
        </div>


  {/* 🔹 CONTENT GRID */}
  <div className="w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
    {/* ================= LEFT SECTION ================= */}
    <div className="lg:col-span-6">
      {/* TOP SPECS */}

  

      {/* Description box */}
      <div className="bg-[#F5F7FA] p-4 sm:p-6 rounded-[5px] shadow mb-4">
  <div className="flex gap-2 sm:gap-4 mb-4">
    {[
      { key: "overview", label: "Overview" },
      { key: "gallery", label: "Gallery" },
      { key: "document", label: "Document" },
      { key: "area", label: "Area" },
      { key: "360view", label: "360 view" },
    ].map((tab) => (
      <button
        key={tab.key}
        onClick={() => setActiveTab(tab.key)}
        className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-[5px] shadow text-[10px] sm:text-sm font-semibold transition-all ${
          activeTab === tab.key
            ? "bg-[#F5F7FA] text-[#001730]"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        {tab.label}
        {activeTab === tab.key ? (
          <FaChevronDown size={12} />
        ) : (
          <FaChevronUp size={12} />
        )}
      </button>
    ))}
  </div>

  {project && (
    <>
      {activeTab === "overview" && (
        <div 
          className="project-description text-gray-600 text-xs sm:text-sm mx-4 sm:mx-10 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ 
            __html: cleanHtmlDescriptionRegex(project.descriptionEn || "No description available")
          }}
        />
      )}

      {activeTab === "gallery" && (
        <div className="mx-4 sm:mx-10 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {project.gallery?.map((image, index) => (
              <div key={index} className="relative w-full h-44 rounded-md overflow-hidden">
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "document" && (
        <div className="mx-4 sm:mx-10 mb-4 space-y-3">
          {project.documents?.map((doc, index) => (
            <a
              key={index}
              href={doc}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-xs sm:text-sm"
            >
              Document {index + 1}
              <FaArrowRight size={12} />
            </a>
          ))}
        </div>
      )}

      {activeTab === "area" && (
        <div className="mx-4 sm:mx-10 mb-4 text-xs sm:text-sm">
          <h3 className="text-sm sm:text-base font-semibold text-[#001730] mb-2">
            About {project.area?.nameEn}
          </h3>
          <div 
            className="project-description text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: cleanHtmlDescriptionRegex(project.area?.descriptionEn || "")
            }}
          />
        </div>
      )}

      {activeTab === "360view" && (
        <div className="mx-4 sm:mx-10 mb-4">
          <div className="relative w-full h-[380px] sm:h-[450px] md:h-[520px] rounded-[5px] overflow-hidden bg-gray-100 shadow-lg">
            {project.virtualTourUrl ? (
              <iframe
                src={project.virtualTourUrl}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs sm:text-sm text-gray-500">
                360° virtual tour will be available here
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-[90%] h-[0.2px] mx-4 sm:mx-10 mt-2 bg-gray-400 mb-3"></div>

      <div className="grid grid-cols-3 mx-4 sm:mx-10 pt-4 mt-4">
        {[
          {
            title: "Average Price",
            value: project.startingPrice
              ? `QAR ${project.startingPrice.toLocaleString()}`
              : "N/A",
          },
          {
            title: "Owned by",
            value: project.projectOwnership || "Al-Asmakh",
          },
          {
            title: "Project Id",
            value: project.projectReference || project.id || "N/A",
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`flex flex-col pl-2 sm:pl-4 ${
              i !== 2 ? "border-r border-gray-400" : ""
            }`}
          >
            <p className="text-gray-500 text-[10px] sm:text-xs">
              {item.title}
            </p>
            <h3 className="text-[#001730] text-sm sm:text-base font-semibold mt-1">
              {item.value}
            </h3>
          </div>
        ))}
      </div>
    </>
  )}
</div>

      {/* Pricing and Terms Section */}
      {/* {project && (
        <div className="bg-[#F5F7FA] p-4 sm:p-6 rounded-[5px] shadow mb-4 mt-4 sm:mt-6">
          <p className="text-gray-700 text-sm md:text-base">
            {project.startingPrice ? (
              <>
                Starting from: QAR {project.startingPrice.toLocaleString()} (Terms and conditions apply)
                {project.freeMonth && " | 1 Month Free (at the End of the Contract)"}
                {project.utilitiesIncluded && " | Utilities & AC Included"}
                {project.commission && " | Commission"}
              </>
            ) : (
              "Pricing information available upon request"
            )}
          </p>
        </div>
      )} */}

      {/* Map Section */}
      {project && (
        <div className="mt-4 sm:mt-6 bg-[#F5F7FA] rounded-[5px] shadow p-0 h-[250px] sm:h-[300px] overflow-hidden mb-4">
          <iframe
            src={(() => {
              // Build location string from project location levels
              const locationParts = [
                project.locationLevel1,
                project.locationLevel2,
                project.locationLevel3
              ].filter(Boolean);
              
              // If we have location, use it; otherwise default to Qatar
              const locationQuery = locationParts.length > 0 
                ? encodeURIComponent(locationParts.join(', ') + ', Qatar')
                : encodeURIComponent('Doha, Qatar');
              
              // Use Google Maps embed with search query
              return `https://www.google.com/maps?q=${locationQuery}&output=embed&hl=en&key=${GOOGLE_MAPS_API_KEY}`;
            })()}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      )}

      {/* Bottom info strip */}
      {/* {project && (
        <div className="bg-gray-100 p-3 sm:p-4 mt-4 shadow-lg rounded-[5px]">
          <div className="grid grid-cols-[1.5fr_2fr_0.8fr] gap-3 sm:gap-4">
            <div className="bg-[#F5F7FA] p-3 sm:p-4 rounded-[5px] shadow text-xs sm:text-sm">
              <p className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-semibold text-[#001730]">Project ID:</span>
                <span className="mt-1 sm:mt-0 sm:ml-1">{project.projectReference || project.id || "N/A"}</span>
              </p>
            </div>

            <div className="bg-[#F5F7FA] p-3 sm:p-4 rounded-[5px] shadow text-xs sm:text-sm">
              <p className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-semibold text-[#001730]">Project Type:</span>
                <span className="mt-1 sm:mt-0 sm:ml-1">{project.projectType ? project.projectType.charAt(0).toUpperCase() + project.projectType.slice(1) : "N/A"}</span>
              </p>
            </div>

            <div className="bg-[#F5F7FA] p-3 sm:p-4 rounded-[5px] shadow text-xs sm:text-sm">
  <p className="flex flex-col">
    <span className="font-semibold text-[#001730]">Owned by:</span>
    <span className="mt-1">
      {project.projectOwnership || "Al-Asmakh"}
    </span>
  </p>
</div>
          </div>
        </div>
      )} */}
    </div>

  


    {/* ================= RIGHT SECTION ================= */}
    <div className="lg:col-span-6">
      <div className="lg:sticky lg:top-10 relative">
        {/* Navigation Bar - match PropertyListView glass design */}
    

        {viewMode === "properties" ? (
          <>
            {/* <h2
              className="text-[#001730] uppercase mb-2 mt-0 lg:mb-2 text-center whitespace-nowrap relative z-10"
              style={{
                fontSize: "clamp(16px, 4vw, 24px)"
              }}
            >
              Exclusive properties in {project?.nameEn || project?.name || "this project"}
            </h2> */}

        {/* 🔹 PROPERTY LIST */}
        {loading && !propertiesLoadedFromProject ? (
          <div className="text-gray-500 relative z-10 text-sm">Loading properties...</div>
        ) : error ? (
          <div className="text-red-500 relative z-10 text-sm">{error}</div>
        ) : (properties && Array.isArray(properties) && properties.length > 0) ? (
          <div className="space-y-3 relative z-10">
            {/* Show first 4 properties, then show remaining if more than 4 */}
            {properties.slice(0, 4).map((property) => {
              // Handle nested property structure - check all possible locations
              const prop = property.property || property;
              
              // Build location string
              const locationParts = [
                prop.locationLevel2,
                prop.locationLevel3,
                prop.locationLevel4
              ].filter(Boolean);
              const location = locationParts.length > 0 
                ? locationParts.join(' – ') 
                : prop.locationLevel1 || 'Doha';

              // Handle area - could be number, string, or object
              let areaDisplay = 'N/A';
              if (prop.area) {
                if (typeof prop.area === 'number') {
                  areaDisplay = `${prop.area} sqft`;
                } else if (typeof prop.area === 'string') {
                  areaDisplay = `${prop.area} sqft`;
                } else if (typeof prop.area === 'object' && prop.area.value) {
                  areaDisplay = `${prop.area.value} sqft`;
                } else if (typeof prop.area === 'object' && prop.area.area) {
                  areaDisplay = `${prop.area.area} sqft`;
                }
              } else if (prop.areaSqft) {
                areaDisplay = typeof prop.areaSqft === 'number' 
                  ? `${prop.areaSqft} sqft` 
                  : `${prop.areaSqft} sqft`;
              }

              // Process images - check at all possible nested levels
              let imagesArray = [];
              if (prop.images && Array.isArray(prop.images)) {
                imagesArray = prop.images;
              } else if (property.images && Array.isArray(property.images)) {
                imagesArray = property.images;
              } else if (property.property && property.property.images && Array.isArray(property.property.images)) {
                imagesArray = property.property.images;
              }
              
              // Get main image - prioritize images array, then coverPicture, then gallery, then fallback
              let mainImage = FALLBACK_PROPERTY_IMAGE;
              
              if (imagesArray && imagesArray.length > 0) {
                // Filter out invalid images and sort by order field
                const validImages = imagesArray.filter(img => img && (img.url || img.thumbnailUrl));
                
                if (validImages.length > 0) {
                  // Sort images by order field (if order exists, otherwise use index)
                  const sortedImages = [...validImages].sort((a, b) => {
                    const orderA = a.order !== undefined && a.order !== null ? a.order : 0;
                    const orderB = b.order !== undefined && b.order !== null ? b.order : 0;
                    return orderA - orderB;
                  });
                  
                  // Get first image (order 0 or index 0) as main image
                  const firstImage = sortedImages.find(img => {
                    const order = img.order !== undefined && img.order !== null ? img.order : 0;
                    return order === 0;
                  }) || sortedImages[0];
                  
                  if (firstImage && (firstImage.url || firstImage.thumbnailUrl)) {
                    mainImage = getSafeImage(firstImage.url || firstImage.thumbnailUrl);
                  }
                }
              }
              
              // Fallback to coverPicture, gallery, or imageUrl if images array didn't work
              if (mainImage === FALLBACK_PROPERTY_IMAGE) {
                mainImage = getSafeImage(
                  prop.coverPicture || property.coverPicture || 
                  prop.gallery?.[0] || property.gallery?.[0] || 
                  prop.imageUrl || property.imageUrl
                );
              }
              
              // Get additional images (order > 0) for thumbnails
              let additionalImages = [];
              if (imagesArray && imagesArray.length > 0) {
                const validImages = imagesArray.filter(img => img && (img.url || img.thumbnailUrl));
                if (validImages.length > 0) {
                  const sortedImages = [...validImages].sort((a, b) => {
                    const orderA = a.order !== undefined && a.order !== null ? a.order : 0;
                    const orderB = b.order !== undefined && b.order !== null ? b.order : 0;
                    return orderA - orderB;
                  });
                  
                  additionalImages = sortedImages.filter((img, idx) => {
                    const order = img.order !== undefined && img.order !== null ? img.order : idx;
                    return order > 0;
                  }).slice(0, 3);
                }
              }

              return (
                <div
                  key={prop.id || prop.propertyId || property.id || property.propertyId}
                  className="bg-[#E9E9E9] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image Section */}
                    <div className="relative w-full sm:w-[260px] h-[200px] sm:h-auto flex-shrink-0">
                      <Image
                        src={getSafeImage(mainImage)}
                        alt={prop.titleEn || prop.title || "Property"}
                        fill
                        className="object-cover"
                        unoptimized={getSafeImage(mainImage).startsWith('http')}
                        onError={handleImageErrorOnce}
                      />
                      {/* Share Button Overlay */}
                      <div className="absolute bottom-2 right-2 z-10">
                        <ShareButton
                          propertyTitle={prop.titleEn || prop.title || "Property"}
                          propertyLocation={location}
                          propertyUrl={typeof window !== 'undefined' ? window.location.href : ''}
                        />
                      </div>
                      {/* Additional Property Images (starting from order > 0) */}
                      {additionalImages.length > 0 && (
                        <div className="absolute top-2 right-2 flex gap-1 z-10 flex-wrap max-w-[140px]">
                          {additionalImages.map((img, idx) => {
                            const imgUrl = getSafeImage(img.url || img.thumbnailUrl);
                            return (
                              <div key={img.id || idx} className="relative w-12 h-12 rounded-md overflow-hidden border-2 border-white shadow-md">
                                <Image
                                  src={imgUrl}
                                  alt={`${prop.titleEn || prop.title || "Property"} image ${idx + 2}`}
                                  fill
                                  className="object-cover"
                                  unoptimized={imgUrl.startsWith('http')}
                                  onError={handleImageErrorOnce}
                                />
                              </div>
                            );
                          })}
                          {(imagesArray && imagesArray.length > additionalImages.length + 1) && (
                            <div className="relative w-12 h-12 rounded-md overflow-hidden border-2 border-white shadow-md bg-black/50 flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">+{imagesArray.length - additionalImages.length - 1}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#001730] mb-2 line-clamp-2">
                          {prop.titleEn || prop.title || "Property"}
                        </h3>

                        <div className="flex items-center text-[#001730] text-xs sm:text-sm mb-3">
                          <MapPin size={12} className="mr-1.5 flex-shrink-0" />
                          <span className="truncate">{location}</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-[#001730] text-xs sm:text-sm mb-4">
                          {/* Beds */}
                          <div className="flex items-center justify-center gap-1.5 bg-gray-50 shadow-sm p-2 rounded-md">
                            <FaBed className="w-4 h-4 flex-shrink-0 text-[#001730]" />
                            <span className="font-medium">{prop.bedrooms || '0'}</span>
                          </div>

                          {/* Baths */}
                          <div className="flex items-center justify-center gap-1.5 bg-gray-50 shadow-sm p-2 rounded-md">
                            <FaBath className="w-4 h-4 flex-shrink-0 text-[#001730]" />
                            <span className="font-medium">{prop.bathrooms || '0'}</span>
                          </div>

                          {/* Area */}
                          <div className="flex items-center justify-center gap-1.5 bg-gray-50 shadow-sm p-2 rounded-md">
                            <FaRulerCombined className="w-4 h-4 flex-shrink-0 text-[#001730]" />
                            <span className="font-medium truncate text-xs">{areaDisplay}</span>
                          </div>
                        </div>
                        
                        <div className="w-full h-[0.5px] bg-gray-300 my-3"></div>
                      </div>
                      
                      <div className="flex items-center justify-between gap-3 mt-2">
                        <p className="text-base sm:text-lg font-bold text-[#001730]">
                          {prop.priceAmount ? prop.priceAmount.toLocaleString() : '0'} QAR
                        </p>
                        <Link href={`/propertydetails?id=${prop.id || prop.propertyId}`}>
                          <button className="bg-[#001730] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2 shadow-lg transition-all duration-300 hover:bg-[#002d52] whitespace-nowrap">
                            <span>Details</span>
                            <FaArrowRight size={12} />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 relative z-10">
            <p className="text-gray-500 mb-2">No properties available</p>
            <p className="text-gray-400 text-sm">
              {!properties || properties === null || properties === undefined
                ? "Loading properties..." 
                : Array.isArray(properties) && properties.length === 0
                ? "No properties found in this project"
                : "Properties data not available"}
            </p>
          </div>
        )}

            {/* Remaining Properties Section */}
            {properties.length > 4 && (
              <>
                <div className="mt-6 mb-4 relative z-10">
                  <h3 className="text-[#001730] text-lg font-semibold mb-4">
                    Remaining Properties ({properties.length - 4})
                  </h3>
                </div>
                <div className="space-y-3 relative z-10">
                  {properties.slice(4).map((property) => {
                    const prop = property.property || property;
                    const locationParts = [
                      prop.locationLevel2,
                      prop.locationLevel3,
                      prop.locationLevel4
                    ].filter(Boolean);
                    const location = locationParts.length > 0 
                      ? locationParts.join(' – ') 
                      : prop.locationLevel1 || 'Doha';

                    let areaDisplay = 'N/A';
                    if (prop.area) {
                      if (typeof prop.area === 'number') {
                        areaDisplay = `${prop.area} sqft`;
                      } else if (typeof prop.area === 'string') {
                        areaDisplay = `${prop.area} sqft`;
                      } else if (typeof prop.area === 'object' && prop.area.value) {
                        areaDisplay = `${prop.area.value} sqft`;
                      }
                    } else if (prop.areaSqft) {
                      areaDisplay = typeof prop.areaSqft === 'number' 
                        ? `${prop.areaSqft} sqft` 
                        : `${prop.areaSqft} sqft`;
                    }

                    let mainImage = FALLBACK_PROPERTY_IMAGE;
                    if (prop.images && Array.isArray(prop.images) && prop.images.length > 0) {
                      const validImages = prop.images.filter(img => img && (img.url || img.thumbnailUrl));
                      if (validImages.length > 0) {
                        mainImage = getSafeImage(validImages[0].url || validImages[0].thumbnailUrl);
                      }
                    }
                    if (mainImage === FALLBACK_PROPERTY_IMAGE) {
                      mainImage = getSafeImage(
                        prop.coverPicture || prop.gallery?.[0] || prop.imageUrl
                      );
                    }

                    return (
                      <div
                        key={prop.id || prop.propertyId || property.id || property.propertyId}
                        className="bg-[#E9E9E9] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative w-full sm:w-[260px] h-[200px] sm:h-auto flex-shrink-0">
                            <Image
                              src={getSafeImage(mainImage)}
                              alt={prop.titleEn || prop.title || "Property"}
                              fill
                              className="object-cover"
                              unoptimized={getSafeImage(mainImage).startsWith('http')}
                              onError={handleImageErrorOnce}
                            />
                            <div className="absolute bottom-2 right-2 z-10">
                              <ShareButton
                                propertyTitle={prop.titleEn || prop.title || "Property"}
                                propertyLocation={location}
                                propertyUrl={typeof window !== 'undefined' ? window.location.href : ''}
                              />
                            </div>
                          </div>
                          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                            <div>
                              <h3 className="text-base sm:text-lg font-bold text-[#001730] mb-2 line-clamp-2">
                                {prop.titleEn || prop.title || "Property"}
                              </h3>
                              <div className="flex items-center text-[#001730] text-xs sm:text-sm mb-3">
                                <MapPin size={12} className="mr-1.5 flex-shrink-0" />
                                <span className="truncate">{location}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-[#001730] text-xs sm:text-sm mb-4">
                                <div className="flex items-center justify-center gap-1.5 bg-gray-50 shadow-sm p-2 rounded-md">
                                  <Image src="/Icon (1).png" alt="Beds" width={14} height={14} className="w-4 h-4 flex-shrink-0" />
                                  <span className="font-medium">{prop.bedrooms || '0'}</span>
                                </div>
                                <div className="flex items-center justify-center gap-1.5 bg-gray-50 shadow-sm p-2 rounded-md">
                                  <Image src="/Icon.png" alt="Baths" width={14} height={14} className="w-4 h-4 flex-shrink-0" />
                                  <span className="font-medium">{prop.bathrooms || '0'}</span>
                                </div>
                                <div className="flex items-center justify-center gap-1.5 bg-gray-50 shadow-sm p-2 rounded-md">
                                  <Image src="/Icon (2).png" alt="Area" width={14} height={14} className="w-4 h-4 flex-shrink-0" />
                                  <span className="font-medium truncate text-xs">{areaDisplay}</span>
                                </div>
                              </div>
                              <div className="w-full h-[0.5px] bg-gray-300 my-3"></div>
                            </div>
                            <div className="flex items-center justify-between gap-3 mt-2">
                              <p className="text-base sm:text-lg font-bold text-[#001730]">
                                {prop.priceAmount ? prop.priceAmount.toLocaleString() : '0'} QAR
                              </p>
                              <Link href={`/propertydetails?id=${prop.id || prop.propertyId}`}>
                                <button className="bg-[#001730] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2 shadow-lg transition-all duration-300 hover:bg-[#002d52] whitespace-nowrap">
                                  <span>Details</span>
                                  <FaArrowRight size={12} />
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            
            {/* View All Button - Show if there are many properties */}
            {totalProperties > properties.length && (
              <div className="mt-6 relative z-10">
                <Link href={`/listings?projectId=${projectId}`}>
                  <button className="bg-[#001730] text-white text-sm font-medium px-6 py-3 rounded-md flex items-center justify-center gap-2 w-full shadow-lg transition-all duration-300 hover:bg-[#002d52]">
                    <span>View All Properties ({totalProperties})</span>
                    <FaArrowRight size={14} />
                  </button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="bg-[#F5F7FA] p-6 rounded-md shadow">
            {/* <h2
              className="text-[#001730] uppercase mb-2 lg:mb-2 text-center whitespace-nowrap"
              style={{
                fontSize: "clamp(16px, 4vw, 24px)"
              }}
            >
              Agents for {project?.nameEn || project?.name || "this project"}
            </h2> */}
            {agents && Array.isArray(agents) && agents.length > 0 ? (
              <div className="space-y-4">
                {agents.map((agent, index) => {
                  // Handle different agent data structures
                  let agentData = agent;
                  
                  // Check if agent is nested in 'agent' field
                  if (agent && typeof agent === 'object' && agent.agent && typeof agent.agent === 'object') {
                    agentData = agent.agent;
                  }
                  
                  // Skip invalid agents
                  if (!agentData || typeof agentData !== 'object') {
                    console.warn("Invalid agent at index", index, agent);
                    return null;
                  }
                  
                  // Extract agent information with fallbacks
                  const agentName = agentData.name || 
                                   agentData.fullName || 
                                   `${agentData.firstName || ''} ${agentData.lastName || ''}`.trim() ||
                                   agentData.firstName || 
                                   `Agent ${index + 1}`;
                  const agentEmail = agentData.email || '';
                  const agentPhone = agentData.phone || agentData.mobile || agentData.whatsappPhone || '';
                  const agentImage = getSafeImage(
                    agentData.profilePicture || 
                    agentData.profileImage || 
                    agentData.image || 
                    agentData.publicProfile?.imageVariants?.medium?.default
                  );
                  
                  return (
                    <div
                      key={agentData.id || agentData._id || agentData.userId || agent?.id || agent?._id || `agent-${index}`}
                      className="bg-[#E9E9E9] rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow p-4"
                    >
                      <div className="flex items-center gap-4">
                        {/* Agent Image */}
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={agentImage}
                            alt={agentName}
                            fill
                            className="object-cover rounded-full"
                            unoptimized={agentImage.startsWith('http')}
                            onError={handleImageErrorOnce}
                          />
                        </div>
                        
                        {/* Agent Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#001730] mb-1">
                            {agentName}
                          </h3>
                          {agentEmail && (
                            <p className="text-sm text-gray-600 mb-1">
                              {agentEmail}
                            </p>
                          )}
                          {agentPhone && (
                            <p className="text-sm text-gray-600">
                              {agentPhone}
                            </p>
                          )}
                          {!agentEmail && !agentPhone && (
                            <p className="text-sm text-gray-400 italic">
                              Contact information not available
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">No agents assigned to this project.</p>
                <p className="text-gray-400 text-sm">
                  {!agents || agents === null || agents === undefined
                    ? "Loading agents..." 
                    : Array.isArray(agents) && agents.length === 0
                    ? "No agents found in response"
                    : "Agents data not available"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
</section>

{/* Related Projects Section */}
{/* Related Projects Section */}
<section className="w-full bg-white py-12">
  <div className="max-w-[2800px] mx-auto px-4">
    <div className="mb-8 text-center">
      <h2
        className="text-[#001730] uppercase mb-2 lg:mb-2 text-center whitespace-nowrap"
        style={{
          fontSize: "clamp(16px, 4vw, 24px)"
        }}
      >
        RELATED PROJECTS
      </h2>
      <div className="flex-1 h-[0.5px] bg-gray-300 my-2 lg:my-2 mx-auto w-[60%] md:w-[40%] lg:w-[20%]"></div>
      <p className="text-gray-600 text-sm sm:text-base mt-4">
        Discover similar properties that might interest you in the same area or with comparable features.
      </p>
    </div>

    {relatedProjectsLoading ? (
      <div className="text-center py-10">
        <p className="text-gray-500">Loading related projects...</p>
      </div>
    ) : relatedProjects.length > 0 ? (
      <div className="">
                  <PropertyListDev properties={relatedProjects} viewMode="LIST" />

      </div>
    ) : (
      <div className="text-center py-10">
        <p className="text-gray-500">No related projects found.</p>
      </div>
    )}
  </div>
</section>
        

       

            <DreamPropertySection />

            {/* Gallery Modal */}
            {galleryModalOpen && project && project.gallery && project.gallery.length > 0 && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                onClick={() => setGalleryModalOpen(false)}
              >
                {/* Close Button */}
                <button
                  onClick={() => setGalleryModalOpen(false)}
                  className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Previous Button */}
                {selectedImageIndex > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(selectedImageIndex - 1);
                    }}
                    className="absolute left-4 z-10 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3"
                    aria-label="Previous image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}

                {/* Next Button */}
                {selectedImageIndex < project.gallery.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(selectedImageIndex + 1);
                    }}
                    className="absolute right-4 z-10 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3"
                    aria-label="Next image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}

                {/* Image Container */}
                <div
                  className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4 flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={project.gallery[selectedImageIndex]}
                    alt={`Gallery image ${selectedImageIndex + 1}`}
                    width={1920}
                    height={1080}
                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                    unoptimized={project.gallery[selectedImageIndex]?.startsWith('http')}
                    priority
                  />
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                  {selectedImageIndex + 1} / {project.gallery.length}
                </div>
              </div>
            )}
        </div>
    );
}
