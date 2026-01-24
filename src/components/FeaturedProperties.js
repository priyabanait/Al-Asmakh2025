"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { fetchProperties, fetchPropertiesByOfferingType } from "../utils/propertyapi";

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
  locationLevel1 = ""
}) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch properties from API with filters
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        
        // If offeringType is provided, use fetchPropertiesByOfferingType (same as Services-lease.js)
        if (offeringType) {
          const fetchedProperties = await fetchPropertiesByOfferingType(offeringType, {
            page: 1,
            limit: limit,
            type: type,
          });

          // Use API response data only
          if (fetchedProperties && Array.isArray(fetchedProperties)) {
            setProperties(fetchedProperties);
          } else {
            setProperties([]);
          }
        } else {
          // Otherwise use fetchProperties with priceType
          // Build filters object - always use "published" status if not explicitly set otherwise
          const filters = {
            page: 1,
            limit: limit,
            status: status || "published", // Default to published/active properties
          };

          // Add priceType filter if provided
          if (priceType) {
            filters.priceType = priceType;
          }

          // Add type filter if provided
          if (type) {
            filters.type = type;
          }

          // Add location filter if provided
          if (locationLevel1) {
            filters.locationLevel1 = locationLevel1;
          }

          // Use fetchProperties from propertyapi.js
          const result = await fetchProperties(filters);
          console.log(`Properties loaded (priceType: ${priceType || 'all'}):`, result.properties.length);
          setProperties(result.properties);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError(err.message || "Failed to load properties");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [priceType, offeringType, limit, status, type, locationLevel1]);


  // Helper function to format property data (handles both raw and pre-formatted properties)
  const formatProperty = (property) => {
    // If property is already formatted by fetchProperties, use it as-is with minor adjustments
    if (property.image && property.bedrooms !== undefined) {
      return {
        id: property.id,
        title: property.title || "Property",
        location: property.location || "Location not specified",
        price: property.price || "Price on request",
        beds: property.bedrooms || property.beds || 0,
        baths: property.bathrooms || property.baths || 0,
        area: property.area || 0,
        image: property.image || "/div.property-thumbnail-wrapper.png",
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

    let location = property.location || "Location not specified";
    if (!location || location === "Location not specified") {
      if (property.locationLevel1) {
        location = property.locationLevel1;
        if (property.locationLevel2) location += `, ${property.locationLevel2}`;
        if (property.locationLevel3) location += `, ${property.locationLevel3}`;
      } else if (property.address) {
        location = property.address;
      }
    }

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
    };
  };

  // Format properties (fetchProperties already formats them, but we ensure compatibility)
  const formattedProperties = properties && properties.length > 0 ? properties.map(formatProperty) : [];

  return (
    <div className="relative w-full py-4 lg:py-4 px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-4 3xl:px-4 4xl:px-4 5xl:px-4">
      <div className="max-w-[1500px] mt-10 mx-auto w-full">
        <h2
          id="my-heading"
          className="text-2xl text-[#001730] uppercase mb-2  lg:mb-2 text-center"
        >
          FEATURED PROPERTIES
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
          From luxury residences to commercial developments, we deliver trusted
          services that turn your

          real estate goals into reality.
        </p>

        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading properties...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            <p>Error loading properties: {error}</p>
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
                  className={`
          w-[250px]  lg:w-[335px]
          p-4
          bg-[#E9E9E9] border border-gray-200 
          rounded-md overflow-hidden shadow-md 
          hover:shadow-xl transition-shadow duration-300 
          flex-shrink-0
          ${index === 0 || index === formattedProperties.length - 1
                      ? 'scale-95'
                      : 'scale-100'
                    }
        `}
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
                  </div>

                  {/* Property Info */}
                  <div className="py-2">
                    <h3 className="font-semibold text-[#001730] text-sm lg:text-lg mb-1 leading-snug line-clamp-2 min-h-[2.5rem] lg:min-h-[3.125rem]">
                      {property.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center text-[#001730] text-sm mb-3">
                      <MapPin size={12} className="mr-2" />
                      <span
                        className="line-clamp-1 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl"
                        style={{ fontSize: "clamp(13px, 0.8vw, 17px)" }}
                      >
                        {property.location}
                      </span>
                    </div>


                    {/* Bed/Bath/Area Info */}
                    <div className="grid grid-cols-3 gap-2 lg:gap-3 text-[#001730] text-xs lg:text-sm mb-3 lg:mb-4">

                      <div className="flex items-center justify-center gap-1 bg-[#F5F5F5] shadow p-1.5 lg:p-2 rounded-md">
                        <Image
                          src="/Icon (1).png"
                          alt="Beds"
                          width={14}
                          height={14}
                          className="lg:w-[18px] lg:h-[18px]"
                        />
                        <span>{property.beds || property.bedrooms || 0}</span>
                      </div>

                      <div className="flex items-center justify-center gap-1 bg-[#F5F5F5] shadow p-1.5 lg:p-2 rounded-md">
                        <Image
                          src="/Icon.png"
                          alt="Baths"
                          width={14}
                          height={14}
                          className="lg:w-[18px] lg:h-[18px]"
                        />
                        <span>{property.baths || property.bathrooms || 0}</span>
                      </div>

                      <div className="flex items-center justify-center gap-1 bg-[#F5F5F5] shadow p-1.5 lg:p-2 rounded-md">
                        <Image
                          src="/Icon (2).png"
                          alt="Area"
                          width={14}
                          height={14}
                          className="lg:w-[18px] lg:h-[18px]"
                        />
                        <span>{property.area}</span>
                      </div>

                    </div>


                    <div
                      className="w-[100%]  h-[0.5px] bg-gray-300  my-3 "
                    ></div>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-base md:text-base lg:text-base xl:text-lg 2xl:text-lg 3xl:text-xl 4xl:text-2xl 5xl:text-3xl font-semibold text-[#001730]">
                        {property.price && !property.price.includes('QAR') ? `${property.price} QAR` : property.price}
                      </p>

                      <button className="bg-[#001730] text-white text-[12px] px-3 md:px-4 lg:px-5 xl:px-5 2xl:px-6 3xl:px-7 4xl:px-8 5xl:px-10 py-1.5  lg:py-2  rounded-md flex items-center justify-between shadow-lg transition-all duration-300 hover:bg-[#002d52]">
                        <Link
                          href={`/propertydetails?id=${property.id}`}
                          className="flex items-center gap-2 w-full"
                        >
                          <span>Details</span>
                          <FaArrowRight
                            size={12}
                            className="w-3 h-3  lg:w-[16px]  ml-10"
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

