"use client";
import { useState } from "react";
import { Search, Mic, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import MoreFiltersModal from "./MoreFiltersModal";

export default function Hero() {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  return (
    <div>


      <section className="hidden lg:flex relative w-full min-h-screen  items-center justify-center overflow-hidden">

        <video
          src="/images/hero_section_video.mov"
          autoPlay
          loop

          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* overlay only for mobile */}
        <div className="absolute inset-0 bg-black/20 md:bg-transparent" />

        {/* MAIN BOX */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="
        relative z-10 lg:text-left text-center  fone-semibold text-[#001730]
        px-4 md:px-4 lg:px-8
        border border-white/10 backdrop-blur-sm bg-white/20 
        p-5 sm:p-6 md:p-5 lg:p-8 
  
        mx-auto
        mt-16 sm:mt-24 md:mt-40 lg:mt-52
        
        w-[92%] sm:w-[96%] md:w-[90%] lg:w-[85%]
        max-w-[360px] sm:max-w-[550px] md:max-w-[770px] lg:max-w-[900px]
  
        max-h-[750px] sm:max-h-[550px] md:max-h-[430px] lg:max-h-[500px]
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
        <video
          src="/images/hero_section_video.mov"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        />


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

          {/* SEARCH BAR */}
          <div className="bg-white/20 rounded-[3px] mt-2 p-2 sm:p-3 md:p-4 lg:p-5 shadow-lg border border-white/10 backdrop-blur-sm w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
            <div className="flex items-center mx-2 sm:mx-3 md:mx-4 lg:mx-5 px-3 sm:px-4 md:px-5 lg:px-6 bg-white rounded-[3px] shadow-md py-2 sm:py-2.5 md:py-3 lg:py-4">
              <div className="p-1.5 sm:p-2 md:p-2.5 bg-[#001730] rounded-[3px] flex items-center justify-center h-[28px] w-[28px] sm:h-[32px] sm:w-[32px] md:h-[36px] md:w-[36px] lg:h-[40px] lg:w-[40px]">
                <Search className="text-white h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
              </div>
              <input
                type="text"
                placeholder="Type here..."
                className="flex-1 ml-2 sm:ml-3 md:ml-4 outline-none text-xs sm:text-sm md:text-[10px] lg:text-sm xl:text-base 2xl:text-lg"
              />
              <Mic className="text-gray-500 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
            </div>
          </div>

        </div>

        {/* FILTER BUTTON */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white/20 rounded-[3px] p-3 sm:p-4 md:p-5 lg:p-6 px-8 sm:px-10 md:px-12 lg:px-14 xl:px-16 2xl:px-20 shadow-lg border border-white/10 backdrop-blur-sm z-50 cursor-pointer"
        >
          <div className="flex w-full bg-[#0A2A4C] text-white px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-[3px] shadow-md items-center relative overflow-hidden">

            {/* LEFT SIDE: Icon + Divider + Text */}
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 relative z-10">

              {/* ICON */}
              <img
                src="/Icon (10).png"
                alt="Filter Icon"
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
              />

              {/* VERTICAL DIVIDER */}
              <div className="h-4 sm:h-5 md:h-6 lg:h-7 w-[1px] bg-white"></div>

              {/* TEXT */}
              <span className="font-medium text-xs sm:text-sm md:text-[12px] lg:text-sm xl:text-base 2xl:text-lg">Filters</span>
            </div>

            {/* ARROW ICON */}
            <div className="ml-12 sm:ml-16 md:ml-20 lg:ml-24 xl:ml-32 2xl:ml-40 relative z-10">
              <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
            </div>

          </div>
        </div>

      </section>

      {/* More Filters Modal */}
      <MoreFiltersModal
        isOpen={showMoreFilters}
        onClose={() => setShowMoreFilters(false)}
        onShowResults={() => {
          // Handle show results action
          console.log("Show results clicked");
        }}
      />
    </div>
  );
}