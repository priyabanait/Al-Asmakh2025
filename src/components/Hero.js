"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Mic, ArrowDown } from "lucide-react";
import { VscSettings } from "react-icons/vsc";
import { motion } from "framer-motion";
import MoreFiltersModal from "./MoreFiltersModal";
import LocationAutocomplete from "./LocationAutocomplete";

export default function Hero() {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
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
    // Control video playback based on screen size
    if (isDesktop) {
      // Desktop: play desktop video, pause mobile video
      if (desktopVideoRef.current) {
        desktopVideoRef.current.play().then(() => {
          // Unmute after video starts playing
          desktopVideoRef.current.muted = false;
        }).catch(console.error);
      }
      if (mobileVideoRef.current) {
        mobileVideoRef.current.pause();
        mobileVideoRef.current.currentTime = 0;
      }
    } else {
      // Mobile: play mobile video, pause desktop video
      if (mobileVideoRef.current) {
        mobileVideoRef.current.play().then(() => {
          // Unmute after video starts playing
          mobileVideoRef.current.muted = false;
        }).catch(console.error);
      }
      if (desktopVideoRef.current) {
        desktopVideoRef.current.pause();
        desktopVideoRef.current.currentTime = 0;
      }
    }
  }, [isDesktop]);

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
          {/* <div className="p-4 bg-gray-400 rounded-[3px] shadow-md gap-4 flex flex-wrap lg:hidden">

<button
  style={{ backgroundColor: "#001730", borderRadius: "3px", height: "35px" }}
  className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[160px]
             px-2 py-2 text-white text-[11px] md:text-[12px] lg:text-[13px]
             shadow-lg hover:bg-[#022d5e] transition-all duration-300"
>
  RENT
</button>

<button
  style={{ backgroundColor: "#001730", borderRadius: "3px", height: "35px" }}
  className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[160px]
             px-2 py-2 text-white text-[11px] md:text-[12px] lg:text-[13px]
             shadow-lg hover:bg-[#022d5e] transition-all duration-300"
>
  BUY
</button>

</div> */}


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
                placeholder="Describe your dream Property by searching all our properties . . ."
                className="flex-1 bg-transparent outline-none text-[8px] md:text-[10px] lg:text-[13px] text-[#001730] placeholder:text-gray-500 placeholder:text-[7px] md:placeholder:text-[7px] lg:placeholder:text-[11px]"
              />

              <Mic className="text-[#001730] h-6 w-6 ml-2" />
            </div>

            {/* Search Button */}
            <button
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
      <section className="lg:hidden relative w-full min-h-screen  items-center justify-center" style={{ overflow: 'visible' }}>

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
          <div className="backdrop-blur-sm bg-white/20 rounded-[3px] p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 2xl:p-12 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl text-center shadow-lg border border-white/10">

            <h2 className="text-xl sm:text-2xl md:text-[27px] lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold tracking-wider text-gray-800 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
              REDEFINING  REAL ESTATE
            </h2>



            {/* Underline */}
            <div className="w-[80%] h-[0.5px] bg-gray-300 mx-auto mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-14 my-2"></div>

            <p className="text-xs sm:text-sm md:text-[12px] lg:text-sm xl:text-base 2xl:text-lg font-semibold mt-3 sm:mt-4 md:mt-5 lg:mt-6 leading-relaxed">
              Our commitment goes beyond buildings. We craft experiences,
              transform spaces into iconic destinations, and leave a legacy of
              sophistication and innovation across Qatar.
            </p>

          </div>

          {/* BUTTONS */}
          <div className="bg-white/20 rounded-[3px] mt-2 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 shadow-lg border border-white/10 backdrop-blur-sm w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
            <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-center">
              <button
                className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-2 sm:py-2.5 md:py-3 lg:py-4 xl:py-5 bg-[#0A2A4C] text-white text-[11px] sm:text-xs md:text-[12px] lg:text-sm xl:text-base 2xl:text-lg rounded-[3px] font-semibold shadow-md relative overflow-hidden"
              >
                <span className="relative z-10">
                  RENT
                </span>
              </button>
              <button
                className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-2 sm:py-2.5 md:py-3 lg:py-4 xl:py-5 bg-[#0A2A4C] text-white text-[11px] sm:text-xs md:text-[12px] lg:text-sm xl:text-base 2xl:text-lg rounded-[3px] font-semibold shadow-md relative overflow-hidden"
              >
                <span className="relative z-10">
                  BUY
                </span>
              </button>
            </div>
          </div>

          {/* SEARCH BAR WITH FILTER - SAME LINE */}
          <div className="bg-white/20 rounded-[3px] mt-2 p-2 sm:p-3 md:p-4 lg:p-5 shadow-lg border border-white/10 backdrop-blur-sm w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Input Section with Location Autocomplete */}
              <div className="flex-1">
                <LocationAutocomplete
                  value={locationSearch}
                  onChange={(value) => setLocationSearch(value)}
                  onSelect={(value) => {
                    setLocationSearch(value);
                    // Trigger search or navigate to results
                  }}
                  placeholder="Search location..."
                  className="w-full"
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowMoreFilters(true)}
                className="bg-white rounded-[3px] shadow-md p-2 sm:p-2.5 md:p-3 lg:p-4 flex items-center justify-center h-[45px] sm:h-[50px] md:h-[55px] lg:h-[60px] w-[45px] sm:w-[50px] md:w-[55px] lg:w-[60px] flex-shrink-0"
              >
                <VscSettings className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:w-7 lg:w-8 lg:h-8 text-gray-600" />
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* More Filters Modal - Hide new filters on home page */}
      <MoreFiltersModal
        isOpen={showMoreFilters}
        onClose={() => setShowMoreFilters(false)}
        onShowResults={() => {
          // Handle show results action
          console.log("Show results clicked");
        }}
        hideNewFilters={true}
      />
    </div>
  );
}