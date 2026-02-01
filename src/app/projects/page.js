"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import MoreFiltersModal from "../../components/MoreFiltersModal";
import DreamPropertySection from "@/components/DreamPropertySection";
import { SlidersHorizontal } from "lucide-react";
import { ArrowDown } from "lucide-react";
import PropertyListView from "@/components/PropertyListView";
import { fetchProperties } from "../../utils/propertyapi";
import { searchProperties } from "../../utils/searchApi";
import ListingHeroSection from "../../components/ListingHeroSection";

export default function Sale({ priceType: initialPriceType = "rent" }) {
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [priceType, setPriceType] = useState(initialPriceType); // "rent" or "sale"
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalProperties, setTotalProperties] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState({});

    // Update priceType when prop changes
    useEffect(() => {
        setPriceType(initialPriceType);
    }, [initialPriceType]);

    // Load properties using search API or fallback to fetchProperties
    const loadProperties = useCallback(async (searchText = "", filters = {}) => {
        try {
            setLoading(true);
            setError(null);

            // Use search API if there's a search query or filters, otherwise use regular fetch
            const hasSearchOrFilters = searchText || Object.keys(filters).length > 0;

            if (hasSearchOrFilters) {
                // Use search API with all filters
                const searchFilters = {
                    q: searchText,
                    priceType: priceType,
                    status: "published",
                    page: 1,
                    limit: 50,
                    ...filters,
                };

                const result = await searchProperties(searchFilters);
                setProperties(result.properties || []);
                setTotalProperties(result.pagination?.total || result.total || 0);
            } else {
                // Use regular fetch for initial load
                const result = await fetchProperties({
                    priceType: priceType,
                    page: 1,
                    limit: 50,
                    status: "published",
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
    }, [priceType]);

    // Initial load
    useEffect(() => {
        loadProperties();
    }, [priceType]); // Only reload when priceType changes

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
    }, [loadProperties, searchQuery]);

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

                {/* Desktop Version */}
                <div className="absolute left-1/2 bottom-10 mb-[6%] transform -translate-x-1/2 translate-y-1/2 z-20 w-[70%] lg:w-[60%] hidden lg:block">
                    <div className="border border-white/10 backdrop-blur-[10px] bg-white/30 rounded-md p-4 lg:p-6 shadow-lg">
                        {/* Buttons Section */}
                        {/* <div className="flex justify-center gap-4 mb-4">
                            <button
                                onClick={() => onPriceTypeChange?.("rent")}
                                className={`px-20 py-1.5 rounded-md font-medium shadow transition ${priceType === "rent"
                                    ? "bg-[#001730] text-white"
                                    : "bg-[#0B1F3A]/40 text-white backdrop-blur-[20px] border border-white/40"
                                    }`}
                            >
                                RENT
                            </button>
                            <button
                                onClick={() => onPriceTypeChange?.("sale")}
                                className={`px-20 py-1.5 rounded-md font-medium shadow transition ${priceType === "sale"
                                    ? "bg-[#001730] text-white"
                                    : "bg-[#0B1F3A]/40 text-white backdrop-blur-[20px] border border-white/40"
                                    }`}
                            >
                                BUY
                            </button>
                        </div> */}

                        {/* Search Bar */}
                        {/* <form onSubmit={handleSearch}>
                            <div className="bg-white rounded-md shadow-lg flex items-center px-4 mx-20 py-3">
                                <button
                                    type="submit"
                                    className="p-2 bg-[#001730] rounded-md mr-2 flex items-center justify-center h-[28px] w-[28px]"
                                >
                                    <Search className="text-white h-4 w-4" />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Explore and discover everything about our trusted agents..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 text-gray-500 text-[8px] lg:text-base bg-transparent outline-none placeholder:text-[10px] lg:placeholder:text-base placeholder:text-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSpeechModal(true)}
                                    className="text-gray-500 h-5 w-5 ml-3 hover:text-[#001730] transition-colors cursor-pointer"
                                >
                                    <Mic className="h-5 w-5" />
                                </button>
                            </div>
                        </form> */}
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
            />

            <DreamPropertySection />
        </div>
    );
}
