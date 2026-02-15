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
import MoreFiltersModal from "../../../components/MoreFiltersModal";
import { FaArrowRight, FaChevronUp, FaChevronDown, FaBath } from "react-icons/fa6";
import { FaHome, FaUser, FaWifi, FaSwimmingPool, FaDumbbell, FaParking, FaSnowflake, FaDog, FaShieldAlt, FaTv, FaUtensils, FaArrowUp, FaBuilding, FaBed, FaRegSquare, FaCar, FaCouch } from "react-icons/fa";
import ShareButton from "@/components/ShareButton";
import Link from "next/link";
import Header from "../../../components/Header";
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
    const [activeTab, setActiveTab] = useState("overview"); // overview, gallery, document, nearby, 360view
    const [viewMode, setViewMode] = useState("properties"); // properties or agents
    const [agents, setAgents] = useState([]);
    const [propertiesLoadedFromProject, setPropertiesLoadedFromProject] = useState(false);
    const [relatedProjects, setRelatedProjects] = useState([]);
    const [relatedProjectsLoading, setRelatedProjectsLoading] = useState(false);
    const [heroImageSrc, setHeroImageSrc] = useState("/images_pages/listings.png");
    const [imageError, setImageError] = useState(false);

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
                    const projectData = await fetchProjectById(projectId);
                    
                    // Response structure: { project, properties, projectAssignedAgentsList, listingsCount, area, ... }
                    // Set project info
                    const projectInfo = projectData.project || projectData;
                    setProject(projectInfo);
                    
                    // Extract properties from response
                    if (projectData.properties && Array.isArray(projectData.properties)) {
                        // Handle nested structure: properties array with {property: {...}} objects
                        let propertiesList = projectData.properties;
                        if (propertiesList.length > 0 && propertiesList[0].property) {
                            propertiesList = propertiesList.map(item => item.property || item);
                        }
                        setProperties(propertiesList);
                        setTotalProperties(projectData.listingsCount || propertiesList.length || 0);
                        setLoading(false);
                        setPropertiesLoadedFromProject(true);
                    }
                    
                    // Extract agents from response
                    if (projectData.projectAssignedAgentsList && Array.isArray(projectData.projectAssignedAgentsList) && projectData.projectAssignedAgentsList.length > 0) {
                        setAgents(projectData.projectAssignedAgentsList);
                    } else if (projectData.projectAssignedAgents && typeof projectData.projectAssignedAgents === 'object' && Object.keys(projectData.projectAssignedAgents).length > 0) {
                        // Convert object to array
                        setAgents(Object.values(projectData.projectAssignedAgents));
                    }
                } catch (err) {
                    console.error("Error loading project:", err);
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
                <div className="absolute inset-0 bg-black/40 z-10"></div>

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
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#001730] mb-3 sm:mb-4 px-10 lg:px-0">
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
  <div className="max-w-[2400px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
    {/* ================= LEFT SECTION ================= */}
    <div className="lg:col-span-7">
      {/* TOP SPECS */}
      {project && (
        <div className="bg-gray-100 p-3 sm:p-4 shadow-lg rounded-[5px] mb-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {/* Year Of Completion */}
            <div
              className="
                flex items-center gap-2 sm:gap-3
                bg-white
                px-2 sm:px-3
                h-12 sm:h-14
                rounded-[5px]
                shadow-sm
              "
            >
              <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
              <p
                className="
                  font-semibold text-[#001730]
                  text-xs sm:text-sm
                  whitespace-nowrap
                  truncate
                  w-full
                "
                title={project?.projectCompletionDate ? new Date(project.projectCompletionDate).getFullYear() : project?.deliveryDate ? new Date(project.deliveryDate).getFullYear() : 'N/A'}
              >
               Year of completion: {project?.projectCompletionDate ? new Date(project.projectCompletionDate).getFullYear() : project?.deliveryDate ? new Date(project.deliveryDate).getFullYear() : 'N/A'}
              </p>
            </div>

            {/* Project Type */}
            <div
              className="
                flex items-center gap-2 sm:gap-3
                bg-white
                px-2 sm:px-3
                h-12 sm:h-14
                rounded-[5px]
                shadow-sm
              "
            >
              <FaHome className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
              <p
                className="
                  font-semibold text-[#001730]
                  text-xs sm:text-sm
                  whitespace-nowrap
                  truncate
                  w-full
                "
                title={project?.projectType || 'N/A'}
              >
                Project type: 
                {project?.projectType || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Description box */}
      <div className="bg-[#F5F7FA] p-4 sm:p-6 rounded-[5px] shadow mb-4">
        <div className="flex gap-2 sm:gap-4 mb-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-[5px] shadow text-xs sm:text-base font-semibold transition-all ${
              activeTab === "overview"
                ? "bg-[#F5F7FA] text-[#001730]"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            Overview
            {activeTab === "overview" ? (
              <FaChevronDown size={14} />
            ) : (
              <FaChevronUp size={14} />
            )}
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-[5px] shadow text-xs sm:text-base font-semibold transition-all ${
              activeTab === "gallery"
                ? "bg-[#F5F7FA] text-[#001730]"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            Gallery
            {activeTab === "gallery" ? (
              <FaChevronDown size={14} />
            ) : (
              <FaChevronUp size={14} />
            )}
          </button>
          <button
            onClick={() => setActiveTab("document")}
            className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-[5px] shadow text-xs sm:text-base font-semibold transition-all ${
              activeTab === "document"
                ? "bg-[#F5F7FA] text-[#001730]"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            Document
            {activeTab === "document" ? (
              <FaChevronDown size={14} />
            ) : (
              <FaChevronUp size={14} />
            )}
          </button>
          <button
            onClick={() => setActiveTab("nearby")}
            className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-[5px] shadow text-xs sm:text-base font-semibold transition-all ${
              activeTab === "nearby"
                ? "bg-[#F5F7FA] text-[#001730]"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            Nearby
            {activeTab === "nearby" ? (
              <FaChevronDown size={14} />
            ) : (
              <FaChevronUp size={14} />
            )}
          </button>
          <button
            onClick={() => setActiveTab("360view")}
            className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-[5px] shadow text-xs sm:text-base font-semibold transition-all ${
              activeTab === "360view"
                ? "bg-[#F5F7FA] text-[#001730]"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            360 view
            {activeTab === "360view" ? (
              <FaChevronDown size={14} />
            ) : (
              <FaChevronUp size={14} />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {projectLoading ? (
          <div className="text-gray-500">Loading project details...</div>
        ) : project ? (
          <>
            {activeTab === "overview" && (
              <>
                {project.descriptionEn || project.description ? (
                  <div className="text-gray-600 text-sm sm:text-base mx-4 sm:mx-10 leading-relaxed mb-4">
                    {(() => {
                      // Function to strip HTML tags and format list items
                      const formatDescription = (text) => {
                        if (!text) return '';
                        
                        // Remove <ul> and </ul> tags
                        let formatted = text.replace(/<\/?ul>/gi, '');
                        
                        // Replace <li> with bullet point and </li> with line break
                        formatted = formatted.replace(/<li>/gi, '• ');
                        formatted = formatted.replace(/<\/li>/gi, '\n');
                        
                        // Remove any remaining HTML tags
                        formatted = formatted.replace(/<[^>]*>/g, '');
                        
                        // Decode HTML entities
                        formatted = formatted
                          .replace(/&nbsp;/g, ' ')
                          .replace(/&amp;/g, '&')
                          .replace(/&lt;/g, '<')
                          .replace(/&gt;/g, '>')
                          .replace(/&quot;/g, '"')
                          .replace(/&#39;/g, "'");
                        
                        // Split by line breaks and filter empty lines
                        const lines = formatted.split('\n').filter(line => line.trim());
                        
                        return lines.map((line, index) => (
                          <p key={index} className="mb-2">
                            {line.trim()}
                          </p>
                        ));
                      };
                      
                      return formatDescription(project.descriptionEn || project.description || "");
                    })()}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm sm:text-base mx-4 sm:mx-10 leading-relaxed mb-4">
                    No description available for this project.
                  </p>
                )}
                {/* {project.descriptionAr && (
                  <div className="text-gray-600 text-sm sm:text-base mx-4 sm:mx-10 leading-relaxed mb-4">
                    {(() => {
                      // Function to strip HTML tags and format list items
                      const formatDescription = (text) => {
                        if (!text) return '';
                        
                        // Remove <ul> and </ul> tags
                        let formatted = text.replace(/<\/?ul>/gi, '');
                        
                        // Replace <li> with bullet point and </li> with line break
                        formatted = formatted.replace(/<li>/gi, '• ');
                        formatted = formatted.replace(/<\/li>/gi, '\n');
                        
                        // Remove any remaining HTML tags
                        formatted = formatted.replace(/<[^>]*>/g, '');
                        
                        // Decode HTML entities
                        formatted = formatted
                          .replace(/&nbsp;/g, ' ')
                          .replace(/&amp;/g, '&')
                          .replace(/&lt;/g, '<')
                          .replace(/&gt;/g, '>')
                          .replace(/&quot;/g, '"')
                          .replace(/&#39;/g, "'");
                        
                        // Split by line breaks and filter empty lines
                        const lines = formatted.split('\n').filter(line => line.trim());
                        
                        return lines.map((line, index) => (
                          <p key={index} className="mb-2">
                            {line.trim()}
                          </p>
                        ));
                      };
                      
                      return formatDescription(project.descriptionAr);
                    })()}
                  </div>
                )} */}
              </>
            )}

            {activeTab === "gallery" && (
              <div className="mx-4 sm:mx-10 mb-4">
                {project.gallery && project.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.gallery.map((image, index) => (
                      <div key={index} className="relative w-full h-48 rounded-md overflow-hidden">
                        <Image
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No gallery images available</p>
                )}
              </div>
            )}

            {activeTab === "document" && (
              <div className="mx-4 sm:mx-10 mb-4">
                {project.documents && project.documents.length > 0 ? (
                  <div className="space-y-3">
                    {project.documents.map((doc, index) => (
                      <a
                        key={index}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <span className="text-[#001730] font-medium">Document {index + 1}</span>
                        <FaArrowRight size={14} />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No documents available</p>
                )}
              </div>
            )}

            {activeTab === "nearby" && (
              <div className="mx-4 sm:mx-10 mb-4">
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Nearby amenities and locations information will be displayed here.
                </p>
              </div>
            )}

            {activeTab === "360view" && (
              <div className="mx-4 sm:mx-10 mb-4">
                <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-[5px] overflow-hidden bg-gray-100 shadow-lg">
                  {project.virtualTourUrl ? (
                    <iframe
                      src={project.virtualTourUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="fullscreen; vr"
                      allowFullScreen
                      title="360 Virtual Tour"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      <div className="text-center p-8">
                        <h3 className="text-xl sm:text-2xl font-semibold text-[#001730] mb-2">
                          360° Virtual Tour
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                          360° virtual tour will be available here
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500 mx-4 sm:mx-10">Project details not available</div>
        )}
        <div className="w-[90%] h-[0.2px] px-10 mx-4 sm:mx-10 mt-2 3xl:mt-3 bg-gray-400 mb-3 md:mb-4 3xl:mb-5"></div>
        {/* Bottom stats */}
        {project && (
          <div className="grid grid-cols-3 mx-4 sm:mx-10 pt-4 mt-4">
            {[
              { title: "Starting Price", value: project.startingPrice ? `QAR ${project.startingPrice.toLocaleString()}` : "N/A", icon: "price" },
              { title: "Project Type", value: project.projectType || "N/A", icon: "type" },
              { title: "Status", value: project.status || "N/A", icon: "status" },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex flex-col pl-2 sm:pl-4 ${i !== 2 ? "border-r border-gray-400" : ""
                  }`}
              >
                {/* TITLE + ICON SIDE BY SIDE */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {item.icon === "price" && (
                    <FaDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  )}
                  {item.icon === "type" && (
                    <FaHome className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  )}
                  {item.icon === "status" && (
                    <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  )}
                  <p className="text-gray-500 text-xs sm:text-sm">{item.title}</p>
                </div>

                {/* VALUE BELOW */}
                <h3 className="text-[#001730] text-base sm:text-xl font-semibold mt-1">
                  {item.value}
                </h3>
              </div>
            ))}
          </div>
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
              
              // Use Google Maps embed with search query (standard format, no API key needed)
              return `https://www.google.com/maps?q=${locationQuery}&output=embed&hl=en`;
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
      {project && (
        <div className="bg-gray-100 p-3 sm:p-4 mt-4 shadow-lg rounded-[5px]">
          <div className="grid grid-cols-[1.5fr_2fr_0.8fr] gap-3 sm:gap-4">
            {/* Box 1 */}
            <div className="bg-[#F5F7FA] p-3 sm:p-4 rounded-[5px] shadow text-xs sm:text-sm">
              <p className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-semibold text-[#001730]">Project ID:</span>
                <span className="mt-1 sm:mt-0 sm:ml-1">{project.projectReference || project.id || "N/A"}</span>
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-[#F5F7FA] p-3 sm:p-4 rounded-[5px] shadow text-xs sm:text-sm">
              <p className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-semibold text-[#001730]">Project Type:</span>
                <span className="mt-1 sm:mt-0 sm:ml-1">{project.projectType ? project.projectType.charAt(0).toUpperCase() + project.projectType.slice(1) : "N/A"}</span>
              </p>
            </div>

            {/* Box 3 */}
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
      )}
    </div>

  


    {/* ================= RIGHT SECTION ================= */}
    <div className="lg:col-span-5">
      <div className="lg:sticky lg:top-10 relative">
        {/* Navigation Bar - match PropertyListView glass design */}
    

        {viewMode === "properties" ? (
          <>
            <h2
              className="text-[#001730] uppercase mb-2 mt-0 lg:mb-2 text-center whitespace-nowrap relative z-10"
              style={{
                fontSize: "clamp(16px, 4vw, 24px)"
              }}
            >
              Exclusive properties in {project?.nameEn || project?.name || "this project"}
            </h2>

        {/* 🔹 PROPERTY LIST */}
        {loading ? (
          <div className="text-gray-500 relative z-10 text-sm">Loading properties...</div>
        ) : error ? (
          <div className="text-red-500 relative z-10 text-sm">{error}</div>
        ) : properties.length > 0 ? (
          <div className="space-y-3 relative z-10">
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
              let mainImage = "/div.property-thumbnail-wrapper.png";
              
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
                    mainImage = firstImage.url || firstImage.thumbnailUrl;
                  }
                }
              }
              
              // Fallback to coverPicture, gallery, or imageUrl if images array didn't work
              if (mainImage === "/div.property-thumbnail-wrapper.png") {
                mainImage = prop.coverPicture || property.coverPicture || 
                           prop.gallery?.[0] || property.gallery?.[0] || 
                           prop.imageUrl || property.imageUrl || 
                           "/div.property-thumbnail-wrapper.png";
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
                    <div className="relative w-full sm:w-[200px] h-[200px] sm:h-auto flex-shrink-0">
                      <Image
                        src={mainImage}
                        alt={prop.titleEn || prop.title || "Property"}
                        fill
                        className="object-cover"
                        unoptimized={mainImage.startsWith('http')}
                        onError={(e) => {
                          e.target.src = "/div.property-thumbnail-wrapper.png";
                        }}
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
                            const imgUrl = img.url || img.thumbnailUrl || "/div.property-thumbnail-wrapper.png";
                            return (
                              <div key={img.id || idx} className="relative w-12 h-12 rounded-md overflow-hidden border-2 border-white shadow-md">
                                <Image
                                  src={imgUrl}
                                  alt={`${prop.titleEn || prop.title || "Property"} image ${idx + 2}`}
                                  fill
                                  className="object-cover"
                                  unoptimized={imgUrl.startsWith('http')}
                                  onError={(e) => {
                                    e.target.src = "/div.property-thumbnail-wrapper.png";
                                  }}
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
                            <Image
                              src="/Icon (1).png"
                              alt="Beds"
                              width={14}
                              height={14}
                              className="w-4 h-4 flex-shrink-0"
                            />
                            <span className="font-medium">{prop.bedrooms || '0'}</span>
                          </div>

                          {/* Baths */}
                          <div className="flex items-center justify-center gap-1.5 bg-gray-50 shadow-sm p-2 rounded-md">
                            <Image
                              src="/Icon.png"
                              alt="Baths"
                              width={14}
                              height={14}
                              className="w-4 h-4 flex-shrink-0"
                            />
                            <span className="font-medium">{prop.bathrooms || '0'}</span>
                          </div>

                          {/* Area */}
                          <div className="flex items-center justify-center gap-1.5 bg-gray-50 shadow-sm p-2 rounded-md">
                            <Image
                              src="/Icon (2).png"
                              alt="Area"
                              width={14}
                              height={14}
                              className="w-4 h-4 flex-shrink-0"
                            />
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
          <div className="text-gray-500 relative z-10">No properties available</div>
        )}

            {/* View All Button */}
            {properties.length > 4 && (
              <div className="mt-6 relative z-10">
                <Link href={`/listings?projectId=${projectId}`}>
                  <button className="bg-[#001730] text-white text-sm font-medium px-6 py-3 rounded-md flex items-center justify-center gap-2 w-full shadow-lg transition-all duration-300 hover:bg-[#002d52]">
                    <span>View All</span>
                    <FaArrowRight size={14} />
                  </button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="bg-[#F5F7FA] p-6 rounded-md shadow">
            <h2
              className="text-[#001730] uppercase mb-2 lg:mb-2 text-center whitespace-nowrap"
              style={{
                fontSize: "clamp(16px, 4vw, 24px)"
              }}
            >
              Agents for {project?.nameEn || project?.name || "this project"}
            </h2>
            <div className="flex-1 h-[0.5px] bg-gray-300 my-2 lg:my-2 mx-auto w-[60%] md:w-[40%] lg:w-[20%] mb-6"></div>
            {agents && agents.length > 0 ? (
              <div className="space-y-4">
                {agents.map((agent, index) => {
                  const agentData = agent.agent || agent;
                  const agentName = agentData.name || agentData.fullName || agentData.firstName || `Agent ${index + 1}`;
                  const agentEmail = agentData.email || '';
                  const agentPhone = agentData.phone || agentData.mobile || '';
                  const agentImage = agentData.profilePicture || agentData.image || '/div.property-thumbnail-wrapper.png';
                  
                  return (
                    <div
                      key={agentData.id || agentData._id || agentData.userId || index}
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
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No agents assigned to this project.</p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
</section>

{/* Related Projects Section */}
<section className="w-full bg-[#F5F7FA] py-12">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProjects.map((relatedProject) => {
          const formattedProject = {
            id: relatedProject.id || relatedProject._id,
            title: relatedProject.nameEn || relatedProject.name || "Untitled Project",
            location: [
              relatedProject.locationLevel1,
              relatedProject.locationLevel2,
              relatedProject.locationLevel3,
              relatedProject.locationLevel4
            ].filter(Boolean).join(', '),
            year: relatedProject.projectCompletionDate 
              ? new Date(relatedProject.projectCompletionDate).getFullYear().toString()
              : (relatedProject.projectDate ? new Date(relatedProject.projectDate).getFullYear().toString() : new Date().getFullYear().toString()),
            units: relatedProject.listingsCount || relatedProject.propertiesCount || "N/A",
            status: relatedProject.projectCompletionDate 
              ? (new Date(relatedProject.projectCompletionDate) > new Date() ? "30% Ongoing" : "100% Completed")
              : "100% Completed",
            statusType: relatedProject.projectCompletionDate && new Date(relatedProject.projectCompletionDate) > new Date() ? "ongoing" : "completed",
            price: "Price on request",
            image: relatedProject.coverPicture || (relatedProject.gallery && relatedProject.gallery[0]) || "/div.property-thumbnail-wrapper.png",
          };

          return (
            <div
              key={formattedProject.id}
              className="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative">
                <Image
                  src={formattedProject.image}
                  alt={formattedProject.title}
                  width={800}
                  height={320}
                  className="w-full h-80 object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-[#8C8C8C66] text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                    {formattedProject.statusType === "completed" ? "Completed" : "Ongoing"}
                  </span>
                </div>

                {/* Title + Location Overlay */}
                <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md bg-gradient-to-b from-gray-100/20 to-gray-100 p-4">
                  <h3 className="text-lg font-semibold text-[#001730] mb-2 truncate">
                    {formattedProject.title}
                  </h3>
                  <div className="flex items-center text-[#001730] text-sm mb-2">
                    <MapPin size={12} className="mr-1" />
                    <span className="truncate">{formattedProject.location || "Location not specified"}</span>
                  </div>
                  <div className="w-[60%] h-[1px] bg-gray-500 my-2"></div>
                  <p className="text-xs text-[#001730] leading-snug line-clamp-2">
                    {relatedProject.descriptionEn || "Luxury residential towers offering stunning sea views and premium residential, commercial, and leisure facilities."}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                {/* Info Row */}
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-3">
                  {/* Year */}
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 shadow-sm rounded-md px-2 py-2">
                    <Image src="/Time.png" width={16} height={16} alt="Year" className="object-contain" />
                    <span className="text-xs font-semibold text-[#001730]">{formattedProject.year}</span>
                  </div>

                  {/* Units */}
                  <div className="flex items-center gap-2 bg-[#F5F7FA] border border-gray-200 shadow-sm rounded-md px-2 py-2">
                    <Image src="/3_Icons Used_Project Dvt 1 (1).png" width={16} height={16} alt="Units" className="object-contain" />
                    <span className="text-xs font-semibold text-[#001730]">
                      {formattedProject.units} <span className="text-xs text-gray-500">Units</span>
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col justify-center bg-[#F5F7FA] border border-gray-200 shadow-sm rounded-md px-3 py-2 w-fit">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${formattedProject.statusType === "completed" ? "bg-green-500" : "bg-yellow-500"} flex items-center justify-center`}>
                        <Check size={12} className="text-white" />
                      </div>
                      <span className="text-xs font-semibold">{formattedProject.status}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {relatedProject.amenities && relatedProject.amenities.length > 0 && (
                  <div className="p-2 shadow-md bg-gray-50 rounded-md mb-3">
                    <div className="grid grid-cols-3 gap-1">
                      {relatedProject.amenities.slice(0, 3).map((amenity, idx) => {
                        const amenityName = amenity.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                        return (
                          <div
                            key={idx}
                            className="bg-gray-300 text-white flex items-center justify-center text-center border border-gray-200 shadow-sm rounded-md h-10 text-[0.6rem] font-semibold whitespace-nowrap px-1"
                          >
                            {amenityName}
                          </div>
                        );
                      })}
                      {relatedProject.amenities.length > 3 && (
                        <div className="bg-gray-300 text-white flex items-center justify-center text-center border border-gray-200 shadow-sm rounded-md h-10 text-[0.6rem] font-semibold whitespace-nowrap">
                          +{relatedProject.amenities.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Map */}
                <Image
                  src="/div.property-thumbnail-wrapper (2).png"
                  width={800}
                  height={80}
                  className="w-full h-20 object-cover rounded-md"
                  alt="Project map"
                />
              </div>

              {/* Footer */}
              <div className="bg-gray-100 border-t border-gray-200 px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Starting at</p>
                  <p className="text-lg font-semibold text-[#001730]">{formattedProject.price}</p>
                </div>
                <Link href={`/projects/${formattedProject.id}`}>
                  <button className="bg-[#001730] text-white text-xs font-medium px-4 py-2 rounded-md flex items-center gap-2 shadow-lg transition-all duration-300 hover:bg-[#002d52]">
                    <span>Details</span>
                    <FaArrowRight size={12} />
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-10">
        <p className="text-gray-500">No related projects found.</p>
      </div>
    )}
  </div>
</section>
        

       

            <DreamPropertySection />
        </div>
    );
}
