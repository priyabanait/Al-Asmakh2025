"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSpeechModal, setShowSpeechModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  // Filter options
  const filterOptions = {
    "Property Type": ["Apartment", "Villa", "Townhouse", "Penthouse", "Studio"],
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
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
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
        <div className="absolute left-1/2 bottom-0 mb-5 transform -translate-x-1/2 translate-y-1/2 z-20 w-[90%] lg:hidden">
          <div className="space-y-3">
            {/* Transaction Type Selector - Separate Box */}
            <div className="border border-white/10 backdrop-blur-sm bg-white/20 rounded-md border-[#8C8C8C66] p-3 shadow-md">
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onPriceTypeChange?.("rent")}
                  className={`px-8 py-1.5 rounded-md font-medium shadow transition ${
                    priceType === "rent"
                      ? "bg-[#001730] text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  RENT
                </button>
                <button
                  onClick={() => onPriceTypeChange?.("sale")}
                  className={`px-8 py-1.5 rounded-md font-medium shadow transition ${
                    priceType === "sale"
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
                <button className="flex items-center justify-center gap-2 bg-[#001730] text-white px-3 py-2.5 rounded-md font-medium shadow-lg text-sm">
                  <Image
                    src="/Icon (4).png"
                    alt="List Icon"
                    width={16}
                    height={16}
                    className="text-white"
                  />
                  <span>Map View</span>
                </button>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="text-center text-gray-600 text-sm font-medium pt-3 pb-2">
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
                onClick={() => onPriceTypeChange?.("rent")}
                className={`px-20 py-1.5 rounded-md font-medium shadow transition ${
                  priceType === "rent"
                    ? "bg-[#001730] text-white"
                    : "bg-[#0B1F3A]/40 text-white backdrop-blur-[20px] border border-white/40"
                }`}
              >
                RENT
              </button>
              <button
                onClick={() => onPriceTypeChange?.("sale")}
                className={`px-20 py-1.5 rounded-md font-medium shadow transition ${
                  priceType === "sale"
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
                    className={`w-full flex items-center justify-between bg-[#0B1F3A] text-white px-4 py-1.5 rounded-md shadow-lg hover:bg-[#001730] transition ${
                      selectedValue ? "ring-2 ring-[#001730]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon + Divider */}
                      <div className="flex items-center gap-2">
                        {getIcon(label)}
                        <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                      </div>

                      {/* Label */}
                      <span className="text-[13px]">
                        {selectedValue || label}
                      </span>
                    </div>

                    {/* Down Arrow */}
                    <ArrowDown
                      size={16}
                      className={`opacity-80 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg z-50 border border-gray-200 max-h-60 overflow-y-auto">
                      {filterOptions[label].map((option, optIndex) => (
                        <button
                          key={optIndex}
                          onClick={() => handleFilterSelect(label, option)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition ${
                            selectedValue === option
                              ? "bg-[#001730] text-white"
                              : "text-gray-700"
                          } ${
                            optIndex === 0 ? "rounded-t-md" : ""
                          } ${
                            optIndex === filterOptions[label].length - 1
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

