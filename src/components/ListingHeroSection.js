"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Mic,
  MapPin,
  ArrowDown,
  Bed,
  Bath,
  Home,
  SlidersHorizontal,
} from "lucide-react";
import { FaDollarSign } from "react-icons/fa";
import SpeechToTextModal from "./SpeechToTextModal";
import { getApiUrl } from "../config/api";

export default function ListingHeroSection({
  backgroundImage = "/images_pages/listings.png",
  priceType = "rent",
  onPriceTypeChange,
  loading = false,
  propertiesCount = 0,
  totalProperties = 0,
  onSearch,
  onFilterChange,
  showMoreFilters = false,
  onShowMoreFilters,
  initialSearchQuery = "",
  // Mobile-only view mode: "LIST" (default) or "MAP"
  mobileViewMode = "LIST",
  onMobileViewModeChange,
  // Pass selected filters to MoreFiltersModal
  selectedFilters: externalSelectedFilters,
  onSelectedFiltersChange,
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [showSpeechModal, setShowSpeechModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});
  
  // Dynamic filter options from API
  const [filterOptions, setFilterOptions] = useState({
    "Property Type": ["All Property Types", "Apartment", "Villa", "Townhouse", "Penthouse", "Studio"],
    Location: ["All Areas"],
    Beds: ["All Bedrooms", "Studio", "1", "2", "3", "4", "5", "5+"],
    Baths: ["All Bathrooms", "No bathroom", "1", "2", "3", "4", "5", "5+"],
    Price: ["All Prices"],
  });
  
  // Price range state for slider
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [priceRangeInputs, setPriceRangeInputs] = useState({ min: 0, max: 100000 });

  // Update search query when initialSearchQuery prop changes
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Fetch areas from API
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const apiUrl = getApiUrl("api/v1/areas/list");
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          if (data.areas && Array.isArray(data.areas)) {
            const areaNames = data.areas
              .map(area => area.area_name || area.name || area.area_title)
              .filter(Boolean)
              .sort();
            setFilterOptions(prev => ({
              ...prev,
              Location: ["All Areas", ...areaNames],
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching areas:", error);
        // Keep fallback locations
        setFilterOptions(prev => ({
          ...prev,
          Location: ["All Areas", "Doha", "Lusail", "West Bay", "Pearl Qatar", "Al Waab"],
        }));
      }
    };
    fetchAreas();
  }, []);

  // Fetch property types from properties (extract unique types)
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const apiUrl = getApiUrl("api/v1/properties?page=1&limit=1000&status=published");
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          const properties = data.properties || [];
          const uniqueTypes = new Set();
          properties.forEach(prop => {
            if (prop.type) {
              // Map backend types to display names
              const typeMap = {
                apartment: "Apartment",
                villa: "Villa",
                townhouse: "Townhouse",
                penthouse: "Penthouse",
                studio: "Studio",
                commercial: "Commercial",
                office: "Office",
                luxury: "Penthouse",
              };
              const displayName = typeMap[prop.type.toLowerCase()] || prop.type;
              uniqueTypes.add(displayName);
            }
          });
          const sortedTypes = Array.from(uniqueTypes).sort();
          setFilterOptions(prev => ({
            ...prev,
            "Property Type": ["All Property Types", ...sortedTypes],
          }));
        }
      } catch (error) {
        console.error("Error fetching property types:", error);
        // Keep default types
      }
    };
    fetchPropertyTypes();
  }, []);

  // Use external selectedFilters if provided, otherwise use internal state
  const [internalSelectedFilters, setInternalSelectedFilters] = useState({
    "Property Type": null,
    Location: null,
    Beds: null,
    Baths: null,
    Price: null,
  });
  
  const selectedFilters = externalSelectedFilters || internalSelectedFilters;
  
  // Sync external filters to internal state
  useEffect(() => {
    if (externalSelectedFilters) {
      setInternalSelectedFilters(externalSelectedFilters);
    }
  }, [externalSelectedFilters]);

  // Close dropdown when clicking outside (only checks the currently open dropdown)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown].contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdown]);

  const handleFilterSelect = (filterName, value) => {
    // Interpret "All ..." options as clearing the filter
    const isAllOption =
      value === "All Property Types" ||
      value === "All Areas" ||
      value === "All Bedrooms" ||
      value === "All Bathrooms" ||
      value === "All Prices";

    const newFilters = {
      ...selectedFilters,
      [filterName]: isAllOption ? null : value,
    };
    
    // Reset price range inputs when "All Prices" is selected
    if (filterName === "Price" && isAllOption) {
      setPriceRangeInputs({ min: 0, max: 100000 });
      setPriceRange({ min: 0, max: 100000 });
    }
    
    // Update internal state if not using external filters
    if (!externalSelectedFilters) {
      setInternalSelectedFilters(newFilters);
    }
    
    // Notify parent component of filter changes
    if (onSelectedFiltersChange) {
      onSelectedFiltersChange(newFilters);
    }
    
    setOpenDropdown(null);
    
    console.log(
      `[ListingHeroSection] Filter selected: ${filterName} = ${value}`,
      newFilters,
      "current value for this filter:",
      newFilters[filterName]
    );
    // Immediately call API with the selected filters when clicked
    // This ensures API is called only when a filter option is clicked
    if (onFilterChange) {
      console.log(`[ListingHeroSection] Calling onFilterChange (API call) with filters:`, newFilters);
      onFilterChange(newFilters);
    } else {
      console.warn('[ListingHeroSection] onFilterChange is not provided!');
    }
  };
  
  const handlePriceRangeApply = () => {
    const priceValue = `${priceRangeInputs.min}-${priceRangeInputs.max}`;
    const newFilters = {
      ...selectedFilters,
      Price: priceValue,
    };
    
    if (!externalSelectedFilters) {
      setInternalSelectedFilters(newFilters);
    }
    
    if (onSelectedFiltersChange) {
      onSelectedFiltersChange(newFilters);
    }
    
    setShowPriceRange(false);
    setOpenDropdown(null);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };
  
  const handlePriceRangeReset = () => {
    const newFilters = {
      ...selectedFilters,
      Price: null,
    };
    
    if (!externalSelectedFilters) {
      setInternalSelectedFilters(newFilters);
    }
    
    if (onSelectedFiltersChange) {
      onSelectedFiltersChange(newFilters);
    }
    
    setPriceRangeInputs({ min: 0, max: 100000 });
    setShowPriceRange(false);
    setOpenDropdown(null);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery, selectedFilters);
    }
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
        return <FaDollarSign size={16} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* ---------- HERO SECTION ---------- */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[85vh] flex flex-col items-center justify-center overflow-visible">
        {/* Background Image */}
        <Image
          src={backgroundImage}
          alt="City Skyline"
          fill
          className="object-cover"
          priority
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0" />

        {/* 🔍 Search Bar (Half on BG, Half outside) */}
        {/* Mobile Version */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 z-20 w-[90%] mb-12 lg:hidden">
          <div className="space-y-3">
            {/* Transaction Type Selector - Separate Box */}
            <div className="border border-white/10 backdrop-blur-sm bg-white/20 rounded-md border-[#8C8C8C66] p-3 shadow-md">
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => {
                    onPriceTypeChange?.("rent");
                    router.push("/listings/rent");
                  }}
                  className={`px-8 py-1.5 rounded-md font-medium shadow transition ${priceType === "rent"
                      ? "bg-[#001730] text-white"
                      : "bg-gray-400 text-white"
                    }`}
                >
                  RENT
                </button>
                <button
                  onClick={() => {
                    onPriceTypeChange?.("sale");
                    router.push("/listings/listing-sale");
                  }}
                  className={`px-8 py-1.5 rounded-md font-medium shadow transition ${priceType === "sale"
                      ? "bg-[#001730] text-white"
                      : "bg-gray-400 text-white"
                    }`}
                >
                  BUY
                </button>
              </div>
            </div>

            {/* Search Bar - Separate Box */}
            <div className="bg-[#8C8C8C66] backdrop-blur-md border rounded-md border-[#8C8C8C66] p-3 shadow-md">
              <form onSubmit={handleSearch}>
                <div className="bg-white rounded-md shadow-sm flex items-center px-2 py-2">
                  <button
                    type="submit"
                    className="p-2 bg-[#001730] rounded-md mr-2 flex items-center justify-center h-8 w-8 flex-shrink-0"
                  >
                    <Search className="text-white h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type here .."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-gray-800 text-sm bg-transparent outline-none placeholder:text-gray-400"
                  />
                  {/* <button
                    type="button"
                    onClick={() => setShowSpeechModal(true)}
                    className="p-2 bg-[#001730] rounded-md ml-2 flex items-center justify-center h-8 w-8 flex-shrink-0 hover:bg-[#022d5e] transition-colors cursor-pointer"
                  >
                    <Mic className="text-white h-4 w-4" />
                  </button> */}
                </div>
              </form>
            </div>

            {/* Action Buttons - Separate Box */}
            <div className="bg-[#8C8C8C66] backdrop-blur-md border rounded-md border-[#8C8C8C66] p-3 shadow-md">
              <div className="flex gap-2">
                <button
                  onClick={() => onShowMoreFilters?.(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#001730] text-white px-3 py-2.5 rounded-md font-medium shadow-lg text-sm"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <div className="h-4 w-[1px] bg-white"></div>
                  <span>Filters</span>
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = mobileViewMode === "MAP" ? "LIST" : "MAP";
                    onMobileViewModeChange?.(nextMode);
                  }}
                  className="flex items-center justify-center gap-2 bg-[#001730] text-white px-3 py-2.5 rounded-md font-medium shadow-lg text-sm"
                >
                  <span>{mobileViewMode === "MAP" ? "List View" : "Map View"}</span>
                </button>
              </div>
            </div>

            {/* Status Indicator - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:block text-center text-gray-600 text-sm  font-medium pt-3 pb-2">
              {loading
                ? "Loading..."
                : `Showing ${propertiesCount} of ${totalProperties}`}
            </div>
            <div className="w-[100%] h-[1px] bg-gray-300 my-2 mb-4 px-10"></div>
          </div>
        </div>

        {/* Desktop Version */}
        <div className="absolute left-1/2 bottom-10 mb-[6%] transform -translate-x-1/2 translate-y-1/2 z-20 w-[70%] lg:w-[60%] hidden lg:block">
          <div className="border border-white/10 backdrop-blur-[10px] bg-white/30 rounded-md p-4 lg:p-6 shadow-lg">
            {/* Buttons Section */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => {
                  onPriceTypeChange?.("rent");
                  router.push("/listings/rent");
                }}
                className={`px-20 py-1.5 rounded-md font-medium shadow transition ${priceType === "rent"
                    ? "bg-[#001730] text-white"
                    : "bg-[#0B1F3A]/40 text-white backdrop-blur-[20px] border border-white/40"
                  }`}
              >
                RENT
              </button>
              <button
                onClick={() => {
                  onPriceTypeChange?.("sale");
                  router.push("/listings/listing-sale");
                }}
                className={`px-20 py-1.5 rounded-md font-medium shadow transition ${priceType === "sale"
                    ? "bg-[#001730] text-white"
                    : "bg-[#0B1F3A]/40 text-white backdrop-blur-[20px] border border-white/40"
                  }`}
              >
                BUY
              </button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch}>
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
            </form>
          </div>
        </div>
      </section>

      {/* Desktop Filter Bar */}
      <div className="hidden lg:flex w-full justify-center lg:pt-0 pt-0 lg:-mt-[2%] relative z-30">
        <div className="grid w-full border border-white/10 backdrop-blur-[10px] bg-white/20 p-4 lg:mx-10 rounded-md shadow-md gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Filter Items with Dropdowns */}
          {["Property Type", "Location", "Beds", "Baths", "Price"].map(
            (label, index) => {
              const isOpen = openDropdown === label;
              const selectedValue = selectedFilters[label];
              console.log(selectedValue,"selectedValue")

              return (
                <div
                  key={index}
                  ref={(el) => (dropdownRefs.current[label] = el)}
                  className="relative"
                >
                  <button
                    onClick={() =>
                      setOpenDropdown(isOpen ? null : label)
                    }
                    className={`w-full flex items-center justify-between bg-[#0B1F3A] text-white px-4 py-1.5 rounded-md shadow-lg hover:bg-[#001730] transition ${selectedValue ? "ring-2 ring-[#001730]" : ""
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon + Divider */}
                      <div className="flex items-center gap-2">
                        {getIcon(label)}
                        <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                      </div>

                      {/* Label / Selected Value */}
                      <span className="text-[13px]">
                        {selectedValue || label}
                      </span>
                    </div>

                    {/* Down Arrow */}
                    <ArrowDown
                      size={16}
                      className={`opacity-80 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg z-50 border border-gray-200 max-h-60 overflow-y-auto">
                      {label === "Price" ? (
                        <div className="p-4">
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">Price Range</span>
                              <button
                                onClick={handlePriceRangeReset}
                                className="text-xs text-[#001730] hover:underline"
                              >
                                Reset
                              </button>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Min Price</label>
                                <input
                                  type="number"
                                  min="0"
                                  max={priceRangeInputs.max}
                                  value={priceRangeInputs.min}
                                  onChange={(e) => {
                                    const val = Math.max(0, Math.min(parseInt(e.target.value) || 0, priceRangeInputs.max));
                                    setPriceRangeInputs(prev => ({ ...prev, min: val }));
                                    setPriceRange(prev => ({ ...prev, min: val }));
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#001730]"
                                  placeholder="0"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Max Price</label>
                                <input
                                  type="number"
                                  min={priceRangeInputs.min}
                                  value={priceRangeInputs.max}
                                  onChange={(e) => {
                                    const val = Math.max(priceRangeInputs.min, parseInt(e.target.value) || 100000);
                                    setPriceRangeInputs(prev => ({ ...prev, max: val }));
                                    setPriceRange(prev => ({ ...prev, max: val }));
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#001730]"
                                  placeholder="100000"
                                />
                              </div>
                              <div className="pt-2">
                                <label className="block text-xs text-gray-600 mb-1">Min: {priceRange.min.toLocaleString()}</label>
                                <input
                                  type="range"
                                  min="0"
                                  max={priceRange.max}
                                  step="1000"
                                  value={priceRange.min}
                                  onChange={(e) => {
                                    const val = Math.min(parseInt(e.target.value), priceRange.max);
                                    setPriceRange(prev => ({ ...prev, min: val }));
                                    setPriceRangeInputs(prev => ({ ...prev, min: val }));
                                  }}
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#001730]"
                                />
                              </div>
                              <div className="pt-2">
                                <label className="block text-xs text-gray-600 mb-1">Max: {priceRange.max.toLocaleString()}</label>
                                <input
                                  type="range"
                                  min={priceRange.min}
                                  max="100000"
                                  step="1000"
                                  value={priceRange.max}
                                  onChange={(e) => {
                                    const val = Math.max(parseInt(e.target.value), priceRange.min);
                                    setPriceRange(prev => ({ ...prev, max: val }));
                                    setPriceRangeInputs(prev => ({ ...prev, max: val }));
                                  }}
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#001730]"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2 border-t">
                            <button
                              onClick={handlePriceRangeApply}
                              className="flex-1 px-4 py-2 bg-[#001730] text-white rounded-md text-sm font-medium hover:bg-[#022d5e] transition"
                            >
                              Apply
                            </button>
                            <button
                              onClick={() => {
                                setShowPriceRange(false);
                                setOpenDropdown(null);
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition"
                            >
                              Cancel
                            </button>
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <div className="text-xs text-gray-600 mb-2">Quick Select:</div>
                            {filterOptions[label].slice(1).map((option, optIndex) => (
                              <button
                                key={optIndex}
                                onClick={() => handleFilterSelect(label, option)}
                                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition rounded ${selectedValue === option
                                    ? "bg-[#001730] text-white"
                                    : "text-gray-700"
                                  }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        filterOptions[label].map((option, optIndex) => (
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
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            }
          )}

          {/* More Filters Button */}
          <button
            onClick={() => onShowMoreFilters?.(true)}
            className="flex text-[13px] items-center justify-center bg-[#0B1F3A]/40 text-white px-6 py-2 rounded-md font-medium shadow-lg hover:bg-gray-600 transition"
          >
            <span className="text-[13px]">+ More Filters</span>
          </button>
        </div>
      </div>

      {/* Speech to Text Modal */}
      <SpeechToTextModal
        isOpen={showSpeechModal}
        onClose={() => setShowSpeechModal(false)}
        onSearch={(query) => {
          setSearchQuery(query);
          if (onSearch) {
            onSearch(query);
          }
        }}
        searchQuery={searchQuery}
        onQueryChange={setSearchQuery}
      />
    </>
  );
}

