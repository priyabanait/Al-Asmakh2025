"use client";

import { useState, useEffect, useCallback } from "react";
import ShareButton from "./ShareButton";
import MoreFiltersModal from "./MoreFiltersModal";
import { FaArrowRight } from "react-icons/fa6";
import { FaMapLocationDot } from "react-icons/fa6";
import Link from "next/link";
import { FaList } from "react-icons/fa";
import DreamPropertySection from "./DreamPropertySection";
import PropertyListView from "./PropertyListView";
import { fetchProperties } from "../utils/propertyapi";
import { searchProperties } from "../utils/searchApi";
import { searchPropertiesWithElasticsearch, checkElasticsearchHealth } from "../utils/elasticsearchApi";
import ListingHeroSection from "./ListingHeroSection";

export default function Sale({ 
  priceType: initialPriceType = "rent",
  initialSearchQuery = "",
  initialFilters = {}
}) {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [priceType, setPriceType] = useState(initialPriceType); // "rent" or "sale"
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProperties, setTotalProperties] = useState(0);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [useElasticsearch, setUseElasticsearch] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Update priceType when prop changes
  useEffect(() => {
    setPriceType(initialPriceType);
  }, [initialPriceType]);

  // Update search query and filters when initial props change
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
    if (Object.keys(initialFilters).length > 0) {
      setActiveFilters(initialFilters);
    }
  }, [initialSearchQuery, initialFilters]);

  // Check Elasticsearch availability on mount
  useEffect(() => {
    const checkElasticsearch = async () => {
      const isAvailable = await checkElasticsearchHealth();
      setUseElasticsearch(isAvailable);
      if (isAvailable) {
        console.log('✅ Using Elasticsearch for search and filters');
      } else {
        console.log('⚠️ Elasticsearch not available, using fallback search');
      }
    };
    checkElasticsearch();
  }, []);

  // Load properties using Elasticsearch (if available) or fallback to regular search API
  const loadProperties = useCallback(async (searchText = "", filters = {}, forceSearch = false) => {
    try {
      setLoading(true);
      setError(null);

      console.log('[RentMap] loadProperties called with:', { searchText, filters, forceSearch });

      // Use search API if there's a search query, filters, or forceSearch is true
      // When forceSearch is true, always use search API even if query is empty
      const hasSearchOrFilters = (searchText && searchText.trim()) || Object.keys(filters).length > 0 || forceSearch;

      if (hasSearchOrFilters) {
        // Prepare search filters - ALWAYS use search API when there's a query
        const searchFilters = {
          q: searchText || "", // Use empty string if no query but forceSearch is true
          priceType: priceType,
          status: "published",
          page: 1,
          limit: 50,
          ...filters,
        };

        console.log('[RentMap] Calling search API with filters:', searchFilters);

        let result;
        
        // Try Elasticsearch first if available, fallback to regular search API
        if (useElasticsearch) {
          try {
            result = await searchPropertiesWithElasticsearch(searchFilters);
            // If Elasticsearch returns error, fallback to regular search
            if (result.error) {
              console.warn('Elasticsearch error, falling back to regular search:', result.error);
              result = await searchProperties(searchFilters);
            }
          } catch (esError) {
            console.warn('Elasticsearch unavailable, falling back to regular search:', esError.message);
            result = await searchProperties(searchFilters);
          }
        } else {
          // Use regular search API
          result = await searchProperties(searchFilters);
        }

        console.log('[RentMap] Search API returned:', { 
          propertiesCount: result.properties?.length || 0, 
          total: result.pagination?.total || result.total || 0 
        });

        setProperties(result.properties || []);
        setTotalProperties(result.pagination?.total || result.total || 0);
      } else {
        // Use regular fetch for initial load (only when no search query and no filters)
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
  }, [priceType, useElasticsearch]);

  // Initial load - use initial query and filters if provided from URL
  useEffect(() => {
    // If we have initial query from URL, ALWAYS use search API (don't load all properties)
    // This ensures that when user searches, only search results are shown
    if (initialSearchQuery) {
      console.log('[RentMap] Initializing with search query from URL:', { 
        query: initialSearchQuery, 
        filters: initialFilters 
      });
      setSearchQuery(initialSearchQuery);
      setActiveFilters(initialFilters);
      // Always use search API when there's a query parameter
      loadProperties(initialSearchQuery, initialFilters, true);
      setHasInitialized(true);
    } else if (Object.keys(initialFilters).length > 0) {
      // If only filters exist (no query), still use search API
      console.log('[RentMap] Initializing with filters from URL:', { filters: initialFilters });
      setActiveFilters(initialFilters);
      loadProperties("", initialFilters, true);
      setHasInitialized(true);
    } else if (!hasInitialized) {
      // Only load default properties if there's NO query and NO filters
      console.log('[RentMap] No query or filters, loading default properties');
      loadProperties();
      setHasInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceType, initialSearchQuery, initialFilters]); // Reload when priceType, query, or filters change

  // Handle search from ListingHeroSection
  const handleSearch = useCallback(async (query, filters) => {
    setSearchQuery(query || "");
    // If filters are provided, merge with activeFilters
    const mergedFilters = filters ? { ...activeFilters, ...filters } : activeFilters;
    setActiveFilters(mergedFilters);
    await loadProperties(query || "", mergedFilters);
  }, [loadProperties, activeFilters]);

  // Handle filter changes from ListingHeroSection
  // This is called immediately when a filter is selected in the dropdown
  const handleFilterChange = useCallback(async (filters) => {
    console.log('[RentMap] Filter changed, applying filters:', filters);
    
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
        // Handle regular numbers like "1", "2", "3", "4", "5"
        mappedFilters.bedrooms = filters["Beds"];
      }
      console.log(`[RentMap] Mapped Beds filter: "${filters["Beds"]}" → bedrooms: "${mappedFilters.bedrooms}"`);
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

    console.log('[RentMap] Mapped filters for API:', mappedFilters);
    
    setActiveFilters(mappedFilters);
    
    // Immediately call search API with the selected filters
    console.log('[RentMap] Calling loadProperties with filters:', mappedFilters);
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
      <ListingHeroSection
        backgroundImage="/rep_img/rent.jpg"
        priceType={priceType}
        onPriceTypeChange={setPriceType}
        loading={loading}
        propertiesCount={properties.length}
        totalProperties={totalProperties}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        showMoreFilters={showMoreFilters}
        onShowMoreFilters={setShowMoreFilters}
        initialSearchQuery={initialSearchQuery || searchQuery}
      />

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
