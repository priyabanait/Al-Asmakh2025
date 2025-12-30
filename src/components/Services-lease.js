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
}) {
  const [viewMode, setViewMode] = useState("LIST"); // "LIST" or "MAP"
  const [showFilters, setShowFilters] = useState(false); // Toggle for mobile filters
  const filtersRef = useRef(null); // Ref for filter container
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters && filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  // Fetch properties from API based on offeringType
  useEffect(() => {
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
  }, [offeringType, propertyType, category, luxury, development]);



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
        <div className="absolute left-1/2 lg:bottom-[228px] bottom-56 shadow-md transform -translate-x-1/2 translate-y-1/2 z-20 w-[90%] lg:w-[50%] px-4 lg:px-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shadow-md lg:gap-6  mb-10 lg:mb-10">
            {stats.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center  border border-white/10 backdrop-blur-[10px] bg-white/20  rounded-md p-3  lg:p-6 text-white h-28 lg:h-32"
              >
                <h2 className="text-lg  lg:text-2xl font-semibold mb-2">
                  {item.value}
                </h2>
                <div className="w-[60%] h-[0.5px] bg-gray-300 lg:mb-2"></div>
                <p className="text-white text-[10px] lg:text-sm text-center">
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
            {/* Filter Items */}
            {["Property Type", "Location", "Status", "Date"].map((label, index) => {
              // Get appropriate icon for each label
              const getIcon = () => {
                switch (label) {
                  case "Property Type":
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
                  className="flex items-center justify-between bg-[#0B1F3A] text-white px-8 py-2 w-full max-w-[250px]
                       rounded-md shadow-lg hover:bg-[#001730] transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon + Divider */}
                    <div className="flex items-center gap-2">
                      {getIcon()}
                      <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                    </div>

                    {/* Label */}
                    <span className="text-[13px]">{label}</span>
                  </div>

                  {/* Down Arrow */}
                  <ArrowDown size={16} className="opacity-80" />
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
                {["Property Type", "Location", "Status", "Date"].map((label, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#0B1F3A] text-white px-4 py-3 rounded-md w-full shadow-lg hover:bg-[#001730] transition"
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon + Divider */}
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                      </div>

                      {/* Label */}
                      <span className="text-sm font-medium">{label}</span>
                    </div>

                    {/* Down Arrow */}
                    <ArrowDown size={16} className="opacity-80" />
                  </div>
                ))}
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
          {filterButtons.map((label, index) => (
            <div
              key={index}
              className="
          flex items-center justify-center bg-[#0B1F3A] text-white
          px-4 py-1.5 rounded-md shadow-lg hover:bg-[#001730] transition
        "
            >
              <span className="text-xs lg:text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>


      {/* ---------- READY TO FIND SECTION ---------- */}
      {/* <div className="hidden lg:block w-[100%] h-[1px] bg-gray-300 my-4  px-10"></div> */}


      {/* ---------- LIST AND MAP VIEW SECTION ---------- */}
      <div className="hidden lg:block lg:py-28 py-4">
        {/* Header Bar */}
        <div className="bg-white border-gray-200 px-2 lg:px-6">
          <div className="hidden lg:flex max-w-full mb-6 bg-gray-50 mx-auto items-center gap-4">
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
          <PropertyListDev properties={properties} viewMode={viewMode} />
        )}
      </div>



      <DreamPropertySection />
    </div>
  );
}
