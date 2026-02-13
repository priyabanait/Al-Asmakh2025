"use client";
import Image from "next/image";
import React, { useRef, useState, useEffect, Suspense } from "react";
import { ArrowLeft, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { FaArrowRight, FaArrowLeft, FaChevronUp, FaChevronDown, FaBath } from "react-icons/fa6";
import { FaBed, FaRulerCombined, FaCar, FaCouch, FaBuilding, FaRegSquare, FaWifi, FaSwimmingPool, FaDumbbell, FaParking, FaSnowflake, FaDog, FaShieldAlt, FaTv, FaUtensils, FaArrowUp } from "react-icons/fa";
import { Md360 } from "react-icons/md";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchPropertyById, fetchProperties } from "../utils/propertyapi";

function PropertyDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = searchParams.get("id");

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [showScrollButtonRight, setShowScrollButtonRight] = useState(false);
  const [showScrollButtonLeft, setShowScrollButtonLeft] = useState(false);

  const scrollRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch property details
  useEffect(() => {
    const loadProperty = async () => {
      if (!propertyId) {
        setError("Property ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch property details
        const propertyData = await fetchPropertyById(propertyId);
        setProperty(propertyData);

        // Fetch related properties based on priceType (rent or sale)
        try {
          const currentPriceType = propertyData.priceType || "rent";

          // First, try to fetch properties with the same priceType
          let relatedResult = await fetchProperties({
            page: 1,
            limit: 10,
            status: "published",
            priceType: currentPriceType,
          });

          let relatedData = [];
          if (relatedResult.properties && Array.isArray(relatedResult.properties)) {
            relatedData = relatedResult.properties
              .filter(p => p.id !== propertyId)
              .slice(0, 4); // Get 4 related properties
          }

          // If no related properties found with same priceType, fetch all properties as fallback
          if (relatedData.length === 0) {
            const fallbackResult = await fetchProperties({
              page: 1,
              limit: 10,
              status: "published",
            });

            if (fallbackResult.properties && Array.isArray(fallbackResult.properties)) {
              relatedData = fallbackResult.properties
                .filter(p => p.id !== propertyId)
                .slice(0, 4);
            }
          }

          setRelatedProperties(relatedData);
        } catch (err) {
          console.error("Error fetching related properties:", err);
          // On error, try to fetch all properties as fallback
          try {
            const fallbackResult = await fetchProperties({
              page: 1,
              limit: 10,
              status: "published",
            });
            if (fallbackResult.properties && Array.isArray(fallbackResult.properties)) {
              const fallbackData = fallbackResult.properties
                .filter(p => p.id !== propertyId)
                .slice(0, 4);
              setRelatedProperties(fallbackData);
            }
          } catch (fallbackErr) {
            console.error("Error fetching fallback properties:", fallbackErr);
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(err.message || "Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  // Helper function to format property data
  const formatProperty = (property) => {
    if (!property) return null;

    // Get images
    const images = property.images && Array.isArray(property.images) && property.images.length > 0
      ? property.images.map(img => img.url || img.thumbnailUrl).filter(Boolean)
      : ["/div.property-thumbnail-wrapper.png"];

    // Format location
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
    let priceLabel = "";
    if (property.priceAmount) {
      const currency = property.priceCurrency || "QAR";
      const frequency = property.priceFrequency ? `/${property.priceFrequency}` : "";
      price = `${property.priceAmount.toLocaleString()} ${currency}${frequency}`;
      priceLabel = property.priceFrequency === "monthly" ? "Per Month" :
        property.priceFrequency === "weekly" ? "Per Week" :
          property.priceFrequency === "daily" ? "Per Day" : "";
    }

    return {
      id: property.id,
      title: property.titleEn || property.title || "Property",
      location: location,
      price: price,
      priceLabel: priceLabel,
      priceType: property.priceType || "rent",
      beds: property.bedrooms || property.beds || 0,
      baths: property.bathrooms || property.baths || 0,
      area: property.size || property.area || 0,
      plotSize: property.plotSize || 0,
      parking: property.parkingSlots || 0,
      furnishing: property.furnishingType || "Unfurnished",
      images: images,
      description: property.descriptionEn || property.description || "",
      type: property.type || "apartment",
      category: property.category || "residential",
      reference: property.reference || "",
      yearBuilt: property.age || null,
      floors: property.numberOfFloors || null,
      unitNumber: property.unitNumber || null,
      amenities: property.amenities || [],
    };
  };

  const formattedProperty = formatProperty(property);

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

    if (relatedProperties.length > 0) {
      setTimeout(checkScrollButtons, 100);
    }

    const handleScroll = () => checkScrollButtons();
    const handleResize = () => checkScrollButtons();

    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [relatedProperties]);

  // Format related property for display
  const formatRelatedProperty = (property) => {
    let imageUrl = "/div.property-thumbnail-wrapper.png";
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      // Try to get the first image URL from various possible formats
      const firstImage = property.images[0];
      imageUrl = firstImage.url || firstImage.thumbnailUrl || firstImage.imageUrl ||
        (typeof firstImage === 'string' ? firstImage : imageUrl);
    } else if (property.image) {
      // Fallback to direct image property
      imageUrl = property.image.url || property.image.thumbnailUrl || property.image || imageUrl;
    } else if (property.thumbnailUrl) {
      imageUrl = property.thumbnailUrl;
    }

    let location = "Location not specified";
    if (property.locationLevel1) {
      location = property.locationLevel1;
      if (property.locationLevel2) location += `, ${property.locationLevel2}`;
    } else if (property.address) {
      location = property.address;
    }

    let price = "Price on request";
    if (property.priceAmount) {
      const currency = property.priceCurrency || "QAR";
      const frequency = property.priceFrequency ? `/${property.priceFrequency}` : "";
      price = `${property.priceAmount.toLocaleString()} ${currency}${frequency}`;
    }

    return {
      id: property.id,
      title: property.titleEn || property.title || "Property",
      location: location,
      price: price,
      beds: property.bedrooms || property.beds || 0,
      baths: property.bathrooms || property.baths || 0,
      area: property.size || property.area || 0,
      image: imageUrl,
      // For glass overlay badges
      priceType: property.priceType || property.offeringType || "rent",
      virtualTourUrl: property.virtualTourUrl || null,
    };
  };

  if (loading) {
    return (
      <div className="w-full bg-[#F5F7FA] p-4 sm:p-6 mt-20 min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-xl">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !formattedProperty) {
    return (
      <div className="w-full bg-[#F5F7FA] p-4 sm:p-6 mt-20 min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl mb-4">{error || "Property not found"}</p>
          <Link href="/" className="text-[#001730] underline">Go back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div>

      <div className="w-full  bg-[#F5F7FA] p-4 sm:p-6 mt-20">
        {/* Back Button */}
        <div className="bg-gray-200 text-sm flex items-center w-32 sm:w-40 p-2 sm:p-3 mb-4 rounded-[5px] cursor-pointer">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#001730] font-semibold"
          >
            <ArrowLeft size={18} className="mr-4 sm:mr-10" />
            <span className="ml-2 sm:ml-8">Back</span>
          </button>
        </div>

        {/* Title + Price + Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#001730] text-white p-4 sm:p-6 rounded-[5px] shadow-md flex flex-col justify-center lg:col-span-2">
            <h1 className="text-xl sm:text-2xl ">
              {formattedProperty.title}...
            </h1>
            <div className="flex items-center text-gray-200 text-xs sm:text-sm mt-2">
              <MapPin size={16} className="mr-1" /> {formattedProperty.location}
            </div>
          </div>

          <div className="bg-[#001730] text-white p-4 sm:p-6 rounded-[5px] shadow-md flex flex-col justify-center">
            <p className="text-xs sm:text-sm opacity-80 mb-1">
              {formattedProperty.priceLabel || "Price"}
            </p>
            <h2 className="text-xl sm:text-2xl ">
              {formattedProperty.price}
            </h2>
          </div>

          <div className="bg-[#001730] p-4 sm:p-6 flex items-center justify-center">
            <div className="flex flex-col gap-2 w-full">
              <button className="w-full bg-gray-400 text-[#001730] rounded-[5px] font-semibold py-1.5 text-xs sm:text-sm shadow">
                {formattedProperty.priceType === "rent" ? "For Rent" : "For Sale"}
              </button>

              <button className="w-full bg-gray-400 text-[#001730] rounded-[5px] font-semibold py-1.5 text-xs sm:text-sm shadow">
                {formattedProperty.category === "commercial" ? "Commercial" : "Residential"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 sm:p-6">

          {/* Thumbnail Images */}
          {formattedProperty.images.length > 0 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-3">
              {formattedProperty.images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`min-w-[100px] sm:min-w-[120px] lg:min-w-[150px] h-[60px] sm:h-[75px] lg:h-[90px] rounded-[5px] overflow-hidden shadow cursor-pointer border-2 ${currentImageIndex === index ? 'border-[#001730]' : 'border-transparent'}`}
                >
                  <Image
                    src={img}
                    alt={`thumb ${index + 1}`}
                    width={150}
                    height={90}
                    className="object-cover w-full h-full"
                    unoptimized={img.startsWith('http')}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Main Images */}
          {formattedProperty.images.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              {formattedProperty.images.slice(currentImageIndex, currentImageIndex + 2).map((img, index) => (
                <div key={index} className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[420px] rounded-[5px] overflow-hidden shadow-lg">
                  <Image
                    src={img}
                    alt={`main ${index + 1}`}
                    width={800}
                    height={800}
                    className="object-cover w-full h-full"
                    unoptimized={img.startsWith('http')}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[420px] rounded-[5px] overflow-hidden shadow-lg">
                <Image src="/div.property-thumbnail-wrapper.png" alt="main" width={800} height={800} className="object-cover w-full h-full" />
              </div>
            </div>
          )}

          {/* Slider Arrows */}
          {formattedProperty.images.length > 2 && (
            <div className="flex justify-center items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
              <button
                onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 2))}
                disabled={currentImageIndex === 0}
                className="bg-white p-2 sm:p-3 rounded-[5px] shadow-md border border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaArrowLeft size={18} className="sm:w-[22px] sm:h-[22px] text-[#001730]" />
              </button>
              <div className="text-[#001730] tracking-widest text-sm sm:text-lg">
                {Math.floor(currentImageIndex / 2) + 1} / {Math.ceil(formattedProperty.images.length / 2)}
              </div>
              <button
                onClick={() => setCurrentImageIndex(Math.min(formattedProperty.images.length - 2, currentImageIndex + 2))}
                disabled={currentImageIndex >= formattedProperty.images.length - 2}
                className="bg-white p-2 sm:p-3 rounded-[5px] shadow-md border border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaArrowRight size={18} className="sm:w-[22px] sm:h-[22px] text-[#001730]" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="w-full bg-gray-100 p-4 sm:p-6">

        {/* MAIN CONTENT */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* LEFT SIDE */}
          <div className="col-span-1">
            {/* TOP SPECS */}
            <div className="bg-gray-100 p-3 sm:p-4 shadow-lg rounded-[5px] mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">

                {[
                  { icon: "bed", label: formattedProperty.beds || "0" },
                  { icon: "bath", label: formattedProperty.baths || "0" },
                  { icon: "area", label: formattedProperty.area ? `${formattedProperty.area} m²` : "N/A" },
                  { icon: "car", label: formattedProperty.parking || "0" },
                  { icon: "furnished", label: formattedProperty.furnishing || "Unfurnished" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="
          flex items-center gap-2 sm:gap-3
          bg-white
          px-2 sm:px-3
          h-12 sm:h-14
          rounded-[5px]
          shadow-sm
        "
                  >
                    {/* ICONS */}
                    {item.icon === "bed" && <FaBed className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />}
                    {item.icon === "bath" && <FaBath className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />}
                    {item.icon === "area" && <FaRegSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />}
                    {item.icon === "car" && <FaCar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />}
                    {item.icon === "furnished" && <FaCouch className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />}

                    {/* TEXT */}
                    <p
                      className="
            font-semibold text-[#001730]
            text-xs sm:text-sm
            whitespace-nowrap
            truncate
            w-full
          "
                      title={item.label}
                    >
                      {item.label}
                    </p>
                  </div>
                ))}

              </div>
            </div>


            {/* Tabs */}


            {/* Description box */}
            <div className="bg-white p-4 sm:p-6 rounded-[5px] shadow">
              <div className="flex gap-2 sm:gap-4 mb-4">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-[5px] shadow text-xs sm:text-base font-semibold transition-all ${activeTab === "overview"
                    ? "bg-white text-[#001730]"
                    : "bg-gray-200 text-gray-500"
                    }`}
                >
                  Overview
                  {activeTab === "overview" ? (
                    <FaChevronDown size={14} />
                  ) : (
                    <FaChevronUp size={14} />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("virtual")}
                  className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-[5px] shadow text-xs sm:text-base font-semibold transition-all ${activeTab === "virtual"
                    ? "bg-white text-[#001730]"
                    : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {/* 360 Icon */}

                  <span>360 Virtual Tour</span>
                  {activeTab === "virtual" ? (
                    <FaChevronDown size={14} />
                  ) : (
                    <FaChevronUp size={14} />
                  )}
                </button>
              </div>
              {/* <h2 className="text-lg sm:text-xl mx-4 sm:mx-10  text-[#001730] mb-3">
                {activeTab === "overview" ? "Description" : "360 Virtual Tour"}
              </h2> */}

              {activeTab === "overview" ? (
                <>
                  {formattedProperty.description ? (
                    <div className="text-gray-600 text-sm sm:text-base mx-4 sm:mx-10 leading-relaxed mb-4 whitespace-pre-line">
                      {formattedProperty.description}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm sm:text-base mx-4 sm:mx-10 leading-relaxed mb-4">
                      No description available for this property.
                    </p>
                  )}
                </>
              ) : (
                <div className="mx-4 sm:mx-10 mb-4">
                  {/* 360 Virtual Tour Viewer */}
                  <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-[5px] overflow-hidden bg-gray-100 shadow-lg">
                    {/* 360 Logo/Icon Overlay */}


                    {/* 360 Viewer Container - You can replace this with actual 360 viewer iframe/embed */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      {/* Placeholder for 360 viewer - Replace with actual 360 tour embed URL */}
                      <div className="text-center p-8">
                        <div className="mb-4">
                          <Md360 className="mx-auto text-[#001730] w-20 h-20" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-semibold text-[#001730] mb-2">
                          360° Virtual Tour
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base mb-4">
                          Click Here To View Interactive 360° view of this property
                        </p>
                        <p className="text-gray-500 text-xs sm:text-sm">
                          {/* Replace this iframe src with your actual 360 tour URL (e.g., Matterport, Kuula, etc.) */}
                          {/* Example: <iframe src="YOUR_360_TOUR_URL" className="w-full h-full" frameBorder="0"></iframe> */}
                        </p>
                      </div>

                      {/* Uncomment and use this iframe when you have a 360 tour URL */}
                      {/* 
                      <iframe
                        src={property?.virtualTourUrl || "YOUR_DEFAULT_360_TOUR_URL"}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="fullscreen; vr"
                        allowFullScreen
                        title="360 Virtual Tour"
                      ></iframe>
                      */}
                    </div>
                  </div>
                </div>
              )}
              <div className="w-[90%] h-[0.2px] px-10 mx-4 sm:mx-10  mt-2 3xl:mt-3 bg-gray-400 mb-3 md:mb-4 3xl:mb-5"></div>
              {/* Bottom stats */}
              <div className="grid grid-cols-3 mx-4 sm:mx-10 pt-4 mt-4">
                {[
                  { title: "Total Area", value: formattedProperty.area ? `${formattedProperty.area} m²` : "N/A", icon: "area" },
                  { title: "Floors", value: formattedProperty.floors || "N/A", icon: "floors" },
                  { title: "Parking Spaces", value: formattedProperty.parking || "0", icon: "parking" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex flex-col pl-2 sm:pl-4 ${i !== 2 ? "border-r border-gray-400" : ""
                      }`}
                  >
                    {/* TITLE + ICON SIDE BY SIDE */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {item.icon === "area" && (
                        <FaRegSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      )}
                      {item.icon === "floors" && (
                        <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      )}
                      {item.icon === "parking" && (
                        <FaCar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      )}
                      <p className="text-gray-500 text-xs sm:text-sm">{item.title}</p>
                    </div>

                    {/* VALUE BELOW */}
                    <h3 className="text-[#001730] text-base sm:text-xl font-semibold mt-1">
                      {item.value}
                    </h3>
                  </div>
                ))}
              </div>

            </div>

            {/* Amenities Card */}
            {formattedProperty.amenities && formattedProperty.amenities.length > 0 && (
              <div className="bg-white p-4 sm:p-6 shadow-lg rounded-[5px] mb-4 mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold text-[#001730] mb-3 sm:mb-4">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                  {formattedProperty.amenities.map((amenity, idx) => {
                    // Map amenity names to icons
                    const getAmenityIcon = (amenityName) => {
                      const name = amenityName?.toLowerCase() || '';
                      if (name.includes('wifi') || name.includes('internet')) return <FaWifi className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                      if (name.includes('pool') || name.includes('swimming')) return <FaSwimmingPool className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                      if (name.includes('gym') || name.includes('fitness')) return <FaDumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                      if (name.includes('parking')) return <FaParking className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                      if (name.includes('ac') || name.includes('air conditioning')) return <FaSnowflake className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                      if (name.includes('pet') || name.includes('dog')) return <FaDog className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                      if (name.includes('security') || name.includes('guard')) return <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                      if (name.includes('elevator') || name.includes('lift')) return <FaArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                      if (name.includes('tv') || name.includes('television')) return <FaTv className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                      if (name.includes('kitchen') || name.includes('restaurant')) return <FaUtensils className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                      return <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                    };

                    const amenityName = typeof amenity === 'string' ? amenity : amenity?.name || amenity?.label || 'Amenity';

                    return (
                      <div
                        key={idx}
                        className="
                          flex items-center gap-2 sm:gap-3
                          bg-gray-100
                          px-2 sm:px-3
                          h-10 sm:h-10
                          rounded-[5px]
                          shadow-sm
                        "
                      >
                        {/* ICON */}
                        {getAmenityIcon(amenityName)}

                        {/* TEXT */}
                        <p
                          className="
                            font-semibold text-[#001730]
                            text-xs sm:text-sm
                            whitespace-nowrap
                            truncate
                            w-full
                          "
                          title={amenityName}
                        >
                          {amenityName}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Map Box */}
            <div className="mt-4 sm:mt-6 bg-white rounded-[5px] shadow p-0 h-[250px] sm:h-[300px] overflow-hidden">
              <iframe
                src={(() => {
                  // Build location string from property location levels
                  const locationParts = [
                    property?.locationLevel1,
                    property?.locationLevel2,
                    property?.locationLevel3,
                    property?.locationLevel4
                  ].filter(Boolean);
                  
                  // If we have location, use it; otherwise default to Qatar
                  const locationQuery = locationParts.length > 0 
                    ? encodeURIComponent(locationParts.join(', ') + ', Qatar')
                    : encodeURIComponent('Doha, Qatar');
                  
                  // Use Google Maps embed with search query (standard format, no API key needed)
                  return `https://www.google.com/maps?q=${locationQuery}&output=embed&hl=en`;
                })()}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>


            {/* Bottom info strip */}
            <div className="bg-[#F3F5F8] p-3 sm:p-4 mt-4 rounded-[8px] shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">

                {/* Box 1 */}
                <div className="bg-white p-3 sm:p-4 rounded-[8px] shadow-sm text-xs sm:text-sm border border-gray-100">
                  <p className="text-[#001730]">
                    <span className="font-semibold block">Property ID:</span>
                    <span className="mt-1 block break-all">
                      {formattedProperty.reference || formattedProperty.id}
                    </span>
                  </p>
                </div>

                {/* Box 2 */}
                <div className="bg-white p-3 sm:p-4 rounded-[8px] shadow-sm text-xs sm:text-sm border border-gray-100">
                  <p className="text-[#001730]">
                    <span className="font-semibold block">Property Type:</span>
                    <span className="mt-1 block">
                      {formattedProperty.type
                        ? formattedProperty.type.charAt(0).toUpperCase() +
                          formattedProperty.type.slice(1)
                        : "N/A"}
                    </span>
                  </p>
                </div>

                {/* Box 3 */}
                <div className="bg-white p-3 sm:p-4 rounded-[8px] shadow-sm text-xs sm:text-sm border border-gray-100">
                  <p className="text-[#001730]">
                    <span className="font-semibold block">Year Built:</span>
                    <span className="mt-1 block">
                      {formattedProperty.yearBuilt || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE - AGENT CARDS */}
          <div className="col-span-1 flex flex-col gap-3 sm:gap-4">
            {(() => {
              let agentsToDisplay = [];

              if (
                property?.allAssignedAgents &&
                Array.isArray(property.allAssignedAgents) &&
                property.allAssignedAgents.length > 0
              ) {
                agentsToDisplay = property.allAssignedAgents;
              } else if (property?.agent) {
                agentsToDisplay = [property.agent];
              }

              if (agentsToDisplay.length === 0) return null;

              return agentsToDisplay.map((agent, index) => {
                const agentName =
                  `${agent.firstName || ''} ${agent.lastName || ''}`.trim() ||
                  agent.email ||
                  'Agent';

                // Location
                let agentLocation = 'Location not specified';
                if (agent.location) {
                  const parts = [];
                  if (agent.location.city) parts.push(agent.location.city);
                  if (
                    agent.location.district &&
                    agent.location.district !== agent.location.city
                  ) {
                    parts.push(agent.location.district);
                  }
                  if (parts.length > 0) agentLocation = parts.join(', ');
                  else if (agent.location.address) agentLocation = agent.location.address;
                }

                // Languages
                let languages = 'English, Arabic, Spanish';
                if (Array.isArray(agent.languages) && agent.languages.length > 0) {
                  languages = agent.languages.join(', ');
                }

                return (
                  <div
                    key={agent.id || agent.userId || agent._id || `agent-${index}`}
                    className="bg-white rounded-[5px] shadow overflow-hidden flex flex-col lg:flex-row items-start"
                  >
                    {/* LEFT IMAGE */}
                    <div
                      className="
              w-full lg:w-1/2
              rounded-[5px]
              relative
              flex-shrink-0
              h-40 sm:h-36
              lg:min-h-[300px]
              lg:max-h-[300px]
              p-4
              lg:pr-0 lg:mr-0
            "
                    >
                      {agent.profilePicture ? (
                        <Image
                          src={agent.profilePicture}
                          width={300}
                          height={400}
                          alt={agentName}
                          className="h-full w-full rounded-[5px] object-fill"
                          unoptimized={agent.profilePicture?.startsWith('http')}
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-[5px]">
                          <div className="w-16 h-16 rounded-full bg-[#001730] flex items-center justify-center">
                            <span className="text-white text-xl font-semibold">
                              {agentName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* RIGHT DETAILS */}
                    <div className="w-full lg:w-1/2 p-3 sm:p-4 flex flex-col">
                      <div>
                        <div className="shadow-md bg-white text-center p-2 sm:p-3 rounded-[5px]">
                          <h3 className="text-sm sm:text-base font-semibold text-[#001730] mb-1">
                            {agentName}
                          </h3>
                          <div className="w-[30%] h-[0.2px] bg-gray-400 my-1 mx-auto"></div>
                          <p className="text-gray-500 text-xs">Property Agent</p>
                        </div>

                        {/* Location */}
                        <div className="relative mt-4">
                          <p className="absolute top-[-9px] text-xs text-gray-400 ml-2">
                            Location:
                          </p>
                          <p className="bg-white mt-1 p-2 sm:p-3 shadow-md rounded-[5px] text-xs text-gray-700">
                            {agentLocation}
                          </p>
                        </div>

                        {/* Languages */}
                        <div className="relative mt-3">
                          <p className="absolute top-[-9px] text-xs text-gray-400 ml-2">
                            Languages:
                          </p>
                          <p className="bg-white mt-1 p-2 sm:p-3 shadow-md rounded-[5px] text-xs text-gray-700">
                            {languages}
                          </p>
                        </div>
                      </div>

                      {/* BUTTONS */}
                      <div className="mt-3 flex flex-col gap-2">
                        <div className="flex gap-2">
                          {agent.phone && (
                            <a
                              href={`tel:${agent.phone}`}
                              className="flex-1 bg-[#001730] text-white py-1.5 sm:py-2 rounded-[5px] flex justify-between items-center px-3 text-[12px] hover:opacity-90 transition"
                            >
                              Call Agent
                              <FaArrowRight size={12} />
                            </a>
                          )}

                          {agent.email && (
                            <a
                              href={`mailto:${agent.email}`}
                              className="flex-1 bg-[#001730] text-white py-1.5 sm:py-2 rounded-[5px] flex justify-between items-center px-3 text-[12px] hover:opacity-90 transition"
                            >
                              Send email
                              <FaArrowRight size={12} />
                            </a>
                          )}
                        </div>

                        <button className="w-full bg-[#001730] text-white py-1.5 sm:py-2 rounded-[5px] flex justify-between items-center px-3 text-[12px] hover:opacity-90 transition">
                          Schedule Viewing
                          <FaArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>



        </div>
      </div>


      <div className="relative w-full py-4 lg:py-4 px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-4 3xl:px-4 4xl:px-4 5xl:px-4">
        <div className="max-w-[1500px] mt-10 mx-auto w-full">
          <h2
            id="my-heading"
            className="text-[#001730] uppercase mb-2 lg:mb-2 text-center whitespace-nowrap"
            style={{
              fontSize: "clamp(16px, 4vw, 24px)"
            }}
          >
            Related Listings
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
            Discover similar properties that might interest you in the same area or with comparable features


          </p>

          <div
            className="flex gap-3 md:gap-4 lg:gap-6 xl:gap-6 2xl:gap-7 3xl:gap-8 4xl:gap-10 5xl:gap-12 overflow-x-auto scroll-smooth pb-4 lg:pb-6"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e0 transparent'
            }}
          >
            {relatedProperties.length > 0 ? (
              relatedProperties.map((property, index) => {
                const formatted = formatRelatedProperty(property);
                return (
                  <div
                    key={formatted.id || index}
                    className={`
          w-[250px]  lg:w-[333px]
          p-4
          bg-[#E9E9E9] border border-gray-200 
          rounded-md overflow-hidden shadow-md 
          hover:shadow-xl transition-shadow duration-300 
          flex-shrink-0
          ${index === 0 || index === relatedProperties.length - 1
                        ? 'scale-95'
                        : 'scale-100'
                      }
        `}
                  >
                    {/* Image Section */}
                    <div className="relative w-full h-[180px]  xl:h-[200px] ">
                      <Image
                        src={formatted.image}
                        alt={formatted.title}
                        fill
                        className="object-fill rounded-md"
                        unoptimized={formatted.image?.startsWith('http')}
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
                          <span className="text-white font-semibold text-[10px] lg:text-xs uppercase tracking-wide">
                            {formatted.priceType === 'sale' ? 'SALE' : 
                             formatted.priceType === 'rent' || formatted.priceType === 'lease' ? 'RENT' : 
                             formatted.priceType === 'marketing' ? 'MARKETING' : 
                             formatted.priceType?.toUpperCase() || 'RENT'}
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
                          <Md360 className="text-white w-3 h-3 lg:w-4 lg:h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Property Info */}
                    <div className="py-2">
                      <h3 className="font-semibold text-[#001730] text-sm lg:text-lg mb-1 leading-snug line-clamp-2">
                        {formatted.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center text-[#001730] text-sm mb-3">
                        <MapPin size={12} className="mr-2" />
                        <span
                          className="line-clamp-1 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl"
                          style={{ fontSize: "clamp(13px, 0.8vw, 17px)" }}
                        >
                          {formatted.location}
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
                          <span>{formatted.beds}</span>
                        </div>

                        <div className="flex items-center justify-center gap-1 bg-[#F5F5F5] shadow p-1.5 lg:p-2 rounded-md">
                          <Image
                            src="/Icon.png"
                            alt="Baths"
                            width={14}
                            height={14}
                            className="lg:w-[18px] lg:h-[18px]"
                          />
                          <span>{formatted.baths}</span>
                        </div>

                        <div className="flex items-center justify-center gap-1 bg-[#F5F5F5] shadow p-1.5 lg:p-2 rounded-md">
                          <Image
                            src="/Icon (2).png"
                            alt="Area"
                            width={14}
                            height={14}
                            className="lg:w-[18px] lg:h-[18px]"
                          />
                          <span>{formatted.area}</span>
                        </div>

                      </div>


                      <div
                        className="w-[100%]  h-[0.5px] bg-gray-300  my-3 "
                      ></div>

                      {/* Price and Button */}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-base md:text-base lg:text-base xl:text-lg 2xl:text-lg 3xl:text-xl 4xl:text-2xl 5xl:text-3xl font-semibold text-[#001730]">
                          {formatted.price}
                        </p>

                        <button className="bg-[#001730] text-white text-[12px] px-3 md:px-4 lg:px-5 xl:px-5 2xl:px-6 3xl:px-7 4xl:px-8 5xl:px-10 py-1.5  lg:py-2  rounded-md flex items-center justify-between shadow-lg transition-all duration-300 hover:bg-[#002d52]">
                          <Link
                            href={`/propertydetails?id=${formatted.id}`}
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
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-8 w-full">No related properties available</div>
            )}
          </div>

          {/* View All Button - Moved inside max-w container */}
          <div className="flex justify-center mt-4 lg:mt-6 mb-5">
            <Link href="/listings/rent">
              <button className="bg-[#001730] text-white text-[12px] px-4 md:px-4 lg:px-5 xl:px-5 2xl:px-6 3xl:px-7 4xl:px-8 5xl:px-10 py-1.5 md:py-1.5 lg:py-2 xl:py-2 2xl:py-3 3xl:py-3 4xl:py-4 5xl:py-5 rounded flex items-center justify-center gap-2 transition hover:bg-[#1b3a70]">
                <span>View All</span>
                <FaArrowRight
                  size={12}
                  className="w-3 h-3  lg:w-[12px] lg:h-[12px] ml-20"
                />
              </button>
            </Link>
          </div>
        </div>
      </div>




    </div>
  );
}

export default PropertyDetailsContent;
