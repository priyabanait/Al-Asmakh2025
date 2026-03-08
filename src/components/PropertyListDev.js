"use client";

import { MapPin, Check } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import { FaCalendar, FaBuilding } from "react-icons/fa";
import Link from "next/link";

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyBS4N8g1D0VhjnOHwSMWRdz1JbTmEUg8Gw";

export default function PropertyListDev({ properties = [], viewMode = "LIST" }) {
    // Static description text
    const staticDescription = "Luxury residential towers offering stunning sea views and premium residential, commercial, and leisure facilities.";

    // Format amenity name from kebab-case to readable text
    const formatAmenityName = (amenity) => {
        if (!amenity) return "";
        return amenity
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    // Static status labels
    const getStatusLabel = (statusType) => {
        if (statusType === "completed") {
            return "Completed";
        }
        return "Commercial"; // Default label
    };

    // Generate Google Maps embed URL based on property location
    const getMapUrl = (property) => {
        const apiKeyParam = `&key=${GOOGLE_MAPS_API_KEY}`;
        
        // Priority 1: Use exact coordinates if available
        if (property.latitude && property.longitude) {
            return `https://www.google.com/maps?q=${property.latitude},${property.longitude}&output=embed&hl=en&z=15${apiKeyParam}`;
        }

        // Priority 2: Use area coordinates if available (for projects)
        if (property.area?.latitude && property.area?.longitude) {
            return `https://www.google.com/maps?q=${property.area.latitude},${property.area.longitude}&output=embed&hl=en&z=15${apiKeyParam}`;
        }

        // Priority 3: Build location string from location levels
        const locationParts = [
            property.locationLevel1,
            property.locationLevel2,
            property.locationLevel3,
            property.locationLevel4
        ].filter(Boolean);

        if (locationParts.length > 0) {
            const locationQuery = encodeURIComponent(locationParts.join(', ') + ', Qatar');
            return `https://www.google.com/maps?q=${locationQuery}&output=embed&hl=en&z=15${apiKeyParam}`;
        }

        // Priority 4: Use location string if available
        if (property.location) {
            const locationQuery = encodeURIComponent(property.location + ', Qatar');
            return `https://www.google.com/maps?q=${locationQuery}&output=embed&hl=en&z=15${apiKeyParam}`;
        }

        // Fallback: Default to Doha, Qatar
        return `https://www.google.com/maps?q=Doha,Qatar&output=embed&hl=en&z=15${apiKeyParam}`;
    };

    if (viewMode === "MAP") {
        return (
            /* MAP View */
            <div className="hidden lg:block w-full mt-6 relative" style={{ height: "calc(100vh - 200px)", minHeight: "60vh" }}>
                {/* Los Angeles Map */}
                <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423283.4355503344!2d-118.69192047499999!3d34.02016129999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s&key=${GOOGLE_MAPS_API_KEY}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                ></iframe>

                {/* Zoom Controls - Bottom Right */}
                <div className="absolute bottom-4 right-4 bg-white rounded-md shadow-lg flex flex-col z-10">
                    <button className="px-3 py-2 border-b border-gray-200 hover:bg-gray-50">
                        <span className="text-lg font-semibold">+</span>
                    </button>
                    <button className="px-3 py-2 hover:bg-gray-50">
                        <span className="text-lg font-semibold">-</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 mt-5 lg:mt-5 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 px-4 lg:px-10 xl:px-20">
            {properties.length === 0 ? (
                <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No properties found.</p>
                </div>
            ) : (
                properties.map((property) => (
                    <div
                        key={property.id}
                        className="bg-gray-100 rounded-md shadow-md group"
                    >
                        {/* Image */}
                        <div className="relative">
                            <img
                                src={property.image || (property.images && property.images[0]) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"}
                                alt={property.title || property.titleEn || "Property"}
                                className="w-full h-80 lg:h-80 object-cover"
                            />

                            {/* Top Labels - Dynamic from API */}
                            <div className="absolute top-2 lg:top-3 right-2 lg:right-3 flex flex-wrap gap-1 lg:gap-2">
                                {/* <span className="bg-[#8C8C8C66] text-white text-[10px] lg:text-xs px-2 py-1 rounded-md">
                                    {property.status || "Completed"}
                                </span> */}
                                <span className="bg-[#8C8C8C66] text-white text-[10px] lg:text-xs px-2 py-1 rounded-md">
                                    {getStatusLabel(property.statusType)}
                                </span>
                            </div>

                            {/* Title + Location Overlay - Dynamic from API */}
                            <div className="absolute backdrop-blur-md bg-gradient-to-b from-gray-100/20 to-gray-100 shadow-md bottom-0 left-0 right-0 p-3 lg:p-4 transition-all duration-300 ease-in-out">
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
                                    <h3 className="text-base lg:text-xl font-semibold text-[#001730] truncate w-full lg:w-auto mb-0 group-hover:mb-2 transition-all duration-300">
                                        {property.title || "Untitled Property"}
                                    </h3>
                                </div>

                                <div className="flex items-center text-[#001730] text-xs lg:text-sm flex-shrink-0 mb-0 group-hover:mb-2 transition-all duration-300">
                                    <MapPin size={12} className="mr-1" />
                                    <span className="truncate">{property.location || "Location not specified"}</span>
                                </div>

                                {/* Divider - shows on hover */}
                                <div className="w-[60%] h-[1px] bg-gray-500 my-0 group-hover:my-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                                {/* Description - shows on hover */}
                                <div className="overflow-hidden max-h-0 group-hover:max-h-[200px] transition-all duration-300 ease-in-out">
                                    <p className="text-xs lg:text-sm text-[#001730] leading-snug opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300 ease-in-out pt-0 group-hover:pt-2">
                                        {staticDescription}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="">

                            {/* Info Row — GRID RESPONSIVE - Dynamic from API */}
                            <div className="grid grid-cols-[1fr_1fr_auto] gap-1 mt-2 ">

                                {/* Year Box - Dynamic from API */}
                                <div
                                    className="
    flex items-center gap-2
    bg-gray-50 border border-gray-200 shadow-sm 
    rounded-md px-2 py-2
  "
                                >
                                    <FaCalendar className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-[#001730]" />
                                    <span className="lg:text-xs xl:text-sm font-semibold text-[#001730]">
                                        {property.year || new Date().getFullYear().toString()}
                                    </span>
                                </div>

                                {/* Units Box - Dynamic from API */}
                                <div
                                    className="
    flex items-center gap-2
    bg-white border border-gray-200 shadow-sm 
    rounded-md px-2 py-2
  "
                                >
                                    <FaBuilding className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-[#001730]" />
                                    <span className="lg:text-xs xl:text-sm font-semibold text-[#001730]">
                                        {property.units || "N/A"} <span className='text-xs text-gray-500'>Units</span>
                                    </span>
                                </div>

                                {/* Status Box - Dynamic from API */}
                                <div
                                    className="
    flex flex-col justify-center
    bg-white border border-gray-200 shadow-sm 
    rounded-md px-3 py-2
    w-fit
  "
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full ${property.statusType === "completed" ? "bg-green-500" : "bg-yellow-500"} flex items-center justify-center`}>
                                            <Check size={12} className="text-white" />
                                        </div>

                                        <span className="text-xs font-semibold">
                                            {property.status || "100%"}
                                        </span>
                                        {/* <span className="text-xs text-gray-500">
                                            {property.statusType === "completed" ? "Completed" : "Ongoing"}
                                        </span> */}
                                    </div>

                                    {/* <div className="w-full h-1 bg-green-200 rounded-full mt-1">
                                        <div className={`w-full h-full ${property.statusType === "completed" ? "bg-green-500" : "bg-yellow-500"} rounded-full`}></div>
                                    </div> */}
                                </div>

                            </div>

                            {/* AMENITIES — GRID RESPONSIVE - Dynamic from API */}

                            {property.amenities && property.amenities.length > 0 && (
                                <div className="p-2 shadow-md bg-gray-50 rounded-md mt-2">
                                    <div className="grid grid-cols-[1fr_1fr_1fr_60px] gap-1">

                                        {property.amenities.slice(0, 3).map((amenity, index) => (
                                            <div
                                                key={index}
                                                className="
          bg-gray-300 text-white
          flex items-center justify-center
          text-center
          border border-gray-200
          shadow-sm
          rounded-md
          h-10
          text-[0.6rem]
          font-semibold
          whitespace-nowrap
          px-1
        "
                                            >
                                                {formatAmenityName(amenity)}
                                            </div>
                                        ))}

                                        {property.amenities.length > 4 && (
                                            <div
                                                className="
          bg-gray-300 text-white
          flex items-center justify-center
          text-center
          border border-gray-200
          shadow-sm
          rounded-md
          h-10
          text-[0.6rem]
          font-semibold
          whitespace-nowrap
        "
                                            >
                                                +{property.amenities.length - 4}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )}



                            {/* Map - Dynamic based on location */}
    
                            <div className="w-full h-20 mt-3 rounded-md overflow-hidden relative">
  <iframe
    src={getMapUrl(property)}
    title={`Map for ${property.title || property.titleEn || "Property"}`}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="absolute inset-0 w-full h-full grayscale brightness-40 contrast-55 saturate-0"
    style={{ border: 0 }}
  />

  {/* Soft white fade overlay */}
  <div className="absolute inset-0 bg-white/35 pointer-events-none"></div>
</div>

                        </div>

                        {/* Footer - Dynamic Price from API */}
                        <div className="bg-gray-100 border-t border-gray-200 px-3 lg:px-4 py-2 lg:py-3 flex justify-between items-center rounded-b-xl">
                            <div>
                                <p className="text-[10px] lg:text-xs text-gray-500">Starting at</p>
                                <p className="text-base lg:text-lg font-semibold text-[#001730]">
                                    {property.price || "Price on request"}
                                </p>
                            </div>

                            <button className="bg-[#001730] text-white text-[12px] font-medium px-3 md:px-4 lg:px-5 xl:px-5 2xl:px-6 3xl:px-7 4xl:px-8 5xl:px-10 py-1.5 lg:py-2 rounded-md flex items-center justify-between shadow-lg transition-all duration-300 hover:bg-[#002d52]">
                                <Link
                                    href={property.projectType ? `/projects/${property.id}` : `/propertydetails?id=${property.id}`}
                                    className="flex items-center gap-2 w-full"
                                >
                                    <span>Details</span>
                                    <FaArrowRight
                                        size={12}
                                        className="w-3 h-3 lg:w-[16px] ml-10"
                                    />
                                </Link>
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

