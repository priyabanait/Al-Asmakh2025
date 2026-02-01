"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import DreamPropertySection from "@/components/DreamPropertySection";
import { SlidersHorizontal, ArrowDown, Home, MapPin, Bed, Bath } from "lucide-react";
import { FaDollarSign } from "react-icons/fa";
import PropertyListView from "@/components/PropertyListView";
import { fetchProperties } from "../../../utils/propertyapi";
import { searchProperties } from "../../../utils/searchApi";
import { fetchProjectById } from "../../../utils/projectapi";
import MoreFiltersModal from "../../../components/MoreFiltersModal";

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
                setProperties(result.properties || []);
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

                setProperties(result.properties || []);
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

    // Fetch project data
    useEffect(() => {
        const loadProject = async () => {
            if (projectId) {
                try {
                    setProjectLoading(true);
                    const projectData = await fetchProjectById(projectId);
                    setProject(projectData);
                } catch (err) {
                    console.error("Error loading project:", err);
                } finally {
                    setProjectLoading(false);
                }
            }
        };
        loadProject();
    }, [projectId]);

    // Initial load
    useEffect(() => {
        if (projectId) {
            loadProperties();
        }
    }, [priceType, projectId]); // Reload when priceType or projectId changes

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
            setProperties(results.properties || []);
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
        <div>
            {/* ---------- HERO SECTION WITH FILTERS ---------- */}

            <section className="relative w-full min-h-[85vh] lg:min-h-[85vh] flex flex-col items-center justify-center overflow-visible">
                {/* Background Image */}
                <Image
                    src="/images_pages/listings.png"
                    alt="City Skyline"
                    fill
                    className="object-cover" />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 z-10"></div>

                {/* Project Title with Glass Effect */}
                <div className="relative z-20 text-center px-4 mb-8">
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
                </div>

                {/* Filters Below Title */}
                <div className="relative z-20 w-full max-w-7xl px-4 lg:px-10">
                    <div className="flex flex-wrap w-full border border-white/20 backdrop-blur-md bg-white/20 p-4 rounded-lg shadow-lg gap-3 justify-center">
                        {["Property Type", "Location", "Beds", "Baths", "Price"].map(
                            (label, index) => {
                                const isOpen = openDropdown === label;
                                const selectedValue = selectedFilters[label];

                                return (
                                    <div
                                        key={index}
                                        ref={(el) => (dropdownRefs.current[label] = el)}
                                        className="relative flex-shrink-0"
                                        style={{ minWidth: "140px", flex: "1 1 auto" }}
                                    >
                                        <button
                                            onClick={() =>
                                                setOpenDropdown(isOpen ? null : label)
                                            }
                                            className={`w-full flex items-center justify-between bg-[#0B1F3A]/80 backdrop-blur-sm text-white px-3 py-2.5 rounded-md shadow-lg hover:bg-[#001730]/90 transition ${selectedValue ? "ring-2 ring-white/50" : ""
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                {/* Icon + Divider */}
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {getIcon(label)}
                                                    <div className="h-5 w-[1px] bg-white/40"></div>
                                                </div>

                                                {/* Label */}
                                                <span className="text-sm font-medium truncate">
                                                    {selectedValue || label}
                                                </span>
                                            </div>

                                            {/* Down Arrow */}
                                            <ArrowDown
                                                size={16}
                                                className={`opacity-80 transition-transform flex-shrink-0 ml-2 ${isOpen ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg z-50 border border-gray-200 max-h-60 overflow-y-auto min-w-full">
                                                {filterOptions[label].map((option, optIndex) => (
                                                    <button
                                                        key={optIndex}
                                                        onClick={() => handleFilterSelect(label, option)}
                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition ${selectedValue === option
                                                            ? "bg-[#001730] text-white"
                                                            : "text-gray-700"
                                                            } ${optIndex === 0 ? "rounded-t-md" : ""
                                                            } ${optIndex === filterOptions[label].length - 1
                                                                ? "rounded-b-md"
                                                                : ""
                                                            }`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                        )}

                        {/* More Filters Button */}
                        <button
                            onClick={() => setShowMoreFilters(true)}
                            className="flex text-sm items-center justify-center bg-[#0B1F3A]/80 backdrop-blur-sm text-white px-4 py-2.5 rounded-md font-medium shadow-lg hover:bg-[#001730]/90 transition flex-shrink-0"
                            style={{ minWidth: "120px" }}
                        >
                            <SlidersHorizontal size={16} className="mr-2" />
                            <span>More Filters</span>
                        </button>
                    </div>
                </div>
            </section>


            {/* Mobile Map View */}
            <div className="block lg:hidden w-full mt-[130px] relative" style={{ height: "calc(100vh - 350px)", minHeight: "60vh" }}>
                {/* Los Angeles Map */}
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423283.4355503344!2d-118.69192047499999!3d34.02016129999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                ></iframe>

                {/* Zoom Controls - Bottom Right */}
                <div className="absolute bottom-4 right-4 bg-gray-200 rounded-md shadow-lg flex flex-col z-10">
                    <button className="px-3 py-2 border-b border-gray-200 hover:bg-gray-50">
                        <span className="text-lg font-semibold">+</span>
                    </button>
                    <button className="px-3 py-2 hover:bg-gray-50">
                        <span className="text-lg font-semibold">-</span>
                    </button>
                </div>
            </div>

            {/* ---------- READY TO FIND SECTION ---------- */}
            {/* <div className="hidden lg:block w-[100%] h-[1px] bg-gray-300 my-4  px-10"></div> */}


            {/* ---------- LIST AND MAP VIEW SECTION ---------- */}
            {loading ? (
                <div className="w-full py-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#001730] mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading properties...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="w-full py-20 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500 text-lg mb-2">Error loading properties</p>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            ) : properties.length === 0 ? (
                <div className="w-full py-20 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-600 text-lg mb-2">No properties found</p>
                        <p className="text-gray-500">
                            {priceType === "rent"
                                ? "No rental properties available at the moment."
                                : "No properties for sale available at the moment."}
                        </p>
                    </div>
                </div>
            ) : (
                <PropertyListView properties={properties} totalProperties={totalProperties} />
            )}

            {/* More Filters Modal */}
            <MoreFiltersModal
                isOpen={showMoreFilters}
                onClose={() => setShowMoreFilters(false)}
                onShowResults={handleMoreFiltersSearch}
                priceType={priceType}
                projectId={projectId}
            />

            <DreamPropertySection />
        </div>
    );
}
