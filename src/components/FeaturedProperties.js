"use client";
import React from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import { TbView360Number } from "react-icons/tb";
import { HiOutlineSquare2Stack } from "react-icons/hi2";
import { RiHotelBedLine } from "react-icons/ri";
import { BiBath } from "react-icons/bi";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { fetchProperties, fetchPropertiesByOfferingType } from "../utils/propertyapi";
import { useQuery } from "@tanstack/react-query";

/**
 * FeaturedProperties Component
 * @param {Object} props
 * @param {string} props.priceType - Filter by price type: 'sale' or 'rent' (optional)
 * @param {string} props.offeringType - Filter by offering type: 'lease', 'sale', 'marketing' (optional, uses same API as Services-lease.js)
 * @param {number} props.limit - Number of properties to fetch (default: 4)
 * @param {string} props.status - Property status filter (default: 'published')
 * @param {string} props.viewAllLink - Link for View All button (default: '/listings/rent')
 * @param {string} props.type - Property type filter (optional)
 * @param {string} props.locationLevel1 - Location level 1 filter (optional)
 */
export default function FeaturedProperties({ 
  priceType = "", 
  offeringType = "",
  limit = 4, 
  status = "published",
  viewAllLink = "/listings/rent",
  type = "",
  locationLevel1 = "",
  title = "",
  description = "",

}) {
  // React Query: cache and manage featured properties on the frontend
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "featuredProperties",
      { priceType, offeringType, limit, status, type, locationLevel1 },
    ],
    queryFn: async () => {
      // If offeringType is provided, use fetchPropertiesByOfferingType (same as Services-lease.js)
      if (offeringType) {
        const fetchedProperties = await fetchPropertiesByOfferingType(offeringType, {
          page: 1,
          limit,
          type,
        });
        return Array.isArray(fetchedProperties) ? fetchedProperties : [];
      }

      // Otherwise use fetchProperties with priceType
      const filters = {
        page: 1,
        limit,
        status: status || "published",
      };

      if (priceType) {
        filters.priceType = priceType;
      }
      if (type) {
        filters.type = type;
      }
      if (locationLevel1) {
        filters.locationLevel1 = locationLevel1;
      }

      const result = await fetchProperties(filters);
      return result.properties || [];
    },
    keepPreviousData: true,
  });

  const properties = data || [];


  // Helper function to format property data (handles both raw and pre-formatted properties)
  const formatProperty = (property) => {
    // Helper to get location from level2 and level3 only (exclude level1)
    const getLocation = (prop) => {
      // Always prioritize locationLevel2 and locationLevel3, never use locationLevel1
      if (prop.locationLevel2 && String(prop.locationLevel2).trim() !== "") {
        let loc = String(prop.locationLevel2).trim();
        if (prop.locationLevel3 && String(prop.locationLevel3).trim() !== "") {
          loc += `, ${String(prop.locationLevel3).trim()}`;
        }
        return loc;
      }
      // Only use address as fallback if level2/level3 are not available
      if (prop.address && String(prop.address).trim() !== "") {
        return String(prop.address).trim();
      }
      // Last resort fallback
      return "Location not specified";
    };

    // If property is already formatted by fetchProperties, use it as-is with minor adjustments
    if (property.image && property.bedrooms !== undefined) {
      return {
        id: property.id,
        title: property.title || "Property",
        location: getLocation(property),
        price: property.price || "Price on request",
        beds: property.bedrooms || property.beds || 0,
        baths: property.bathrooms || property.baths || 0,
        area: property.area || 0,
        image: property.image || "/div.property-thumbnail-wrapper.png",
        priceType: property.priceType || property.offeringType || "rent",
        virtualTourUrl: property.virtualTourUrl || null,
      };
    }

    // Otherwise, format raw property data or properties from fetchPropertiesByOfferingType
    let imageUrl = "/div.property-thumbnail-wrapper.png";
    // First check if image is already set (from fetchPropertiesByOfferingType)
    if (property.image && property.image !== "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80") {
      imageUrl = property.image;
    } else if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      // Extract from images array (raw API format)
      imageUrl = property.images[0].url || property.images[0].thumbnailUrl || imageUrl;
    }

    // Only use locationLevel2 and locationLevel3, exclude locationLevel1
    const location = getLocation(property);
    

    let price = property.price || "Price on request";
    if (price === "Price on request" && property.priceAmount) {
      const currency = property.priceCurrency || "QAR";
      const frequency = property.priceFrequency ? `/${property.priceFrequency}` : "";
      price = `${property.priceAmount.toLocaleString()} ${currency}${frequency}`;
    }

    // Extract bedrooms - handle both string and number
    let beds = 0;
    if (property.bedrooms !== undefined && property.bedrooms !== null) {
      beds = typeof property.bedrooms === 'string' ? parseInt(property.bedrooms) || 0 : property.bedrooms;
    } else {
      beds = property.beds || property.bed || 0;
    }

    // Extract bathrooms - handle both string and number
    let baths = 0;
    if (property.bathrooms !== undefined && property.bathrooms !== null) {
      baths = typeof property.bathrooms === 'string' ? parseInt(property.bathrooms) || 0 : property.bathrooms;
    } else {
      baths = property.baths || property.bath || 0;
    }

    // Extract area/size
    const area = property.size || property.area || property.square_feet || 0;

    return {
      id: property.id || property._id || Math.random(),
      title: property.title || property.titleEn || property.name || property.property_name || "Property",
      location: location,
      price: price,
      beds: beds,
      baths: baths,
      area: area,
      image: imageUrl,
      priceType: property.priceType || property.offeringType || "rent",
      virtualTourUrl: property.virtualTourUrl || null,
    };
  };

  // Format properties (fetchProperties already formats them, but we ensure compatibility)
  const formattedProperties = properties && properties.length > 0 ? properties.map(formatProperty) : [];

  return (
    <div className="relative w-full py-4 lg:py-4 px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-4 3xl:px-4 4xl:px-4 5xl:px-4">
      <div className="max-w-[1500px] mt-5 mx-auto w-full">
        <h2
          id="my-heading"
          className="text-2xl text-[#001730] uppercase mb-2  lg:mb-2 text-center"
        >
          {title ? title :"Featured Properties"}
        </h2>
        <div className="flex-1 h-[0.5px] bg-gray-300 my-2 lg:my-2
          mx-auto w-[60%] md:w-[40%] lg:w-[20%] "></div>
        <p
          id="desc"
          className="
    text-gray-500 
    mx-auto text-center px-2 md:px-4 lg:px-0

    max-w-xs md:max-w-xl lg:max-w-2xl 
   
   

    mb-6 md:mb-8 lg:mb-12 xl:mb-12 2xl:mb-14 3xl:mb-16 4xl:mb-20 5xl:mb-24
 
  " style={{ fontSize: "clamp(13px, 0.8vw, 17px)" }}
        >
        
        
       {description ? description:" From luxury residences to commercial developments, we deliver trusted services that turn your real estate goals into reality. "}
         
        </p>

        {isLoading ? (
          <div className="text-center text-gray-500 py-8">Loading properties...</div>
        ) : isError ? (
          <div className="text-center text-red-500 py-8">
            <p>Error loading properties: {error?.message || "Failed to load properties"}</p>
            <p className="text-xs mt-2">Check browser console for details</p>
          </div>
        ) : !properties || properties.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No properties available at the moment.</p>
            <p className="text-xs mt-2">Check browser console for API response details</p>
          </div>
        ) : (
          <>
            <div
              className="flex gap-3 md:gap-4 lg:gap-6 xl:gap-6 2xl:gap-7 3xl:gap-8 4xl:gap-10 5xl:gap-12 overflow-x-auto scroll-smooth pb-4 lg:pb-6"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e0 transparent'
              }}
            >
              {formattedProperties.map((property, index) => (
                <div
                  key={property.id || index}
                  className="w-[250px] lg:w-[335px] p-4 bg-[#E9E9E9] border border-gray-200 rounded-md overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex-shrink-0"
                >
                  {/* Image Section */}
                  <div className="relative w-full h-[180px]  xl:h-[200px] ">
                    <Image
                      src={property.image || "/div.property-thumbnail-wrapper.png"}
                      alt={property.title}
                      fill
                      className="object-fill rounded-md"
                      unoptimized={property.image?.startsWith('http')}
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
                        <span className="text-[#001730] font-bold text-[10px] lg:text-[10px] uppercase tracking-wide">
                          {property.priceType === 'sale' ? 'SALE' : 
                           property.priceType === 'rent' || property.priceType === 'lease' ? 'RENT' : 
                           property.priceType === 'marketing' ? 'MARKETING' : 
                           property.priceType?.toUpperCase() || 'RENT'}
                        </span>
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
                        <TbView360Number className="text-[#062e59] w-4 h-5 lg:w-10 lg:h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="py-2">
                    <h3 className="font-semibold text-[#001730] text-sm lg:text-lg mb-1 leading-snug line-clamp-2 min-h-[1.5rem] lg:min-h-[3.125rem]">
                      {property.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center text-[#001730] text-sm mb-3">
                      <MapPin size={12} className="mr-2" />
                      <span className="line-clamp-1 text-xs md:text-xs lg:text-sm">
                        {property.location}
                      </span>
                    </div>

                    {/* Bed/Bath/Area Info */}
                    <div className="grid grid-cols-3 gap-2 lg:gap-3 text-[#001730] text-xs lg:text-sm mb-3 lg:mb-4">
                      <div className="flex items-center justify-center gap-1 bg-[#F5F5F5] shadow p-1.5 lg:p-2 rounded-md">
                        <RiHotelBedLine className="w-3.5 h-3.5 lg:w-[18px] lg:h-[18px] text-[#212633]" />
                        <span>{property.beds || property.bedrooms || 0}</span>
                      </div>

                      <div className="flex items-center justify-center gap-1 bg-[#F5F5F5] shadow p-1.5 lg:p-2 rounded-md">
                        <BiBath className="w-3.5 h-3.5 lg:w-[18px] lg:h-[18px] text-[#212633]" />
                        <span>{property.baths || property.bathrooms || 0}</span>
                      </div>

                      <div className="flex items-center justify-center gap-1 bg-[#F5F5F5] shadow p-1.5 lg:p-2 rounded-md">
                        <HiOutlineSquare2Stack className="w-3.5 h-3.5 lg:w-[18px] lg:h-[18px] text-[#212633]" />
                        <span>{Number(property.area || 0).toFixed(0)}</span>
                      </div>
                    </div>

                    <div className="w-[100%] h-[0.5px] bg-gray-300 my-3"></div>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-base md:text-base lg:text-base xl:text-lg font-semibold text-[#001730]">
                        {property.price && typeof property.price === "string" && property.price.includes("QAR")
                          ? property.price
                          : property.price
                            ? `${property.price} QAR`
                            : "Price on request"}
                      </p>

                      <button className="w-[150px] md:w-auto bg-[#001730] text-white text-[12px] px-3 md:px-4 lg:px-5 xl:px-5 py-1.5 lg:py-2 rounded-md flex items-center justify-between shadow-lg transition-all duration-300 hover:bg-[#002d52]">
                        <Link
                          href={`/propertydetails?id=${property.id}`}
                          className="flex items-center gap-2 w-full"
                        >
                          <span>Details</span>
                          <FaArrowRight
                            size={12}
                            className="w-3 h-3 lg:w-[16px] ml-16 lg:ml-10"
                          />
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button - Moved inside max-w container */}
            <div className="flex justify-center mt-4 lg:mt-6 mb-5">
              <Link href={viewAllLink}>
                <button className="bg-[#001730] text-white text-[12px] px-4 md:px-4 lg:px-5 xl:px-5 2xl:px-6 3xl:px-7 4xl:px-8 5xl:px-10 py-1.5 md:py-1.5 lg:py-2 xl:py-2 2xl:py-3 3xl:py-3 4xl:py-4 5xl:py-5 rounded flex items-center justify-center gap-2 transition hover:bg-[#1b3a70]">
                  <span>View All</span>
                  <FaArrowRight
                    size={12}
                    className="w-3 h-3  lg:w-[12px] lg:h-[12px] ml-20"
                  />
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

