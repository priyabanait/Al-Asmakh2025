"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Mic, MapPin, ArrowDown, Bed, Bath, Square, ArrowRight, Leaf, Home, Map as MapIcon, SlidersHorizontal } from "lucide-react";
import ShareButton from "./ShareButton";
import MoreFiltersModal from "./MoreFiltersModal";
import { FaArrowRight } from "react-icons/fa6";
import { FaMapLocationDot } from "react-icons/fa6";
import Link from "next/link";
import { FaList } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import DreamPropertySection from "./DreamPropertySection";
import PropertyListView from "./PropertyListView";
import { fetchProperties } from "../utils/propertyapi";

export default function Sale({ priceType: initialPriceType = "rent" }) {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [priceType, setPriceType] = useState(initialPriceType); // "rent" or "sale"
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProperties, setTotalProperties] = useState(0);

  // Update priceType when prop changes
  useEffect(() => {
    setPriceType(initialPriceType);
  }, [initialPriceType]);

  // Fetch properties from backend
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchProperties({
          priceType: priceType, // "rent" or "sale"
          page: 1,
          limit: 50,
          // status: "published", // Removed - show all properties (including draft) for now
        });

        setProperties(result.properties);
        setTotalProperties(result.totalProperties);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError(err.message || "Failed to load properties");
        setProperties([]);
        setTotalProperties(0);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [priceType]);

  return (
    <div>
      {/* ---------- HERO SECTION ---------- */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[85vh] flex flex-col items-center justify-center overflow-visible">
        {/* Background Image */}
        <Image
          src="/images_pages/listings.png"
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
            <div className="border border-white/10 backdrop-blur-sm bg-white/20  rounded-md border-[#8C8C8C66]  p-3 shadow-md">
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPriceType("rent")}
                  className={`px-8 py-1.5 rounded-md font-medium shadow transition ${priceType === "rent"
                    ? "bg-[#001730] text-white"
                    : "bg-gray-400 text-white"
                    }`}
                >
                  RENT
                </button>
                <button
                  onClick={() => setPriceType("sale")}
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
            <div className="bg-[#8C8C8C66] backdrop-blur-md border rounded-md border-[#8C8C8C66]  p-3 shadow-md">
              <div className="bg-white rounded-md shadow-sm flex items-center px-2 py-2">
                <button className="p-2 bg-[#001730] rounded-md mr-2 flex items-center justify-center h-8 w-8 flex-shrink-0">
                  <Search className="text-white h-4 w-4" />
                </button>
                <input
                  type="text"
                  placeholder="Type here .."
                  className="flex-1 text-gray-800 text-sm bg-transparent outline-none placeholder:text-gray-400"
                />
                <button className="p-2 bg-[#001730] rounded-md ml-2 flex items-center justify-center h-8 w-8 flex-shrink-0">
                  <Mic className="text-white h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons - Separate Box */}
            <div className="bg-[#8C8C8C66] backdrop-blur-md border rounded-md border-[#8C8C8C66]  p-3 shadow-md">
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-[#001730] text-white px-3 py-2.5 rounded-md font-medium shadow-lg text-sm">
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
            <div className="text-center text-gray-600 text-sm font-medium pt-3  pb-2">
              {loading ? "Loading..." : `Showing ${properties.length} of ${totalProperties}`}
            </div>
            <div className="w-[100%] h-[1px] bg-gray-300 my-2 mb-4  px-10"></div>
          </div>
        </div>

        {/* Desktop Version */}
        <div className="absolute left-1/2 bottom-10 mb-[6%]  transform -translate-x-1/2 translate-y-1/2 z-20 w-[70%] lg:w-[60%] hidden lg:block">
          <div className="border border-white/10 backdrop-blur-[10px] bg-white/30 rounded-md p-4 lg:p-6 shadow-lg">
            {/* Buttons Section */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => setPriceType("rent")}
                className={`px-20 py-1.5 rounded-md font-medium shadow transition ${priceType === "rent"
                  ? "bg-[#001730] text-white"
                  : "bg-[#0B1F3A]/40 text-white backdrop-blur-[20px] border border-white/40"
                  }`}
              >
                RENT
              </button>
              <button
                onClick={() => setPriceType("sale")}
                className={`px-20 py-1.5 rounded-md font-medium shadow transition ${priceType === "sale"
                  ? "bg-[#001730] text-white"
                  : "bg-[#0B1F3A]/40 text-white backdrop-blur-[20px] border border-white/40"
                  }`}
              >
                BUY
              </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-md shadow-lg flex items-center px-4 mx-20 py-3">
              <div className="p-2 bg-[#001730] rounded-md mr-2 flex items-center justify-center h-[28px] w-[28px]">
                <Search className="text-white h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Explore and discover everything about our trusted agents..."
                className="flex-1 text-gray-500 text-[8px] lg:text-base bg-transparent outline-none
                 placeholder:text-[10px] lg:placeholder:text-base placeholder:text-gray-400"
              />
              <Mic className="text-gray-500 h-5 w-5 ml-3" />
            </div>
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

      <div className="hidden lg:flex w-full justify-center lg:pt-0 pt-0 lg:-mt-[2%] relative z-30">
        <div className="grid w-full border border-white/10 backdrop-blur-[10px] bg-white/20 p-4 lg:mx-10 rounded-md shadow-md 
                  gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

          {/* Filter Items */}
          {["Property Type", "Location", "Beds", "Baths", "Price"].map((label, index) => {
            // Get appropriate icon for each label
            const getIcon = () => {
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
              <div
                key={index}
                className="flex items-center justify-between bg-[#0B1F3A] text-white px-4 py-1.5 
                     rounded-md shadow-lg hover:bg-[#001730] transition"
              >
                <div className="flex items-center gap-3">
                  {/* Icon + Divider */}
                  <div className="flex items-center gap-2">
                    {getIcon()}
                    <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                  </div>

                  {/* Label */}
                  <span className="text-[13px] ">{label}</span>
                </div>

                {/* Down Arrow */}
                <ArrowDown size={16} className="opacity-80" />
              </div>
            );
          })}
          {/* More Filters Button */}
          <button
            onClick={() => setShowMoreFilters(true)}
            className="flex text-[13px] items-center 
          justify-center  bg-[#0B1F3A]/40 text-white px-6 py-2 
          rounded-md  font-medium shadow-lg hover:bg-gray-600 transition">
            <span className="text-[13px]">+ More Filters</span>
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
        onShowResults={() => {
          // Handle show results action
          console.log("Show results clicked");
        }}
      />

      <DreamPropertySection />
    </div>
  );
}
