"use client";

import { MapPin, Check } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";

export default function PropertyListDev({ properties = [], viewMode = "LIST" }) {
    // Static description text
    const staticDescription = "Luxury residential towers offering stunning sea views and premium residential, commercial, and leisure facilities.";

    // Static tags
    const staticTags = [
        "Smart City",
        "Private Beach Access",
        "Concierge Service",
        "+1"
    ];

    // Static status labels
    const getStatusLabel = (statusType) => {
        if (statusType === "completed") {
            return "Completed";
        }
        return "Commercial"; // Default label
    };

    if (viewMode === "MAP") {
        return (
            /* MAP View */
            <div className="hidden lg:block w-full mt-6 relative" style={{ height: "calc(100vh - 200px)", minHeight: "60vh" }}>
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
                        className="bg-gray-100 rounded-md shadow-md"
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
                            <div className="absolute backdrop-blur-md bg-gradient-to-b from-gray-100/20 to-gray-100 shadow-md bottom-0 left-0 right-0 p-3 lg:p-4">
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
                                    <h3 className="text-base lg:text-xl font-semibold text-[#001730] truncate w-full lg:w-auto">
                                        {property.title || "Untitled Property"}
                                    </h3>


                                </div>

                                <div className="flex items-center text-[#001730] text-xs lg:text-sm flex-shrink-0">
                                    <MapPin size={12} className="mr-1" />
                                    <span className="truncate">{property.location || "Location not specified"}</span>
                                </div>

                                <div className="w-[60%] h-[1px] bg-gray-500 my-2"></div>

                                {/* Static Description */}
                                <p className="text-xs lg:text-sm text-[#001730] leading-snug">
                                    {staticDescription}
                                </p>
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
                                    <img
                                        src="/Time.png"
                                        className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 object-contain"
                                    />
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
                                    <img
                                        src="/3_Icons Used_Project Dvt 1 (1).png"
                                        className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 object-contain"
                                    />
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

                            {/* TAGS — GRID RESPONSIVE - Static */}

                            <div className="p-2 shadow-md bg-gray-50 rounded-md mt-2">
                                <div className="grid grid-cols-[1fr_1fr_1fr_60px] gap-1">

                                    {staticTags.map((tag, index) => (
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
        "
                                        >
                                            {tag}
                                        </div>
                                    ))}

                                </div>
                            </div>



                            {/* Map - Static */}
                            <img
                                src="/div.property-thumbnail-wrapper (2).png"
                                className="w-full h-20 mt-3 object-cover"
                                alt="Property map"
                            />
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

