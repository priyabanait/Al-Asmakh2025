"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/config/api";

export default function AlAsmakhTower() {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [areas, setAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const areaCarouselRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

  // Function to convert area name to slug
  const getAreaSlug = (areaName) => {
    const slugMap = {
      "Lusail City": "lusail-city",
      "Pearl Island": "pearl-island",
      "The Pearl": "pearl-island",
      "The Pearl Island": "pearl-island",
      "West Bay": "west-bay",
      "Doha": "doha",
      "Al Sadd": "al-sadd",
      "Al Dafna": "al-dafna"
    };
    return slugMap[areaName] || areaName.toLowerCase().replace(/\s+/g, "-");
  };

  // Function to handle area click - navigate using area ID when available
  const handleAreaClick = (area) => {
    // If area is an object with id, prefer navigating by ID
    if (typeof area === "object" && area.id) {
      router.push(`/towerdetails/${area.id}`);
      return;
    }

    // Fallback: if only a name/slug is available, use slug-based navigation
    const areaName = typeof area === "object" ? area.name : area;
    const slug = getAreaSlug(areaName);
    router.push(`/towerdetails/${slug}`);
  };

  // Fetch areas from API
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoadingAreas(true);
        const apiUrl = getApiUrl("api/v1/areas/list");
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch areas: ${response.status}`);
        }

        const data = await response.json();

        // Map API response to component data structure
        // API returns: { areas: [{ area_id, area_name, area_title, area_image, descriptionEn }], count }
        if (data.areas && Array.isArray(data.areas)) {
          const mappedAreas = data.areas.map((area) => ({
            id: area.area_id,
            name: area.area_name || "",
            nameAr: area.area_title || area.area_name || "",
            subheading: area.area_title || area.area_name || "",
            image: area.area_image || "/images_prop/1.png", // Fallback image
            descriptionEn: area.descriptionEn || "", // English description for hover tooltip
          }));
          setAreas(mappedAreas);
          // Reset current area index when areas are loaded
          setCurrentAreaIndex(0);
        } else {
          // Fallback to empty array if no areas
          setAreas([]);
          setCurrentAreaIndex(0);
        }
      } catch (error) {
        console.error("Error fetching areas:", error);
        // Fallback to empty array on error
        setAreas([]);
        setCurrentAreaIndex(0);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, []);


  const projects = [
    {
      title: "AL ASMAKH TOWER",
      location: "West Bay",
      subheading: "A Future-Focused Tower with Heritage at Its Core.",
      description:
        "An iconic GSAS 4-star certified office tower in West Bay that brings together ARDEC's legacy, sustainable design, and smart technology to create a long-term base for leading organisations in Qatar. Al Asmakh Tower reflects how ARDEC thinks about commercial real estate: combine architectural presence with spaces that work in real life. Positioned along Doha's business skyline, the tower offers flexible floorplates and 40 commercial units that can adapt as companies grow, restructure, or expand regional teams.",
      img: "/mainScreen/407.1.png",
    },
    {
      title: "BEVERLY HILLS TOWER",
      location: "West Bay",
      subheading: "Serviced City Living, with Hotel-Style Comfort Every Day.",
      description:
        "A 30-storey residential tower in West Bay offering 318 fully furnished apartments, premium wellness facilities, and 24-hour concierge services in one centrally connected address. Beverly Hills Tower is designed for those who want hotel-style ease without losing the feeling of home. From the moment you arrive, a staffed lobby, round-the-clock concierge, and secure access create a sense of being looked after, whether you are staying for a year or a longer assignment in Doha.",
      img: "/images_pages/BEVALIHILLS_TOWER.jpg",
    },
    {
      title: "FLORESTA TOWER, THE PEARL",
      location: "The Pearl",
      subheading: "Sea Views, Smart Living, and a Private Beach Below.",
      description:
        "A waterfront tower on The Pearl offering 102 luxury apartments, panoramic sea views, smart home technology, and private beach access in one of Qatar's most recognisable island settings. Floresta Tower is designed for those who crave the calm of a private shoreline with the convenience of tower living. Residences open out to sweeping views of the sea and marina, creating a daily connection to the water that is rare even on The Pearl. At ground level, residents enjoy direct access to a private beach area, turning early morning swims and sunset walks into a natural part of life at home.",
      img: "/images_pages/THEPEARL.jpg"
    },
    {
      title: "LES MAISONS BLANCHES",
      location: "Lusail",
      subheading: "A Neighbourhood Feel, with City Life on Your Doorstep.",
      description:
        "An exclusive compound of villas and apartments, thoughtfully planned around a central clubhouse, with everyday services, and easy access to Lusail's key destinations. Les Maisons Blanches is for residents who want the feel of a neighbourhood, without losing the benefits of a central Lusail location. Inside the gates, the focus is on quiet streets, defined entrances, and homes that feel spacious and private. Outside, the city's newest retail and entertainment districts are only a short drive away.",
      img: "/images_pages/LUSIL.jpg",

    }
  ];

  // Function to reset auto-slide interval
  const resetAutoSlide = () => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }
    autoSlideIntervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    }, 5000); // 5 seconds
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    // Set up initial interval
    resetAutoSlide();

    // Cleanup on unmount
    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
    };
  }, []); // Run only once on mount

  // Function to handle manual slide change (resets the auto-slide timer)
  const handleSlideChange = (index) => {
    setActiveSlide(index);
    resetAutoSlide(); // Reset the timer when user manually clicks
  };

  const handleAreaTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleAreaTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleAreaTouchEnd = () => {
    if (!touchStart || !touchEnd || areas.length === 0) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentAreaIndex < areas.length - 1) {
      setCurrentAreaIndex(currentAreaIndex + 1);
    }
    if (isRightSwipe && currentAreaIndex > 0) {
      setCurrentAreaIndex(currentAreaIndex - 1);
    }
  };

  const goToAreaSlide = (index) => {
    setCurrentAreaIndex(index);
  };

  const goToPreviousArea = () => {
    if (areas.length === 0) return;
    setCurrentAreaIndex((prev) => (prev === 0 ? areas.length - 1 : prev - 1));
  };

  const goToNextArea = () => {
    if (areas.length === 0) return;
    setCurrentAreaIndex((prev) => (prev === areas.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="min-h-screen">
      {/* === PROJECT SECTION === */}
      {/* MOBILE - Full Background with Frosted Glass Card */}
      <div className="lg:hidden relative min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative w-full h-screen"
        >
          <Image
            src={projects[activeSlide].img || "/407.png"}
            alt={projects[activeSlide].title}
            fill
            className="object-cover"
            priority
          />

          {/* FROSTED GLASS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="absolute inset-0 flex items-center justify-center px-4"
          >
            <div
              className="w-full max-w-sm rounded-2xl p-4 bg-white/20 backdrop-blur-xl shadow-lg"
            >
              <div className="text-center">

                {/* HEADING */}
                <h2
                  className="
              text-[#001730]
              uppercase
              font-semibold
              text-[25px]
              leading-tight
              mb-2
            "
                >
                  {projects[activeSlide].title}
                </h2>

                {/* SUBHEADING */}
                {projects[activeSlide].subheading && (
                  <p className="text-[#001730] text-xs mb-2">
                    {projects[activeSlide].subheading}
                  </p>
                )}

                <div className="w-16 h-[1px] bg-[#001730]/40 mx-auto my-3" />

                {/* LOCATION */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <MapPin size={14} className="text-[#001730]" />
                  <span className="text-[#001730] text-sm">
                    {projects[activeSlide].location}
                  </span>
                </div>

                {/* DESCRIPTION */}
                <p className="text-[#001730] text-sm leading-relaxed mb-4">
                  {projects[activeSlide].description}
                </p>

                {/* BUTTON */}
                <button
                  className="
              mx-auto
              flex items-center gap-2
              bg-[#001730]
              text-white
              px-5
              py-2.5
              rounded-md
              text-sm
              font-medium
              shadow-md
              hover:bg-[#002d52]
              transition
            "
                >
                  <span>Details</span>
                  <FaArrowRight size={12} />
                </button>

              </div>
            </div>
          </motion.div>

          {/* DOT NAVIGATION */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                aria-label={`Go to slide ${index + 1}`}
              >
                <motion.span
                  className={`block rounded-full ${index === activeSlide ? "bg-[#001730]" : "bg-gray-400"
                    }`}
                  animate={{
                    width: index === activeSlide ? "20px" : "8px",
                    height: "8px",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            ))}
          </div>

        </motion.div>
      </div>

      {/* DESKTOP - Grid Layout */}
      <div className="hidden lg:grid grid-cols-[60%_40%] gap-6 md:gap-10 3xl:gap-10 4xl:gap-12 relative min-h-screen items-center">

        {/* LEFT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative w-full h-full min-h-[500px]"
        >
          <Image
            src={projects[activeSlide].img || "/407.png"}
            alt={projects[activeSlide].title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* RIGHT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="hidden lg:flex flex-col justify-center pl-6"
        >

          {/* TITLE */}
          <h2
            className="font-semibold text-[#00254D] uppercase tracking-wide"
            style={{
              fontSize: "clamp(20px, 2.5vw, 28px)",
            }}
          >
            {projects[activeSlide].title}
          </h2>

          {/* SUBHEADING */}
          {projects[activeSlide].subheading && (
            <p
              className="text-gray font-light mb-3"
              style={{
                fontSize: "clamp(12px, 0.8vw, 18px)",
              }}
            >
              {projects[activeSlide].subheading}
            </p>
          )}

          {/* DIVIDER */}
          <div className="w-[30%] h-[1px] bg-gray-300 my-4"></div>

          {/* LOCATION */}
          <div className="flex items-center gap-2 mb-4 md:mb-5">
            <MapPin
              className="text-gray-600"
              style={{
                width: "clamp(16px, 1vw, 20px)",
                height: "clamp(16px, 1vw, 20px)",
              }}
            />
            <span
              className="text-gray-600"
              style={{
                fontSize: "clamp(14px, 1vw, 20px)",
              }}
            >
              {projects[activeSlide].location}
            </span>
          </div>

          {/* DESCRIPTION */}
          <p
            className="mb-6 mr-60 lg:mb-16 leading-relaxed"
            style={{
              color: "#919191",
              fontSize: "clamp(14px, 0.9vw, 18px)",
              lineHeight: "1.65",
            }}
          >
            {projects[activeSlide].description}
          </p>

          {/* BUTTON */}
          <div className="flex justify-center md:justify-start">
            <button
              className="flex items-center gap-2 bg-[#001730] text-white px-4 py-2 rounded-md hover:bg-[#002d52] transition-colors"
              style={{
                fontSize: "clamp(12px, 0.75vw, 16px)",
              }}
            >
              <span>Details</span>
              <FaArrowRight
                style={{
                  width: "clamp(12px, 0.75vw, 16px)",
                  height: "clamp(12px, 0.75vw, 16px)",
                }}
                className="ml-4 lg:ml-32"
              />
            </button>
          </div>

          {/* NAVIGATION DOTS */}
          <div className="flex items-center gap-2 mt-[60px] ml-[40px]">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                aria-label={`Go to slide ${index + 1}`}
                className="relative flex items-center justify-center"
              >
                <motion.span
                  className={`block rounded-full ${index === activeSlide ? "bg-[#001730]" : "bg-gray-400"
                    }`}
                  animate={{
                    width: index === activeSlide
                      ? "clamp(22px, 1.8vw, 32px)"
                      : "8px",
                    height: "8px",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </button>
            ))}
          </div>

        </motion.div>
      </div>




      {/* === EXPLORE OUR AREA SECTION === */}
      <section
        className="py-10 lg:py-16 bg-gray-100 lg-h-screen"
        style={{
          backgroundImage: "url('/images/BG_Form.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-[1827px] mx-auto px-4">
          {/* Heading */}
          <h2 className="text-2xl text-[#001730] uppercase mb-2 text-center 3xl:mb-3 4xl:mb-4">
            EXPLORE BY AREA
          </h2>
          <div className="flex-1 h-[0.5px] bg-gray-300 my-3 md:my-4 mx-auto w-[40%] md:w-[20%] mb-3 md:mb-4"></div>
          <p style={{ fontSize: "clamp(13px, 0.8vw, 17px)" }} className="text-gray-500   max-w-2xl mx-auto mb-8 md:mb-12 text-center   px-2 md:px-0">
            Browse luxury homes and investments across Qatar's finest districts,
            each offering its own lifestyle, charm, and opportunity.
          </p>

          {/* Loading State */}
          {loadingAreas && (
            <div className="flex items-center justify-center py-20">
              <div className="text-gray-500">Loading areas...</div>
            </div>
          )}

          {/* Empty State */}
          {!loadingAreas && areas.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <div className="text-gray-500">No areas available at the moment.</div>
            </div>
          )}

          {/* Mobile Carousel - Only visible on mobile */}
          {!loadingAreas && areas.length > 0 && (
            <div
              className="block lg:hidden relative"
              style={{
                overflow: "hidden",
                width: "100%",
              }}
            >
              <div
                ref={areaCarouselRef}
                className="relative mx-auto"
                onTouchStart={handleAreaTouchStart}
                onTouchMove={handleAreaTouchMove}
                onTouchEnd={handleAreaTouchEnd}
                style={{
                  height: "auto",
                  minHeight: "300px",
                  overflow: "hidden",
                  width: "100%",
                  maxWidth: "100%",
                  position: "relative",
                }}
              >
                <div
                  className="flex transition-transform  ease-in-out"
                  style={{
                    transform: `translateX(calc(-${currentAreaIndex * 100}%))`,
                    willChange: "transform",
                  }}
                >
                  {areas.map((area, index) => {
                    const isCenter = index === currentAreaIndex;
                    const offset = index - currentAreaIndex;

                    return (
                      <div
                        key={index}
                        className="flex-shrink-0"
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          onClick={() => handleAreaClick(area)}
                          style={{
                            borderRadius: "8px",
                            width: "100%",
                            maxWidth: "100%",
                            height: "300px",
                            position: "relative",
                            overflow: "hidden",
                            margin: "0 auto",
                            cursor: "pointer",
                          }}
                          className="shadow-lg md:h-[400px] hover:shadow-xl transition-shadow group"
                        >
                          <Image
                            src={area.image}
                            alt={area.name}
                            fill
                            className="object-fill rounded-lg"
                          />
                          {/* City Name Overlay - Top Left Corner */}
                          <div
                            className="absolute top-3 md:top-4 shadow-md bg-white/20 left-3 md:left-4 px-3 md:px-4 py-1.5 md:py-2 rounded"
                            style={{

                              backdropFilter: "blur(10px)",
                              WebkitBackdropFilter: "blur(10px)",
                            }}
                          >
                            <span className="text-white font-semibold text-xs md:text-sm">
                              {area.name}
                            </span>
                          </div>
                          {/* Description on Hover - Center - Show descriptionEn */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-3 border border-white/30 shadow-lg max-w-[85%]">
                              {area.descriptionEn ? (
                                <span 
                                  className="text-white font-medium text-xs md:text-sm text-center block leading-relaxed line-clamp-4"
                                  dangerouslySetInnerHTML={{ 
                                    __html: area.descriptionEn.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '') 
                                  }}
                                />
                              ) : (
                                <span className="text-white font-semibold text-sm md:text-base text-center block">
                                  {area.subheading && area.subheading !== area.name ? area.subheading : `Explore ${area.name}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation - Below carousel */}
              <div className="mt-4 md:mt-6">
                {/* Horizontal Line with Counter */}
                <div className="flex items-end justify-end mb-2">

                  <span className="text-gray-400 text-xs md:text-sm mx-2 md:mx-4">
                    {String(currentAreaIndex + 1).padStart(2, '0')} of {String(areas.length).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex-1 h-[0.5px] bg-gray-300 mb-3 md:mb-4"></div>
                {/* Navigation Buttons */}
                {/* Navigation Buttons */}
                <div className="flex items-center justify-center gap-2 md:gap-3">

                  {/* Previous Button */}
                  <button
                    onClick={goToPreviousArea}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-sm bg-white border border-black flex items-center justify-center hover:bg-gray-50 transition-all "
                    aria-label="Previous area"
                  >
                    <FaArrowLeft size={14} className="md:w-4 md:h-4 text-black" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={goToNextArea}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-sm bg-[#001730] flex items-center justify-center hover:bg-[#022d5e] transition-all "
                    aria-label="Next area"
                  >
                    <FaArrowRight size={14} className="md:w-4 md:h-4 text-white" />
                  </button>

                </div>

              </div>
            </div>
          )}

          {/* Desktop Grid - Hidden on mobile */}
          {!loadingAreas && areas.length > 0 && (
            <div className="hidden lg:block">
              {/* --- TOP ROW --- */}
              <div className="flex justify-center rounded-lg gap-[10px] mb-[10px]">
                {[0, 1, 2, 3].filter(i => areas[i]).map((i) => (
                  <div
                    key={i}
                    onClick={() => handleAreaClick(areas[i])}
                    className={`group relative rounded-lg cursor-pointer hover:opacity-100 transition-opacity  overflow-hidden ${i === 1 ? "w-[865px] h-[300px]" : "w-[430px] h-[300px]"
                      }`}
                  >
                    <Image
                      src={areas[i].image}
                      alt={areas[i].name}
                      fill
                      className="object-fill rounded-lg"
                    />
                    {/* Light Black Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>

                    {/* Area Name - Top Left - Always visible */}
                    <div className="absolute top-4 left-4 opacity-100 z-30">
                      <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white/30 shadow-lg">
                        <span className="text-white text-sm font-semibold">{areas[i].name}</span>
                      </div>
                    </div>


                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 px-4">
                      <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-3 border border-white/30 shadow-lg max-w-[90%]">
                        {areas[i].descriptionEn ? (
                          <span 
                            className="text-white font-medium text-sm lg:text-base text-center leading-relaxed line-clamp-4"
                            dangerouslySetInnerHTML={{ 
                              __html: areas[i].descriptionEn.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '') 
                            }}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-white text-base lg:text-lg font-semibold">View More</span>
                            <FaArrowRight size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                    </div>


                    {/* View More Button - Bottom Right - Only visible on hover */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white/30 shadow-lg hover:bg-white/30 transition-colors cursor-pointer">
                        <span className="text-white text-sm font-semibold">View More</span>
                        <FaArrowRight size={14} className="text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- BOTTOM ROW --- */}
              <div className="flex justify-center rounded-lg gap-[10px]">
                {[4, 5, 6, 7].filter(i => areas[i]).map((i) => (
                  <div
                    key={i}
                    onClick={() => handleAreaClick(areas[i])}
                    className={`group relative rounded-lg cursor-pointer hover:opacity-90 transition-opacity  overflow-hidden ${i === 7 ? "w-[826px] h-[300px]" : "w-[404px] h-[300px]"
                      }`}
                  >
                    <Image
                      src={areas[i].image}
                      alt={areas[i].name}
                      fill
                      className="object-fill rounded-lg"
                    />
                    {/* Light Black Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity  rounded-lg"></div>

                    {/* Area Name - Top Left - Always visible */}
                    <div className="absolute top-4 left-4 opacity-100 z-30">
                      <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white/30 shadow-lg">
                        <span className="text-white text-sm font-semibold">{areas[i].name}</span>
                      </div>
                    </div>


                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 px-4">
                      <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-3 border border-white/30 shadow-lg max-w-[90%]">
                        {areas[i].descriptionEn ? (
                          <span 
                            className="text-white font-medium text-sm lg:text-base text-center leading-relaxed line-clamp-4"
                            dangerouslySetInnerHTML={{ 
                              __html: areas[i].descriptionEn.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '') 
                            }}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-white text-base lg:text-lg font-semibold">View More</span>
                            <FaArrowRight size={16} className="text-white" />
                          </div>
                        )}

                      </div>
                    </div>

                    {/* View More Button - Bottom Right - Only visible on hover */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white/30 shadow-lg hover:bg-white/30 transition-colors cursor-pointer">
                        <span className="text-white text-sm font-semibold">View More</span>
                        <FaArrowRight size={14} className="text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </section>

    </section>
  );
}