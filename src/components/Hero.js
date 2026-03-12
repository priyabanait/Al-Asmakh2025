"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Mic, ArrowDown } from "lucide-react";
import { VscSettings } from "react-icons/vsc";
import { motion } from "framer-motion";
import MoreFiltersModal from "./MoreFiltersModal";
import LocationAutocomplete from "./LocationAutocomplete";
import SpeechToTextModal from "./SpeechToTextModal";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showSpeechModal, setShowSpeechModal] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  // Initialize with a check if window is available (client-side)
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024; // lg breakpoint
    }
    return false;
  });
  const desktopVideoRef = useRef(null);
  const mobileVideoRef = useRef(null);

  useEffect(() => {
    // Check initial screen size
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };

    // Set initial value (in case it wasn't set correctly)
    checkScreenSize();

    // Listen for resize events
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    // Control video playback based on screen size, but pause/mute when voice modal is open
    if (showSpeechModal) {
      // Mute and pause both videos while voice search is active
      if (desktopVideoRef.current) {
        desktopVideoRef.current.muted = true;
        desktopVideoRef.current.pause();
      }
      if (mobileVideoRef.current) {
        mobileVideoRef.current.muted = true;
        mobileVideoRef.current.pause();
      }
      return;
    }

    if (isDesktop) {
      // Desktop: play desktop video, pause mobile video
      if (desktopVideoRef.current) {
        desktopVideoRef.current
          .play()
          .then(() => {
            // Unmute after video starts playing
            desktopVideoRef.current.muted = false;
          })
          .catch(console.error);
      }
      if (mobileVideoRef.current) {
        mobileVideoRef.current.pause();
        mobileVideoRef.current.currentTime = 0;
      }
    } else {
      // Mobile: play mobile video, pause desktop video
      if (mobileVideoRef.current) {
        mobileVideoRef.current
          .play()
          .then(() => {
            // Unmute after video starts playing
            mobileVideoRef.current.muted = false;
          })
          .catch(console.error);
      }
      if (desktopVideoRef.current) {
        desktopVideoRef.current.pause();
        desktopVideoRef.current.currentTime = 0;
      }
    }
  }, [isDesktop, showSpeechModal]);

  // Handle search functionality
  const handleSearch = (overrideQuery) => {
    const rawQuery = (overrideQuery !== undefined ? overrideQuery : searchQuery) || "";
    const query = rawQuery.trim() || locationSearch.trim();

    // Minimum 4 characters (excluding spaces) to prevent empty/too-short searches
    const normalized = query.replace(/\s+/g, "");
    if (!normalized || normalized.length < 4) {
      return;
    }

    // Detect intent: sale vs rent from query text
    const lowered = query.toLowerCase();
    const hasSaleWord =
      /\bsale\b/.test(lowered) ||
      /\bsales\b/.test(lowered) ||
      /\bfor sale\b/.test(lowered) ||
      /\bbuy\b/.test(lowered) ||
      /\bpurchase\b/.test(lowered);
    const hasRentWord =
      /\brent\b/.test(lowered) ||
      /\brental\b/.test(lowered) ||
      /\bfor rent\b/.test(lowered) ||
      /\blease\b/.test(lowered);

    let url = `/listings/search?query=${encodeURIComponent(query)}`;

    // Only append priceType when intent is clear, so backend + page both see it
    if (hasSaleWord && !hasRentWord) {
      url += `&priceType=sale`;
    } else if (hasRentWord && !hasSaleWord) {
      url += `&priceType=rent`;
    }

    router.push(url);
  };

  return (
    <div>


      <section className="hidden lg:flex relative w-full min-h-screen  items-center justify-center overflow-hidden">

        {isDesktop && (
          <video
            ref={desktopVideoRef}
            src="/images/hero_section_video.mov"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}

        {/* overlay only for mobile */}
        <div className="absolute inset-0 bg-black/20 md:bg-transparent" />

        {/* MAIN BOX */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="
        relative z-10 lg:text-left text-center  fone-semibold text-[#001730]
        px-4 md:px-4 lg:px-8 3xl:px-10 4xl:px-12 5xl:px-14
        border border-white/10 backdrop-blur-sm bg-white/20 
        p-5 sm:p-6 md:p-5 lg:p-8 3xl:p-10 4xl:p-12 5xl:p-14
  
        mx-auto
        mt-16 sm:mt-24 md:mt-30 lg:mt-30
        
        w-[92%] sm:w-[96%] md:w-[90%] lg:w-[85%] 3xl:w-[80%] 4xl:w-[75%] 5xl:w-[70%]
        max-w-[360px] sm:max-w-[550px] md:max-w-[770px] lg:max-w-[900px] 3xl:max-w-[1100px] 4xl:max-w-[1300px] 5xl:max-w-[1500px]
  
        max-h-[750px] sm:max-h-[550px] md:max-h-[430px] lg:max-h-[500px] 3xl:max-h-[600px] 4xl:max-h-[700px] 5xl:max-h-[800px]
        rounded-[3px]
      "
        >

          {/* HEADING */}
          <h1 className="text-sm sm:text-2xl mx-20 lg:mx-0 text-uppercase   md:text-[28px] lg:text-[28px] mb-2 md:mb-3 lg:mb-4 ">
            YOUR PROPERTY JOURNEY BEGINS HERE
          </h1>



          {/* Line */}

          <div className="w-[95%] h-[0.5px] mt-2 lg:mt-3 bg-gray-300 mx-auto  lg:mx-0 mb-3  lg:mb-2"></div>

          {/* DESCRIPTION */}
          <p
            className="mb-3 text-[10px]  sm:text-[11px] text-left mx-2 lg:mx-0 md:text-[12px] lg:text-xs"

          >
            Start your search online and continue it with real people who understand Qatar’s communities, real estate market and your unique needs.
          </p>

          {/* BUTTONS */}
          <div className="hidden lg:flex flex-wrap gap-2 md:gap-2 lg:gap-2 mt-4  lg:mt-6">

            <button
              onClick={() => router.push("/listings/rent")}
              style={{ backgroundColor: "#001730", borderRadius: "3px", height: "35px" }}
              className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[160px]
                     px-2 py-2 text-white text-[11px] md:text-[12px] lg:text-[13px]
                     shadow-lg hover:bg-[#022d5e] text-center relative overflow-hidden"
            >
              <span className="relative z-10">
                RENT
              </span>
            </button>

            <button
              onClick={() => router.push("/listings/listing-sale")}
              style={{ backgroundColor: "#001730", borderRadius: "3px", height: "35px" }}
              className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[160px] flex items-center justify-center 
                     px-2 py-2 text-white text-[11px] md:text-[12px] lg:text-[13px]
                     shadow-lg hover:bg-[#022d5e] text-center relative overflow-hidden"
            >
              <span className="relative z-10">
                BUY
              </span>
            </button>

            <button
              onClick={() => setShowMoreFilters(true)}
              style={{ borderRadius: "3px", height: "35px" }}
              className="flex items-center justify-center gap-2
                     w-[150px] sm:w-[160px] md:w-[170px] lg:w-[190px]
                    text-[#001730]
                     text-[11px] md:text-[12px] lg:text-[13px]
                     shadow-md  backdrop-blur-md bg-white/10 border border-white/40 relative overflow-hidden"
            >
              <ArrowDown size={14} className="opacity-80 relative z-10" />
              <span className="relative z-10">View More Filters</span>
            </button>

          </div>
          <div className="w-[90%] h-[0.5px] bg-gray-300  bg my-2 "></div>
          


          {/* SEARCH BAR */}
          <div className="mt-5 lg:mt-2 flex flex-col sm:flex-row gap-2 md:gap-3">

            {/* Input */}
            <div className="flex items-center bg-white/90 backdrop-blur-md rounded-[3px]
                        border border-white/30 px-2
                        w-full  lg:w-[63%]
                        shadow-md h-[45px] md:h-[45px]">

              <div className="p-2 bg-[#001730] rounded-[3px] mr-2 flex items-center justify-center h-[28px] w-[28px]">
                <Search className="text-white h-6 w-6" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe your dream Property by searching all our properties . . ."
                className="flex-1 bg-transparent outline-none text-[8px] md:text-[10px] lg:text-[13px] text-[#001730] placeholder:text-gray-500 placeholder:text-[7px] md:placeholder:text-[7px] lg:placeholder:text-[11px]"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />

              <button
                type="button"
                onClick={() => setShowSpeechModal(true)}
                className="text-[#001730] h-6 w-6 ml-2 hover:opacity-70 transition-opacity cursor-pointer"
              >
                <Mic className="h-6 w-6" />
              </button>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full  lg:w-[210px]
                     text-white text-[11px] md:text-[12px] lg:text-[13px]
                     shadow-lg hover:bg-[#022d5e]
                     bg-[#001730] rounded-[3px]
                     h-[40px] md:h-[45px] relative overflow-hidden"
            >
              <span className="relative z-10">
                Search
              </span>
            </button>

          </div>

        </motion.div>

      </section>
      <section className="lg:hidden relative w-full min-h-screen items-center justify-center" style={{ overflow: 'visible' }}>

        {/* BACKGROUND VIDEO OR IMAGE */}
        {!isDesktop && (
          <video
            ref={mobileVideoRef}
            src="/images/hero_section_video_vertical.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}


        {/* OVERLAY */}
        <div className="absolute inset-0"></div>

        {/* MAIN CONTENT */}
        <div className="absolute bottom-[-90px] text-center justify-center flex flex-col items-center w-full h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">

          {/* GLASS CARD */}
          <div className="backdrop-blur-sm bg-white/20 rounded-[3px] p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 2xl:p-12 3xl:p-14 4xl:p-16 5xl:p-20 6xl:p-24 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl 3xl:max-w-[1400px] 4xl:max-w-[1800px] 5xl:max-w-[2400px] 6xl:max-w-[3200px] text-center shadow-lg border border-white/10">

            <h2 className="text-xl sm:text-2xl md:text-[27px] lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl 5xl:text-8xl 6xl:text-9xl font-semibold tracking-wider text-gray-800 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 3xl:px-20 4xl:px-24 5xl:px-28 6xl:px-32">
              REDEFINING  REAL ESTATE
            </h2>



            {/* Underline */}
            <div className="w-[80%] h-[0.5px] bg-gray-300 mx-auto mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-14 2xl:mt-16 3xl:mt-20 4xl:mt-24 5xl:mt-28 6xl:mt-32 my-2"></div>

            <p className="text-xs sm:text-sm md:text-[12px] lg:text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-2xl 5xl:text-3xl 6xl:text-4xl font-semibold mt-3 sm:mt-4 md:mt-5 lg:mt-6 2xl:mt-8 3xl:mt-10 4xl:mt-12 5xl:mt-14 6xl:mt-16 leading-relaxed px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16 4xl:px-20 5xl:px-24 6xl:px-28">
              Our commitment goes beyond buildings. We craft experiences,
              transform spaces into iconic destinations, and leave a legacy of
              sophistication and innovation across Qatar.
            </p>

          </div>

          {/* BUTTONS */}
          <div className="bg-white/20 rounded-[3px] mt-2 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10 3xl:p-12 4xl:p-14 5xl:p-16 6xl:p-20 shadow-lg border border-white/10 backdrop-blur-sm w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl 3xl:max-w-[1400px] 4xl:max-w-[1800px] 5xl:max-w-[2400px] 6xl:max-w-[3200px]">
            <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-center">
              <button
                className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-2 sm:py-2.5 md:py-3 lg:py-4 xl:py-5 bg-[#0A2A4C] text-white text-[11px] sm:text-xs md:text-[12px] lg:text-sm xl:text-base 2xl:text-lg rounded-[3px] font-semibold shadow-md relative overflow-hidden"
              >
                <span className="relative z-10" onClick={() => router.push("/listings/rent")}>
                  RENT
                </span>
              </button>
              <button
                className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-2 sm:py-2.5 md:py-3 lg:py-4 xl:py-5 bg-[#0A2A4C] text-white text-[11px] sm:text-xs md:text-[12px] lg:text-sm xl:text-base 2xl:text-lg rounded-[3px] font-semibold shadow-md relative overflow-hidden"
              >
                <span className="relative z-10" onClick={() => router.push("/listings/sale")}>
                  BUY
                </span>
              </button>
            </div>
          </div>

          {/* SEARCH BAR WITH FILTER - SAME LINE */}
          <div className="bg-white/20 rounded-[3px] mt-2 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-8 3xl:p-10 4xl:p-12 5xl:p-14 6xl:p-16 shadow-lg border border-white/10 backdrop-blur-sm w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl 3xl:max-w-[1400px] 4xl:max-w-[1800px] 5xl:max-w-[2400px] 6xl:max-w-[3200px]">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Full-text Search Input (matches desktop behavior) */}
              <div className="flex-1 flex items-center bg-white/90 backdrop-blur-md rounded-[3px] border border-white/30 px-2 h-[45px]">
                <div className="p-2 bg-[#001730] rounded-[3px] mr-2 flex items-center justify-center h-[28px] w-[28px]">
                  <Search className="text-white h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by location, landmark or property..."
                  className="flex-1 bg-transparent outline-none text-[10px] sm:text-xs text-[#001730] placeholder:text-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowSpeechModal(true)}
                  className="text-[#001730] h-5 w-5 ml-2 hover:opacity-70 transition-opacity cursor-pointer"
                  aria-label="Voice search"
                >
                  <Mic className="h-5 w-5" />
                </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowMoreFilters(true)}
                className="bg-white rounded-[3px] shadow-md p-2 sm:p-2.5 md:p-3 flex items-center justify-center h-[45px] sm:h-[50px] md:h-[55px] w-[45px] sm:w-[50px] md:w-[55px] flex-shrink-0"
                aria-label="Advanced filters"
              >
                <VscSettings className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-600" />
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* More Filters Modal - Hide new filters on home page */}
      <MoreFiltersModal
        isOpen={showMoreFilters}
        onClose={() => setShowMoreFilters(false)}
        // For homepage we want to navigate to the listings search page with filters in the URL
        navigateToSearchPage={true}
        onShowResults={() => {
          // No-op for now; navigation is handled inside the modal
        }}
        hideNewFilters={true}
      />

      {/* Speech to Text Modal */}
      <SpeechToTextModal
        isOpen={showSpeechModal}
        onClose={() => setShowSpeechModal(false)}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onQueryChange={setSearchQuery}
      />
    </div>
  );
}