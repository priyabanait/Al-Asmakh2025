"use client";
import { useState, useEffect, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchPropertiesWithElasticsearch } from "@/utils/elasticsearchApi";

/**
 * LocationAutocomplete Component
 * Provides location search with autocomplete suggestions
 * 
 * @param {Object} props
 * @param {string} props.value - Current location value
 * @param {Function} props.onChange - Callback when location changes
 * @param {Function} props.onSelect - Callback when location is selected
 * @param {string} props.placeholder - Input placeholder text
 * @param {string} props.className - Additional CSS classes
 */
export default function LocationAutocomplete({
  value = "",
  onChange,
  onSelect,
  placeholder = "Search location...",
  className = "",
}) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimer = useRef(null);

  // Common locations (can be fetched from API later)
  const commonLocations = [
    "West Bay",
    "The Pearl",
    "Lusail City",
    "Al Sadd",
    "Al Dafna",
    "Doha",
    "Pearl Island",
    "Al Waab",
    "Al Rayyan",
    "Old Airport",
    "Al Khor",
    "Al Wakrah",
  ];

  // Fetch location suggestions from Elasticsearch
  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Search for locations using Elasticsearch
      const result = await searchPropertiesWithElasticsearch({
        q: query,
        limit: 10,
        status: 'published',
      });

      // Extract unique locations from results
      const locationSet = new Set();
      const locationSuggestions = [];

      if (result?.properties && result.properties.length > 0) {
        result.properties.forEach((property) => {
          // Add locationLevel1
          if (property.locationLevel1 && !locationSet.has(property.locationLevel1)) {
            locationSet.add(property.locationLevel1);
            locationSuggestions.push({
              value: property.locationLevel1,
              type: "Area",
              count: 1, // Could aggregate count if needed
            });
          }
          // Add locationLevel2
          if (property.locationLevel2 && !locationSet.has(property.locationLevel2)) {
            locationSet.add(property.locationLevel2);
            locationSuggestions.push({
              value: property.locationLevel2,
              type: "District",
              count: 1,
            });
          }
          // Add city
          if (property.city && !locationSet.has(property.city)) {
            locationSet.add(property.city);
            locationSuggestions.push({
              value: property.city,
              type: "City",
              count: 1,
            });
          }
        });
      }

      // Also check common locations
      commonLocations.forEach((location) => {
        if (
          location.toLowerCase().includes(query.toLowerCase()) &&
          !locationSet.has(location)
        ) {
          locationSet.add(location);
          locationSuggestions.push({
            value: location,
            type: "Popular",
            count: 0,
          });
        }
      });

      // Sort by relevance (exact match first, then contains)
      locationSuggestions.sort((a, b) => {
        const aLower = a.value.toLowerCase();
        const bLower = b.value.toLowerCase();
        const queryLower = query.toLowerCase();

        if (aLower.startsWith(queryLower) && !bLower.startsWith(queryLower)) {
          return -1;
        }
        if (!aLower.startsWith(queryLower) && bLower.startsWith(queryLower)) {
          return 1;
        }
        return aLower.localeCompare(bLower);
      });

      setSuggestions(locationSuggestions.slice(0, 8)); // Limit to 8 suggestions
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      // Fallback to common locations
      const filtered = commonLocations.filter((loc) =>
        loc.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(
        filtered.slice(0, 8).map((loc) => ({
          value: loc,
          type: "Popular",
          count: 0,
        }))
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (searchQuery) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    setShowSuggestions(true);
    setSelectedIndex(-1);

    if (onChange) {
      onChange(newValue);
    }
  };

  // Handle location selection
  const handleSelect = (location) => {
    setSearchQuery(location.value);
    setShowSuggestions(false);
    setSelectedIndex(-1);

    if (onSelect) {
      onSelect(location.value);
    }
    if (onChange) {
      onChange(location.value);
    }

    // Blur input
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter" && searchQuery) {
        // Submit search
        if (onSelect) {
          onSelect(searchQuery);
        }
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        } else if (searchQuery) {
          handleSelect({ value: searchQuery, type: "Custom" });
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear search
  const handleClear = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    if (onChange) {
      onChange("");
    }
    if (onSelect) {
      onSelect("");
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className={`relative w-full ${className}`} 
      style={{ 
        zIndex: showSuggestions ? 10000 : 'auto',
        position: 'relative',
        isolation: 'isolate'
      }}
    >
      {/* Search Input */}
      <div className="relative z-10">
        <div className="flex items-center px-3 sm:px-4 md:px-5 lg:px-6 bg-white rounded-[3px] border border-gray-300 py-2 sm:py-2.5 md:py-3 lg:py-4 focus-within:border-[#001730] focus-within:ring-2 focus-within:ring-[#001730]/20 transition">
          <div className="p-1 sm:p-1.5 bg-[#001730] rounded-[3px] flex items-center justify-center h-[24px] w-[24px] sm:h-[28px] sm:w-[28px] flex-shrink-0">
            <Search className="text-white h-2.5 w-2.5 sm:h-3 sm:w-3" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="flex-1 ml-2 sm:ml-3 md:ml-4 outline-none text-xs sm:text-sm md:text-[10px] lg:text-sm xl:text-base 2xl:text-lg bg-transparent"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="ml-2 p-1 hover:bg-gray-100 rounded transition flex-shrink-0"
              type="button"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
          {isLoading && (
            <div className="ml-2 flex-shrink-0">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#001730] border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-[10000] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-64 overflow-y-auto"
            style={{ 
              zIndex: 10000,
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0
            }}
          >
            {suggestions.map((location, index) => (
              <button
                key={`${location.value}-${index}`}
                onClick={() => handleSelect(location)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center gap-3 ${
                  selectedIndex === index ? "bg-gray-50" : ""
                }`}
                type="button"
              >
                <MapPin
                  size={16}
                  className={`flex-shrink-0 ${
                    location.type === "Popular"
                      ? "text-yellow-500"
                      : "text-[#001730]"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#001730] truncate">
                    {location.value}
                  </div>
                  {location.type && (
                    <div className="text-xs text-gray-500">{location.type}</div>
                  )}
                </div>
                {location.count > 0 && (
                  <div className="text-xs text-gray-400 flex-shrink-0">
                    {location.count}
                  </div>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      <AnimatePresence>
        {showSuggestions &&
          !isLoading &&
          searchQuery.length >= 2 &&
          suggestions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 z-[10000] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl p-4 text-center"
              style={{ 
                zIndex: 10000,
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0
              }}
            >
              <p className="text-sm text-gray-500">No locations found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try a different search term
              </p>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

