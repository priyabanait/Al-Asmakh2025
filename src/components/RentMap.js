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
import InteractivePropertyMap from "./InteractivePropertyMap";
import { fetchProperties } from "../utils/propertyapi";
import { searchProperties } from "../utils/searchApi";
import { searchPropertiesWithElasticsearch, checkElasticsearchHealth } from "../utils/elasticsearchApi";
import ListingHeroSection from "./ListingHeroSection";

export default function Sale({ 
  priceType: initialPriceType = undefined,
  initialSearchQuery = "",
  initialFilters = {},
  // When true, this component will NEVER call fetchProperties (property service)
  // and will rely only on the search API / Elasticsearch. Used for /listings/search.
  searchModeOnly = false,
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
  const [mobileViewMode, setMobileViewMode] = useState("LIST"); // "LIST" or "MAP"
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  // Track selected filters from ListingHeroSection for syncing with MoreFiltersModal
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
          status: "published",
          page: 1,
          limit: 50,
          ...filters,
        };

        // Only send priceType when explicitly set (rent/sale), so backend can also
        // infer it from natural language when not provided.
        if (priceType) {
          searchFilters.priceType = priceType;
        }

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
      } else if (!searchModeOnly) {
        // Use regular fetch for initial load (only when no search query and no filters)
        const result = await fetchProperties({
          priceType: priceType || "rent", // default to rent only for non-search listing pages
          page: 1,
          limit: 50,
          status: "published",
        });

        setProperties(result.properties || []);
        setTotalProperties(result.totalProperties || 0);
      } else {
        // In search-only mode and no query/filters: do NOT call fetchProperties.
        // Show an empty state until the user runs a search.
        setProperties([]);
        setTotalProperties(0);
      }
    } catch (err) {
      console.error("Error loading properties:", err);
      setError(err.message || "Failed to load properties");
      setProperties([]);
      setTotalProperties(0);
    } finally {
      setLoading(false);
    }
  }, [priceType, useElasticsearch, searchModeOnly]);

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
      const bedsValue = filters["Beds"];
      // Handle "All Bedrooms" (clear filter)
      if (bedsValue === "All Bedrooms") {
        // Do not set bedrooms in mappedFilters → removes filter
      } else if (bedsValue === "Studio") {
        mappedFilters.bedrooms = "0";
      } else if (bedsValue.endsWith("+")) {
        const num = bedsValue.replace("+", "");
        mappedFilters.bedrooms = `${num}+`;
      } else {
        // Handle regular numbers like "1", "2", "3", "4", "5"
        mappedFilters.bedrooms = bedsValue;
      }
      console.log(`[RentMap] Mapped Beds filter: "${bedsValue}" → bedrooms: "${mappedFilters.bedrooms}"`);
    }

    if (filters["Baths"]) {
      const bathsValue = filters["Baths"];
      // Handle "All Bathrooms" (clear filter)
      if (bathsValue === "All Bathrooms") {
        // Do not set bathrooms in mappedFilters → removes filter
      } else if (bathsValue === "No bathroom") {
        mappedFilters.bathrooms = "0";
      } else if (bathsValue.endsWith("+")) {
        const num = bathsValue.replace("+", "");
        mappedFilters.bathrooms = `${num}+`;
      } else {
        mappedFilters.bathrooms = bathsValue;
      }
    }

    if (filters["Price"]) {
      const priceValue = filters["Price"];
      // "All Prices" clears price range
      if (priceValue === "All Prices") {
        // No min/max → removes price filter
      } else if (priceValue.includes("-")) {
        const [min, max] = priceValue.split("-");
        mappedFilters.minPrice = min;
        mappedFilters.maxPrice = max;
      } else if (priceValue.endsWith("+")) {
        mappedFilters.minPrice = priceValue.replace("+", "");
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
        mobileViewMode={mobileViewMode}
        onMobileViewModeChange={setMobileViewMode}
        selectedFilters={selectedFilters}
        onSelectedFiltersChange={setSelectedFilters}
      />

      {/* Mobile Map View (only when Map View is active on mobile) */}
      {mobileViewMode === "MAP" && (
        <div className="block lg:hidden w-full mt-[130px] relative" style={{ height: "calc(100vh - 350px)", minHeight: "60vh" }}>
          <InteractivePropertyMap
            properties={properties}
            selectedPropertyId={selectedPropertyId}
            onPropertyClick={(propertyId) => {
              setSelectedPropertyId(propertyId);
              // Scroll to property in list when switching back to list view
              const element = document.querySelector(`[data-property-id="${propertyId}"]`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            onMapReady={() => setMapLoading(false)}
          />
        </div>
      )}

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
        <>
          {/* On mobile, hide the list when Map View is active; on desktop always show. */}
          <div className={mobileViewMode === "MAP" ? "hidden lg:block" : ""}>
            <PropertyListView 
              properties={properties} 
              totalProperties={totalProperties}
            />
          </div>
          
          {/* Desktop Map View (always visible on desktop, hidden on mobile when list is shown) */}
          <div className="hidden lg:block mt-4">
            <InteractivePropertyMap
              properties={properties}
              selectedPropertyId={selectedPropertyId}
              onPropertyClick={(propertyId) => {
                setSelectedPropertyId(propertyId);
                // Scroll to property in list
                const element = document.querySelector(`[data-property-id="${propertyId}"]`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              onMapReady={() => setMapLoading(false)}
            />
          </div>
        </>
      )}

      {/* More Filters Modal */}
      <MoreFiltersModal
        isOpen={showMoreFilters}
        onClose={() => setShowMoreFilters(false)}
        onShowResults={handleMoreFiltersSearch}
        priceType={priceType}
        selectedFilters={selectedFilters}
        onSelectedFiltersChange={setSelectedFilters}
      />

      <DreamPropertySection />
    </div>
  );
}
