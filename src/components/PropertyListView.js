"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import ShareButton from "./ShareButton";
import { FaArrowRight, FaBath } from "react-icons/fa6";
import { Md360 } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";
import Link from "next/link";
import { FaList, FaBed, FaRulerCombined } from "react-icons/fa";
import CompareButton from "./CompareButton";
import CompareModal from "./CompareModal";
import InteractivePropertyMap from "./InteractivePropertyMap";

export default function PropertyListView({ properties = [], totalProperties = 0 }) {
    const [viewMode, setViewMode] = useState("LIST"); // "LIST" or "MAP"
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [mapLoading, setMapLoading] = useState(true);

    // Reset map loading when switching to map view
    useEffect(() => {
        if (viewMode === "MAP") {
            setMapLoading(true);
        } else {
            setMapLoading(false);
        }
    }, [viewMode]);

    return (
        <div className="hidden lg:block lg:py-4 py-4">
            {/* Header Bar */}
            <div className="bg-white border-gray-200 px-2 lg:px-4">
                <div className="hidden lg:flex max-w-full mb-4 bg-white mx-auto items-center gap-4">
                    {/* Showing Count (Left) */}
                    <div className="text-gray-400 text-sm font-medium whitespace-nowrap">
                        Showing {properties.length} of {totalProperties || properties.length}
                    </div>

                    {/* CENTER LINE */}
                    <div className="flex-1 h-[1px] bg-gray-300"></div>

                    {/* LIST / MAP Buttons (Right) */}
                    <div className="flex items-center gap-2">
                        {/* LIST Button */}
                        <button
                            onClick={() => setViewMode("LIST")}
                            className={`flex items-center gap-1.5 px-6 py-2 rounded-md text-base font-semibold transition-all
                ${viewMode === "LIST"
                                    ? "border border-white/40 backdrop-blur-md bg-[#e3e2d8]/40 text-[#001730] shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                                    : "text-gray-600"
                                }`}
                        >
                            <FaList size={14} />
                            <span className="text-[15px]">List</span>
                        </button>

                        {/* Divider */}
                        <div className="h-4 w-[1px] bg-gray-300 mx-0.5"></div>

                        {/* MAP Button */}
                        <button
                            onClick={() => setViewMode("MAP")}
                            className={`flex items-center gap-1.5 px-6 py-2 rounded-md text-base font-semibold transition-all ${viewMode === "MAP"
                                ? "border border-white/40 backdrop-blur-md bg-[#e3e2d8]/40 text-[#001730] shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                                : "text-gray-600"
                                }`}
                        >
                            <FaMapLocationDot size={14} />
                            <span className="text-[15px]">Map</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content: List and Map */}
            {viewMode === "LIST" ? (
                <div className="grid gap-6 px-20 bg-[#F9F9F9] lg:grid-cols-3 xl:grid-cols-4 p-4">
                    {properties.map((property, index) => (
                        <div
                            key={property.id || index}
                            className="w-full p-4 bg-[#E9E9E9] border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Image Section */}
                            <div className="relative w-full h-[220px]">
                                <Image
                                    src={property.image || (property.images && property.images[0]) || "/placeholder-property.jpg"}
                                    alt={property.title || property.titleEn || "Property"}
                                    fill
                                    className="object-fill rounded-md"
                                />
                                {/* Glass Effect Overlay with Property Type and 360° Icon */}
                                <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-1.5 lg:p-2">
                                    {/* Property Type Badge - Glass Effect */}
                                    <div
                                        className="px-2 py-1 lg:px-2.5 lg:py-1 rounded-md backdrop-blur-sm border border-white/30"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.15)',
                                            backdropFilter: 'blur(8px)',
                                            WebkitBackdropFilter: 'blur(8px)',
                                            boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)'
                                        }}
                                    >
                                        {/*
                                          Normalize priceType so we always show correct label:
                                          - "sale"  -> SALE
                                          - "rent"/"lease" -> RENT
                                          - "marketing" -> MARKETING
                                          - fallback -> uppercased raw value or RENT
                                        */}
                                        
                                        {(() => {
                                            const normalized = (property.priceType || "").toString().toLowerCase().trim();
                                            if (normalized === "sale") return (
                                                <span className="text-white font-semibold text-[10px] lg:text-xs uppercase tracking-wide">
                                                    SALE
                                                </span>
                                            );
                                            if (normalized === "rent" || normalized === "lease") return (
                                                <span className="text-white font-semibold text-[10px] lg:text-xs uppercase tracking-wide">
                                                    RENT
                                                </span>
                                            );
                                            if (normalized === "marketing") return (
                                                <span className="text-white font-semibold text-[10px] lg:text-xs uppercase tracking-wide">
                                                    MARKETING
                                                </span>
                                            );
                                            const fallback = normalized || "rent";
                                            return (
                                                <span className="text-white font-semibold text-[10px] lg:text-xs uppercase tracking-wide">
                                                    {fallback.toUpperCase()}
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    {/* 360° Icon Badge - Glass Effect */}
                                    <div
                                        className="px-2 py-1 lg:px-2.5 lg:py-1 rounded-md backdrop-blur-sm border border-white/30 flex items-center justify-center"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.15)',
                                            backdropFilter: 'blur(8px)',
                                            WebkitBackdropFilter: 'blur(8px)',
                                            boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)'
                                        }}
                                    >
                                        <Md360 className="text-white w-3 h-3 lg:w-4 lg:h-4" />
                                    </div>
                                </div>
                                {/* Share Button Overlay */}
                                <div className="absolute bottom-2 right-2 z-10">
                                    <ShareButton
                                        propertyTitle={property.title}
                                        propertyLocation={property.location}
                                        propertyUrl={typeof window !== 'undefined' ? window.location.href : ''}
                                        property={property}
                                    />
                                </div>
                            </div>

                            {/* Property Info */}
                            <div className="pt-2">
                                <h3 className="font-semibold text-[#001730] text-base mb-1 leading-snug line-clamp-2">
                                    {property.title}
                                </h3>

                                {/* Location */}
                                <div className="flex items-center text-[#001730] text-sm mb-3">
                                    <MapPin size={12} className="mr-2" />
                                    <span>{property.location}</span>
                                </div>

                                {/* Bed/Bath/Area Info */}
                                <div className="grid grid-cols-3 gap-2 lg:gap-4 text-[#001730] text-sm mb-4">
                                    {/* Beds */}
                                    <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4 rounded-md justify-center">
                                        <FaBed className="w-[18px] h-[18px] text-[#001730]" />
                                        <span className="text-xs lg:text-sm">{property.bedrooms}</span>
                                    </div>

                                    {/* Baths */}
                                    <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4 rounded-md justify-center">
                                        <FaBath className="w-[18px] h-[18px] text-[#001730]" />
                                        <span className="text-xs lg:text-sm">{property.bathrooms}</span>
                                    </div>

                                    {/* Area */}
                                    <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4 rounded-md justify-center">
                                        <FaRulerCombined className="w-[18px] h-[18px] text-[#001730]" />
                                        <span className="text-xs lg:text-sm">{property.area}</span>
                                    </div>
                                </div>

                                <div className="w-[100%] h-[0.5px] bg-gray-300 my-3"></div>

                                {/* Price and Button */}
                                <div className="flex items-center justify-between">
                                    <p className="text-base font-bold text-[#001730]">{property.price} QAR</p>

                                    <button className="bg-[#001730] text-white text-[12px] font-medium px-3 md:px-4 lg:px-5 xl:px-5 2xl:px-6 3xl:px-7 4xl:px-8 5xl:px-10 py-1.5 lg:py-2 rounded-md flex items-center justify-between shadow-lg transition-all duration-300 hover:bg-[#002d52]">
                                        <Link
                                            href={`/propertydetails?id=${property.id || index}`}
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
                        </div>
                    ))}
                </div>
            ) : (
                <div className="hidden lg:flex h-[calc(100vh-120px)]">
                    {/* Left Section: Property List (50%) */}
                    <div className="w-full lg:w-1/2 overflow-y-auto p-4">
                        <div className="space-y-4">
                            {properties.map((property) => (
                                <div
                                    key={property.id}
                                    data-property-id={property.id}
                                    onClick={() => setSelectedPropertyId(property.id)}
                                    className={`bg-[#E9E9E9] rounded-md mt-2 shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${selectedPropertyId === property.id ? 'ring-2 ring-[#001730] ring-offset-2' : ''
                                        }`}
                                >
                                    <div className="flex p-4 rounded-md">
                                        {/* Image Section - Left */}
                                        <div className="relative w-[320px] h-[192px] lg:w-[220px] lg:h-[192px] xl:w-[320px] xl:h-[192px] flex-shrink-0">
                                            <Image
                                                src={property.image || (property.images && property.images[0]) || "/placeholder-property.jpg"}
                                                alt={property.title || property.titleEn || "Property"}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                            {/* Share Button Overlay */}
                                            <div className="absolute bottom-2 right-2 z-10">
                                                <ShareButton
                                                    propertyTitle={property.title}
                                                    propertyLocation={property.location}
                                                    propertyUrl={typeof window !== 'undefined' ? window.location.href : ''}
                                                    property={property}
                                                />
                                            </div>
                                        </div>

                                        {/* Details Section - Right */}
                                        <div className="flex-1 p-4 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-[#001730] mb-1">
                                                    {property.title}
                                                </h3>

                                                <div className="flex items-center text-[#001730] text-sm mb-3">
                                                    <MapPin size={12} className="mr-2" />
                                                    <span>{property.location}</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 lg:gap-4 text-[#001730] text-sm mb-4">
                                                    {/* Beds */}
                                                    <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4 rounded-md justify-center">
                                                        <FaBed className="w-[18px] h-[18px] text-[#001730]" />
                                                        <span className="text-xs lg:text-sm">{property.bedrooms}</span>
                                                    </div>

                                                    {/* Baths */}
                                                    <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4 rounded-md justify-center">
                                                        <FaBath className="w-[18px] h-[18px] text-[#001730]" />
                                                        <span className="text-xs lg:text-sm">{property.bathrooms}</span>
                                                    </div>

                                                    {/* Area */}
                                                    <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4 rounded-md justify-center">
                                                        <FaRulerCombined className="w-[18px] h-[18px] text-[#001730]" />
                                                        <span className="text-xs lg:text-sm">{property.area}</span>
                                                    </div>
                                                </div>
                                                <div className="w-[100%] h-[0.5px] bg-gray-300 my-3"></div>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-lg font-bold text-[#001730] m-0">
                                                    {property.price} QAR
                                                </p>
                                                <button className="bg-[#001730] text-white text-[12px] font-medium px-3 md:px-4 lg:px-5 xl:px-5 2xl:px-6 3xl:px-7 4xl:px-8 5xl:px-10 py-1.5 lg:py-2 rounded-md flex items-center justify-between shadow-lg transition-all duration-300 hover:bg-[#002d52]">
                                                    <Link
                                                        href={`/propertydetails?id=${property.id}`}
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
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Properties Button */}
                        <div className="mt-6 mb-4">
                            <button className="w-full bg-[#001730] text-white py-3 rounded-md text-[12px] hover:bg-[#002d52] transition-colors flex items-center justify-between px-8">
                                <span>Load More Properties</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Right Section: Map (50%) */}
                    <div className="hidden lg:block w-1/2 relative mt-6 bg-gray-200">
                        {/* Interactive Map Container */}
                        <div className="w-full h-full relative">
                            {/* Loading Overlay */}
                            {mapLoading && (
                                <div className="absolute inset-0 bg-gray-200/90 backdrop-blur-sm z-50 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-8 h-8 text-[#001730] animate-spin" />
                                        <p className="text-[#001730] text-sm font-medium">Loading map...</p>
                                    </div>
                                </div>
                            )}
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
                    </div>
                </div>
            )}

            {/* Compare Button and Modal */}
            <CompareButton />
            <CompareModal />
        </div>
    );
}

