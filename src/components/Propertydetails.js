"use client";
import Image from "next/image";
import React, { useRef, useState, useEffect, Suspense } from "react";
import { ArrowLeft, MapPin, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { FaArrowRight, FaArrowLeft, FaChevronUp, FaChevronDown, FaBath } from "react-icons/fa6";
import { FaBed, FaRulerCombined, FaCar, FaCouch, FaBuilding, FaRegSquare, FaWifi, FaSwimmingPool, FaDumbbell, FaParking, FaSnowflake, FaDog, FaShieldAlt, FaTv, FaUtensils, FaArrowUp } from "react-icons/fa";
import { Md360 } from "react-icons/md";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchPropertyById, fetchProperties } from "../utils/propertyapi";
import FeaturedProperties from "./FeaturedProperties";

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyBS4N8g1D0VhjnOHwSMWRdz1JbTmEUg8Gw";

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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const thumbnailStripRef = useRef(null);
  const thumbnailRefs = useRef([]);

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
    let price = "Price ";
    let priceLabel = "";
    // Check if priceAmount exists and is a valid number (including 0)
    if (property.priceAmount !== undefined && property.priceAmount !== null && property.priceAmount !== '') {
      const currency = property.priceCurrency || "QAR";
      // Default to monthly for rent properties if frequency is not provided
      const frequency = property.priceFrequency || (property.priceType === 'rent' ? 'monthly' : '');
      const frequencyStr = frequency ? `/${frequency}` : "";
      const priceValue = typeof property.priceAmount === 'number' 
        ? property.priceAmount 
        : parseFloat(property.priceAmount) || 0;
      price = `${priceValue.toLocaleString()} ${currency}${frequencyStr}`;
      priceLabel = frequency === "monthly" ? "Price" :
        frequency === "weekly" ? "Per Week" :
          frequency === "daily" ? "Per Day" : "";
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

  // Safely render rich description coming from backend (supports <p>, <li>, etc.)
  const renderDescriptionHtml = (description) => {
    if (!description) return "";

    let html = description;

    // Strip raw <p> wrappers coming from backend to avoid nested paragraphs / mobile spacing issues
    html = html.replace(/<\/?p[^>]*>/gi, "");

    // If backend already sends proper <li> tags, just return as-is
    if (/<li[^>]*>/i.test(html)) {
      // Ensure they are wrapped in a <ul> if not already
      const hasUl = /<ul[^>]*>/i.test(html);
      if (!hasUl) {
        return `<ul class="list-disc pl-4 space-y-1">${html}</ul>`;
      }
      return html;
    }

    // If backend uses bullet characters (•), convert them into a proper list
    if (html.includes("•")) {
      const parts = html.split(/•+/);

      const headingText = parts[0]?.trim();
      const items = parts
        .slice(1)
        .map((item) => item.trim())
        .filter(Boolean);

      let result = "";
      if (headingText) {
        result += `<p class="font-semibold mb-2">${headingText}</p>`;
      }

      if (items.length > 0) {
        const listItems = items.map((item) => `<li>${item}</li>`).join("");
        result += `<ul class="list-disc pl-4 space-y-1">${listItems}</ul>`;
      }

      return result || html;
    }

    return html;
  };

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
    // Check if priceAmount exists and is a valid number (including 0)
    if (property.priceAmount !== undefined && property.priceAmount !== null && property.priceAmount !== '') {
      const currency = property.priceCurrency || "QAR";
      // Default to monthly for rent properties if frequency is not provided
      const frequency = property.priceFrequency || (property.priceType === 'rent' ? 'monthly' : '');
      const frequencyStr = frequency ? `/${frequency}` : "";
      const priceValue = typeof property.priceAmount === 'number' 
        ? property.priceAmount 
        : parseFloat(property.priceAmount) || 0;
      price = `${priceValue.toLocaleString()} ${currency}${frequencyStr}`;
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

  const scrollThumbnailIntoView = (index) => {
    if (!thumbnailStripRef.current || !thumbnailRefs.current[index]) return;
    thumbnailRefs.current[index].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };


  if (loading) {
    return (
      <div className="w-full bg-[#F5F7FA] p-4 sm:p-6 mt-20 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#001730] animate-spin" />
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
              {formattedProperty.title}
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
            <div
              ref={thumbnailStripRef}
              className="flex gap-2 sm:gap-3 overflow-x-auto pb-3"
            >
              {formattedProperty.images.map((img, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    thumbnailRefs.current[index] = el;
                  }}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    scrollThumbnailIntoView(index);
                  }}
                  className={`min-w-[100px] sm:min-w-[120px] lg:min-w-[150px] h-[60px] sm:h-[75px] lg:h-[90px] rounded-[5px] overflow-hidden shadow cursor-pointer border-2 ${
                    currentImageIndex === index ? "border-[#001730]" : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`thumb ${index + 1}`}
                    width={150}
                    height={90}
                    className="object-cover w-full h-full"
                    unoptimized={img.startsWith("http")}
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
                onClick={() => {
                  const newIndex = Math.max(0, currentImageIndex - 2);
                  setCurrentImageIndex(newIndex);
                  scrollThumbnailIntoView(newIndex);
                }}
                disabled={currentImageIndex === 0}
                className="bg-white p-2 sm:p-3 rounded-[5px] shadow-md border border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaArrowLeft size={18} className="sm:w-[22px] sm:h-[22px] text-[#001730]" />
              </button>
              <div className="text-[#001730] tracking-widest text-sm sm:text-lg">
                {Math.floor(currentImageIndex / 2) + 1} / {Math.ceil(formattedProperty.images.length / 2)}
              </div>
              <button
                onClick={() => {
                  const newIndex = Math.min(
                    formattedProperty.images.length - 2,
                    currentImageIndex + 2
                  );
                  setCurrentImageIndex(newIndex);
                  scrollThumbnailIntoView(newIndex);
                }}
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
                    <>
                      {/* Mobile / Responsive: collapsible description with padding and narrower width */}
                      <div className="block lg:hidden mx-4 sm:mx-10 mb-4">
                        <div
                          className={`
                            text-gray-600 text-sm leading-relaxed 
                            bg-white/90 rounded-md 
                            px-3 py-3 sm:px-4 sm:py-4 
                            max-w-md mx-auto
                            transition-all duration-300 
                            ${isDescriptionExpanded ? "max-h-[900px]" : "max-h-[140px]"} 
                            overflow-hidden
                          `}
                          dangerouslySetInnerHTML={{
                            __html: renderDescriptionHtml(formattedProperty.description),
                          }}
                        />
                        <div className="flex justify-center mt-3">
                          <button
                            type="button"
                            onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                            className="text-[12px] sm:text-sm font-semibold text-[#001730] px-4 py-1.5 rounded-full border border-[#001730]/40 bg-white hover:bg-[#001730] hover:text-white transition-colors"
                          >
                            {isDescriptionExpanded ? "Show less" : "Show more"}
                          </button>
                        </div>
                      </div>

                      {/* Desktop: full description, wider and without toggle */}
                      <div
                        className="hidden lg:block text-gray-600 text-sm sm:text-base mx-4 sm:mx-10 leading-relaxed mb-4"
                        dangerouslySetInnerHTML={{
                          __html: renderDescriptionHtml(formattedProperty.description),
                        }}
                      />
                    </>
                  ) : (
                    <div className="text-gray-600 text-sm sm:text-base mx-4 sm:mx-10 leading-relaxed mb-4">
                      No description available for this property.
                    </div>
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
                  
                  // Use Google Maps embed with search query
                  return `https://www.google.com/maps?q=${locationQuery}&output=embed&hl=en&key=${GOOGLE_MAPS_API_KEY}`;
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
          <div className="col-span-1 flex flex-col gap-4 sm:gap-5 px-1 sm:px-2">
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
                } else if (agent.languages && typeof agent.languages === 'string') {
                  languages = agent.languages;
                }

                // Specialities
                let specialities = 'Not specified';
                if (agent.specialties) {
                  if (Array.isArray(agent.specialties) && agent.specialties.length > 0) {
                    specialities = agent.specialties.join(', ');
                  } else if (typeof agent.specialties === 'string') {
                    // Handle comma-separated string
                    specialities = agent.specialties.split(',').map(s => s.trim()).filter(Boolean).join(', ');
                  }
                } else if (agent.specialization) {
                  // Alternative field name (legacy)
                  if (Array.isArray(agent.specialization)) {
                    specialities = agent.specialization.join(', ');
                  } else if (typeof agent.specialization === 'string') {
                    specialities = agent.specialization.split(',').map(s => s.trim()).filter(Boolean).join(', ');
                  }
                }

                return (
                  <div
                    key={agent.id || agent.userId || agent._id || `agent-${index}`}
                    className="
                      bg-white rounded-[10px] shadow-md 
                      overflow-hidden 
                      flex flex-col lg:flex-row items-start
                      w-full max-w-[360px] sm:max-w-[400px] lg:max-w-full
                      mx-auto
                    "
                  >
                    {/* LEFT IMAGE */}
                    <div
                      className="
              w-full lg:w-1/2
              rounded-[10px]
              relative
              flex-shrink-0
              h-48 sm:h-52 lg:min-h-[300px]
              lg:min-h-[300px]
              lg:max-h-[300px]
              p-3 sm:p-4
              lg:pr-0 lg:mr-0
            "
                    >
                      {agent.profilePicture ? (
                        <Image
                          src={agent.profilePicture}
                          width={300}
                          height={400}
                          alt={agentName}
                          className="h-full w-full rounded-[5px] object-cover"
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

                        {/* Specialities */}
                        <div className="relative mt-4">
                          <p className="absolute top-[-9px] text-xs text-gray-400 ml-2">
                            Specialities:
                          </p>
                          <p className="bg-white mt-1 p-2 sm:p-3 shadow-md rounded-[5px] text-xs text-gray-700">
                            {specialities}
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


      <div className="relative w-full py-2 lg:py-4 px-2 md:px-2 lg:px-2 xl:px-2 2xl:px-2 3xl:px-2 4xl:px-2 5xl:px-2">
     
        

          <FeaturedProperties 
            priceType={formattedProperty.priceType || "rent"}
            limit={4}
            status="published"
            viewAllLink={formattedProperty.priceType === "sale" ? "/listings/sale" : "/listings/rent"}
            title="Related Listings"
            description="Discover similar properties that might interest you in the same area or with comparable features"
          />
       
      </div>




    </div>
  );
}

export default PropertyDetailsContent;
