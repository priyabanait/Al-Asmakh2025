"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Mic, MapPin, ArrowDown, Bed, Bath, Square, ArrowRight, Leaf, Home, Map as MapIcon, Check, SlidersHorizontal } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import { FaList } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { Calendar, Building2 } from "lucide-react";
import DreamPropertySection from "./DreamPropertySection";
import PropertyListDev from "./PropertyListDev";
import { fetchPropertiesByOfferingType } from "../utils/propertyapi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Services({
  offeringType = "lease",
  backgroundImage = "/images_pages/services lease.png",
  stats = [
    { value: "34", label: "Total Projects" },
    { value: "16", label: "Completed" },
    { value: "02", label: "Ongoing" },
    { value: "05", label: "Upcoming" },
  ],
  filterButtons = ["LUXURY", "COMMERCIAL", "INDUSTRIAL"],
  // Additional API filters
  propertyType, // "commercial", "industrial", "residential"
  category, // "luxury", "standard", "budget"
  luxury, // "true" or "false"
  development, // "true" or "false"
  // Projects support
  projects: externalProjects, // Projects passed from parent
  useProjects = false, // Flag to use projects instead of properties
  loading: externalLoading, // Loading state from parent
}) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("LIST"); // "LIST" or "MAP"
  const [showFilters, setShowFilters] = useState(false); // Toggle for mobile filters
  const filtersRef = useRef(null); // Ref for filter container
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state management
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
  const [filters, setFilters] = useState({
    projectType: null,
    location: null,
    status: null,
    date: null,
  });
  const dropdownRefs = useRef({}); // Refs for each dropdown

  // Close filters / dropdowns when clicking outside (mobile + desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Mobile filters close
      if (
        showFilters &&
        filtersRef.current &&
        !filtersRef.current.contains(event.target)
      ) {
        setShowFilters(false);
      }

      // Check if click is inside ANY dropdown
      const clickedInsideDropdown = Object.values(dropdownRefs.current).some(
        (ref) => ref && ref.contains(event.target)
      );

      // Close dropdown only if click is outside
      if (!clickedInsideDropdown) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  // Filter options
  const filterOptions = {
    projectType: ["Luxury", "Commercial", "Industrial", "Residential"],
    location: ["West Bay", "The Pearl", "Al Sadd", "Lusail", "Doha"],
    status: ["Completed", "Ongoing", "Upcoming"],
    date: ["Newest", "Oldest", "Recently Updated"],
  };

  // Handle filter selection (desktop + mobile)
  const handleFilterSelect = (filterType, value) => {
    // Just toggle filter value locally so it behaves like /listings/rent
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value,
    }));
    setOpenDropdown(null);
  };

  // Toggle dropdown
  const toggleDropdown = (filterType) => {
    setOpenDropdown(openDropdown === filterType ? null : filterType);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      projectType: null,
      location: null,
      status: null,
      date: null,
    });
    setOpenDropdown(null);
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== null);

  // Filter properties based on selected filters
  const filteredProperties = properties.filter((property) => {
    // For projects, check projectType field; for properties, check type field
    if (filters.projectType) {
      const propType = property.projectType || property.type || '';
      if (propType.toLowerCase() !== filters.projectType.toLowerCase()) {
        return false;
      }
    }
    
    // Location filter - check multiple location fields
    if (filters.location) {
      const locationStr = (
        property.location || 
        property.locationLevel2 || 
        property.locationLevel1 || 
        ''
      ).toLowerCase();
      if (!locationStr.includes(filters.location.toLowerCase())) {
        return false;
      }
    }
    
    // Status filter - check statusType or projectStatus
    if (filters.status) {
      const status = property.statusType || property.projectStatus || '';
      if (status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }
    }
    
    return true;
  });

  // Fetch properties from API based on offeringType (only if not using projects)
  useEffect(() => {
    // If using projects from parent, use them directly
    if (useProjects) {
    

      // Always update when externalProjects changes (even if empty array)
      const projectsArray = Array.isArray(externalProjects) ? externalProjects : [];
      console.log("Services component - setting properties:", projectsArray.length, projectsArray);
      setProperties(projectsArray);

      // Update loading state from parent
      if (externalLoading !== undefined) {
        setLoading(externalLoading);
      }
      return;
    }

    // Map UI filters → API filters
    const apiFilterOverrides = {};

    if (filters.projectType) {
      const v = filters.projectType.toLowerCase();
      // Map to backend "type" / "category" style keys without breaking existing props
      if (["luxury"].includes(v)) {
        apiFilterOverrides.category = "luxury";
      } else if (["commercial", "industrial", "residential"].includes(v)) {
        apiFilterOverrides.type = v;
      }
    }

    if (filters.location) {
      apiFilterOverrides.locationLevel1 = filters.location;
    }

    if (filters.status) {
      apiFilterOverrides.projectStatus = filters.status;
    }

    if (filters.date) {
      // Simple sort mapping; adjust if backend expects something else
      apiFilterOverrides.sortBy =
        filters.date === "Newest"
          ? "newest"
          : filters.date === "Oldest"
          ? "oldest"
          : "recent";
    }

    // Otherwise, fetch properties from API
    const loadProperties = async () => {
      try {
        setLoading(true);
        // Fetch properties using offeringType from parent (lease, sale, marketing)
        // Pass additional filters for luxury, commercial, industrial, etc.
        const fetchedProperties = await fetchPropertiesByOfferingType(offeringType, {
          page: 1,
          limit: 50,
          type: propertyType,
          category: category,
          luxury: luxury,
          development: development,
          ...apiFilterOverrides,
        });

        // Use API response data only
        if (fetchedProperties && Array.isArray(fetchedProperties)) {
          setProperties(fetchedProperties);
        } else {
          // Set empty array if no data
          setProperties([]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        // Set empty array on error - no static fallback
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [
    offeringType,
    propertyType,
    category,
    luxury,
    development,
    useProjects,
    externalProjects,
    externalLoading,
    filters.projectType,
    filters.location,
    filters.status,
    filters.date,
  ]);



  return (
    <div>
      {/* ---------- HERO SECTION ---------- */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[85vh] flex flex-col items-center justify-center overflow-visible">
        {/* Background Image - Dynamic from props */}
        <Image
          src={backgroundImage}
          alt="City Skyline"
          fill
          className="object-cover"
          priority
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0" />

        {/* 🔍 Search Bar (Half on BG, Half outside) - Dynamic Stats from props */}
        <div className="absolute left-1/2 lg:bottom-[228px] bottom-56 shadow-md transform -translate-x-1/2 translate-y-1/2 z-20 w-[90%] lg:w-[60%] px-4 lg:px-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shadow-md lg:gap-6  mb-10 lg:mb-10">
            {stats.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center  border border-white/10 backdrop-blur-[10px] bg-white/20  rounded-md p-3  lg:p-6 text-white h-28 lg:h-32"
              >
                <h2 className="text-lg text-gray-800  lg:text-2xl font-semibold mb-2">
                  {item.value}
                </h2>
                <div className="w-[60%] h-[0.5px] bg-gray-300 lg:mb-2"></div>
                <p className="text-gray-800 text-[10px] lg:text-sm text-center">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>




        {/* Desktop Filter Items - Moved to bottom of hero */}
        <div className="hidden lg:flex absolute w-full justify-center bottom-10 lg:bottom-[-32px] z-20">
          <div className="flex w-full border border-white/10 backdrop-blur-[10px] bg-white/20 lg:mx-10 p-4 rounded-md shadow-md 
                  gap-4 justify-center items-center">
            {/* Clear Filters Button - Desktop */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-red-700 transition text-sm font-medium whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
            {/* Filter Items */}
            {["Project Type", "Location", "Status", "Date"].map((label, index) => {
              const filterKey = label === "Project Type" ? "projectType" : 
                                label === "Location" ? "location" : 
                                label === "Status" ? "status" : "date";
              const isOpen = openDropdown === filterKey;
              const selectedValue = filters[filterKey];
              
              // Get appropriate icon for each label
              const getIcon = () => {
                switch (label) {
                  case "Project Type":
                    return <Home size={16} />;
                  case "Location":
                    return <MapPin size={16} />;
                  case "Status":
                    return <Check size={16} />;
                  case "Date":
                    return <Calendar size={16} />;
                  default:
                    return <MapPin size={16} />;
                }
              };

              return (
                <div
                  key={index}
                  ref={(el) => (dropdownRefs.current[filterKey] = el)}
                  className="relative w-full max-w-[250px]"
                >
                  <div
                    onClick={() => toggleDropdown(filterKey)}
                    className={`flex items-center justify-between bg-[#0B1F3A] text-white px-8 py-2 w-full
                         rounded-md shadow-lg hover:bg-[#001730] transition cursor-pointer ${isOpen ? 'bg-[#001730]' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon + Divider */}
                      <div className="flex items-center gap-2">
                        {getIcon()}
                        <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                      </div>

                      {/* Label */}
                      <span className="text-[13px]">{selectedValue || label}</span>
                    </div>

                    {/* Down Arrow */}
                    <ArrowDown 
                      size={16} 
                      className={`opacity-80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                    />
                  </div>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-xl border border-gray-200 z-50 max-h-60 overflow-y-auto">
                      {filterOptions[filterKey]?.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          onClick={() => handleFilterSelect(filterKey, option)}
                          className={`px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                            selectedValue === option ? 'bg-[#001730] text-white hover:bg-[#002d52]' : 'text-gray-800'
                          }`}
                        >
                          <span className="text-sm">{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Filters Button - Absolute positioned in hero section */}
        <div className="absolute left-1/2 bottom-[-10px] mb-4 transform -translate-x-1/2 z-20 w-[100%] px-4 lg:hidden">
          <div ref={filtersRef} className="flex flex-col gap-3 bg-white/20 backdrop-blur-[10px] border border-white/10 p-3 px-10  rounded-md shadow-md">
            {/* Single Filters Button for Mobile */}
            <div
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between bg-[#0B1F3A] text-white px-4 py-3 rounded-md shadow-lg hover:bg-[#001730] transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {/* Filter Icon */}
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} />
                  <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                </div>
                {/* Label */}
                <span className="text-sm font-medium">Filters</span>
              </div>
              {/* Down Arrow - Rotates when open */}
              <ArrowDown
                size={16}
                className={`text-white opacity-80 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
              />
            </div>

            {/* Filter Items - Shown when button is clicked */}
            {showFilters && (
              <div className="flex flex-col gap-3">
                {/* Clear Filters Button - Mobile */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-md w-full shadow-lg hover:bg-red-700 transition text-sm font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
                {["Project Type", "Location", "Status", "Date"].map((label, index) => {
                  const filterKey = label === "Project Type" ? "projectType" : 
                                    label === "Location" ? "location" : 
                                    label === "Status" ? "status" : "date";
                  const isOpen = openDropdown === filterKey;
                  const selectedValue = filters[filterKey];
                  
                  // Get appropriate icon for each label
                  const getIcon = () => {
                    switch (label) {
                      case "Project Type":
                        return <Home size={16} />;
                      case "Location":
                        return <MapPin size={16} />;
                      case "Status":
                        return <Check size={16} />;
                      case "Date":
                        return <Calendar size={16} />;
                      default:
                        return <MapPin size={16} />;
                    }
                  };

                  return (
                    <div
                      key={index}
                      ref={(el) => (dropdownRefs.current[filterKey] = el)}
                      className="relative"
                    >
                      <div
                        onClick={() => toggleDropdown(filterKey)}
                        className={`flex items-center justify-between bg-[#0B1F3A] text-white px-4 py-3 rounded-md w-full shadow-lg hover:bg-[#001730] transition cursor-pointer ${isOpen ? 'bg-[#001730]' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Icon + Divider */}
                          <div className="flex items-center gap-2">
                            {getIcon()}
                            <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                          </div>

                          {/* Label */}
                          <span className="text-sm font-medium">{selectedValue || label}</span>
                        </div>

                        {/* Down Arrow */}
                        <ArrowDown 
                          size={16} 
                          className={`opacity-80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                        />
                      </div>

                      {/* Dropdown Menu */}
                      {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-xl border border-gray-200 z-50 max-h-60 overflow-y-auto">
                          {filterOptions[filterKey]?.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              onClick={() => handleFilterSelect(filterKey, option)}
                              className={`px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                                selectedValue === option ? 'bg-[#001730] text-white hover:bg-[#002d52]' : 'text-gray-800'
                              }`}
                            >
                              <span className="text-sm">{option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter Buttons Box - Dynamic from props */}
      <div className="w-full 
      
       flex justify-center px-4 lg:px-40 lg:pt-0 pt-0 lg:-mt-[145px] lg:mb-8 relative z-50">
        <div
          className="
      grid w-full overflow-x-auto lg:overflow-visible
      border border-white/20 backdrop-blur-[10px] lg:mx-24 bg-[#8C8C8C66]
      p-3 py-3lg:p-3 lg:px-2 rounded-md shadow-md gap-2 lg:gap-3
      grid-cols-3  lg:grid-cols-3
      justify-center 
    "
        >
          {filterButtons.map((label, index) => {
            // Map filter button labels to routes
            const getRoute = (buttonLabel) => {
              const routeMap = {
                "LUXURY": "/listings/luxury",
                "COMMERCIAL": "/commercial",
                "INDUSTRIAL": "/industrial",
              };
              return routeMap[buttonLabel] || null;
            };

            const route = getRoute(label);

            return (
              <div
                key={index}
                onClick={() => {
                  if (route) {
                    router.push(route);
                  }
                }}
                className={`
                  flex items-center justify-center bg-[#0B1F3A] text-white
                  px-4 py-1.5 rounded-md shadow-lg hover:bg-[#001730] transition
                  ${route ? 'cursor-pointer' : ''}
                `}
              >
                <span className="text-xs lg:text-sm font-medium">{label}</span>
              </div>
            );
          })}
        </div>
      </div>


      {/* ---------- READY TO FIND SECTION ---------- */}
      {/* <div className="hidden lg:block w-[100%] h-[1px] bg-gray-300 my-4  px-10"></div> */}


      {/* ---------- LIST AND MAP VIEW SECTION ---------- */}
      <div className="hidden lg:block lg:py-28 py-4">
        {/* Header Bar */}
        <div className=" border-gray-200 px-2 lg:px-6">
          <div className="hidden lg:flex max-w-full mb-6  mx-auto items-center gap-4">
            {/* Showing Count (Left) */}
            <div className="text-gray-400 text-sm font-medium whitespace-nowrap">
              Showing {properties.length} of {properties.length}
            </div>

            {/* CENTER LINE */}
            <div className="flex-1 h-[0.5px] bg-gray-300"></div>

            {/* LIST / MAP Buttons (Right) */}
            <div className="flex items-center gap-2">
              {/* Divider */}
              {/* <div className="h-4 w-[1px] bg-gray-300 mx-0.5"></div> */}
            </div>
          </div>
        </div>

        {/* Main Content: List and Map - Using PropertyListDev Component */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading properties...</p>
          </div>
        ) : (
          <PropertyListDev properties={filteredProperties} viewMode={viewMode} />
        )}
      </div>



    </div>
  );
}
