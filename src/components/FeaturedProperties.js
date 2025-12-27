"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import { MapPin } from "lucide-react";
import axios from "axios";

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const [showScrollButtonRight, setShowScrollButtonRight] = useState(false);
  const [showScrollButtonLeft, setShowScrollButtonLeft] = useState(false);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const BASE_URL = "http://40.81.255.90";
        const response = await axios.get(`${BASE_URL}/api/v1/properties/`);

        console.log("API Response:", response.data);
        console.log("Response structure:", {
          hasData: !!response.data,
          isArray: Array.isArray(response.data),
          hasProperties: !!response.data?.properties,
          hasDataProperty: !!response.data?.data,
          hasResults: !!response.data?.results,
        });

        // Handle different response structures
        let propertiesData = [];
        if (response.data) {
          // Check for properties array (API returns {pagination: {...}, properties: [...]})
          if (response.data.properties && Array.isArray(response.data.properties)) {
            propertiesData = response.data.properties;
            console.log("Found properties array with", propertiesData.length, "items");
          }
          // If response.data is an array
          else if (Array.isArray(response.data)) {
            propertiesData = response.data;
            console.log("Response.data is array with", propertiesData.length, "items");
          }
          // If response.data has a data property that's an array
          else if (response.data.data && Array.isArray(response.data.data)) {
            propertiesData = response.data.data;
            console.log("Found data.data array with", propertiesData.length, "items");
          }
          // If response.data has a results property (pagination)
          else if (response.data.results && Array.isArray(response.data.results)) {
            propertiesData = response.data.results;
            console.log("Found results array with", propertiesData.length, "items");
          } else {
            console.log("No properties found in response. Response keys:", Object.keys(response.data || {}));
            console.log("Full response.data:", JSON.stringify(response.data, null, 2));
          }
        }

        // Filter out properties with status 'draft' if needed, or show all
        // You can uncomment this if you only want to show published properties
        // propertiesData = propertiesData.filter(p => p.status === 'published' || p.status === 'active');

        console.log("Final propertiesData length:", propertiesData.length);
        console.log("First property sample:", propertiesData[0]);
        setProperties(propertiesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching properties:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(err.message);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const checkScrollButtons = () => {
    const el = scrollRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      const canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
      const canScrollLeft = el.scrollLeft > 1;

      setShowScrollButtonRight(hasOverflow && canScrollRight);
      setShowScrollButtonLeft(hasOverflow && canScrollLeft);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Check buttons after properties are loaded
    if (properties.length > 0) {
      setTimeout(checkScrollButtons, 100);
    }

    const handleScroll = () => {
      checkScrollButtons();
    };

    const handleResize = () => {
      checkScrollButtons();
    };

    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [properties]);

  // Helper function to format property data
  const formatProperty = (property) => {
    // Get first image from images array
    let imageUrl = "/div.property-thumbnail-wrapper.png";
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      imageUrl = property.images[0].url || property.images[0].thumbnailUrl || imageUrl;
    }

    // Format location from locationLevel fields
    let location = "Location not specified";
    if (property.locationLevel1) {
      location = property.locationLevel1;
      if (property.locationLevel2) location += `, ${property.locationLevel2}`;
      if (property.locationLevel3) location += `, ${property.locationLevel3}`;
    } else if (property.address) {
      location = property.address;
    }

    // Format price
    let price = "Price on request";
    if (property.priceAmount) {
      const currency = property.priceCurrency || "QAR";
      const frequency = property.priceFrequency ? `/${property.priceFrequency}` : "";
      price = `${property.priceAmount.toLocaleString()} ${currency}${frequency}`;
    }

    return {
      id: property.id || property._id || Math.random(),
      title: property.titleEn || property.title || property.name || property.property_name || "Property",
      location: location,
      price: price,
      beds: property.bedrooms || property.beds || property.bed || 0,
      baths: property.bathrooms || property.baths || property.bath || 0,
      area: property.size || property.area || property.square_feet || 0,
      image: imageUrl,
    };
  };

  // Only format properties if they exist
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
          <br />
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
              ref={scrollRef}
              className="flex gap-3 md:gap-4 lg:gap-6 xl:gap-6 2xl:gap-7 3xl:gap-8 4xl:gap-10 5xl:gap-12 overflow-x-auto no-scrollbar scroll-smooth pb-4 lg:pb-6 "
            >
              {formattedProperties.map((property, index) => (
                <div
                  key={property.id || index}
                  className={`
          w-[250px]  lg:w-[350px]
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
                    <h3 className="font-semibold text-[#001730] text-sm lg:text-lg mb-1 leading-snug line-clamp-2">
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
                        <span>{property.beds}</span>
                      </div>

                      <div className="flex items-center justify-center gap-1 bg-[#F5F5F5] shadow p-1.5 lg:p-2 rounded-md">
                        <Image
                          src="/Icon.png"
                          alt="Baths"
                          width={14}
                          height={14}
                          className="lg:w-[18px] lg:h-[18px]"
                        />
                        <span>{property.baths}</span>
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
                        {property.price}
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
              <button className="bg-[#001730] text-white text-[12px] px-4 md:px-4 lg:px-5 xl:px-5 2xl:px-6 3xl:px-7 4xl:px-8 5xl:px-10 py-1.5 md:py-1.5 lg:py-2 xl:py-2 2xl:py-3 3xl:py-3 4xl:py-4 5xl:py-5 rounded flex items-center justify-center gap-2 transition hover:bg-[#1b3a70]">
                <span>View All</span>
                <FaArrowRight
                  size={12}
                  className="w-3 h-3  lg:w-[12px] lg:h-[12px] ml-20"
                />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Left Scroll Button */}
      {showScrollButtonLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 md:left-3 lg:left-4 xl:left-5 2xl:left-6 3xl:left-8 4xl:left-10 5xl:left-12 top-1/2 transform -translate-y-1/2 
                     bg-white border border-gray-300 rounded-md p-2 md:p-2.5 lg:p-3 xl:p-3.5 2xl:p-4 3xl:p-5 4xl:p-6 5xl:p-7 px-4 md:px-5 lg:px-6 xl:px-7 2xl:px-8 3xl:px-10 4xl:px-12 5xl:px-14
                     shadow-md z-10 hover:shadow-lg transition"
        >
          <FaArrowLeft className="text-[#001730] w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10 4xl:w-12 4xl:h-12 5xl:w-14 5xl:h-14" />
        </button>
      )}

      {/* Right Scroll Button */}
      {showScrollButtonRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 md:right-3 lg:right-4 xl:right-5 2xl:right-6 3xl:right-8 4xl:right-10 5xl:right-12 top-1/2 transform -translate-y-1/2 
                     bg-white border border-gray-300 rounded-md p-2 md:p-2.5 lg:p-3 xl:p-3.5 2xl:p-4 3xl:p-5 4xl:p-6 5xl:p-7 px-4 md:px-5 lg:px-6 xl:px-7 2xl:px-8 3xl:px-10 4xl:px-12 5xl:px-14
                     shadow-md z-10 hover:shadow-lg transition"
        >
          <FaArrowRight className="text-[#001730] w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10 4xl:w-12 4xl:h-12 5xl:w-14 5xl:h-14" />
        </button>
      )}
    </div>
  );
}

