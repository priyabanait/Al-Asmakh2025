import { Search, Mic, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
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
                     shadow-lg hover:bg-[#022d5e] transition-all duration-300 text-center"
            >
              RENT
            </button>

            <button
              style={{ backgroundColor: "#001730", borderRadius: "3px", height: "35px" }}
              className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[160px] flex items-center justify-center 
                     px-2 py-2 text-white text-[11px] md:text-[12px] lg:text-[13px]
                     shadow-lg hover:bg-[#022d5e] transition-all duration-300 text-center flex items-center justify-center "
            >
              BUY
            </button>

            <button
              style={{ borderRadius: "3px", height: "35px" }}
              className="flex items-center justify-center gap-2
                     w-[150px] sm:w-[160px] md:w-[170px] lg:w-[190px]
                    text-[#001730]
                     text-[11px] md:text-[12px] lg:text-[13px]
                     shadow-md  backdrop-blur-md bg-white/10 border border-white/40 transition-all duration-300"
            >
              <ArrowDown size={14} className="opacity-80" />
              View More Filters
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
                     shadow-lg hover:bg-[#022d5e] transition-all duration-300
                     bg-[#001730] rounded-[3px]
                     h-[40px] md:h-[45px]"
            >
              Search
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
        <div className="absolute bottom-[-90px] text-center justify-center flex flex-col items-center  w-full h-full px-8">

          {/* GLASS CARD */}
          <div className="backdrop-blur-sm  bg-white/20 rounded-[3px] p-6 w-full  text-center shadow-lg border border-white/10">

            <h2 className="text-2xl md:text-[27px] font-semibold tracking-wider text-gray-800 px-8">
              REDEFINING  REAL ESTATE
            </h2>



            {/* Underline */}
            <div className="w-[80%] h-[0.5px] bg-gray-300 mx-auto mt-10 my-2"></div>

            <p className="text-xs md:text-[12px] font-semibold mt-4 leading-relaxed">
              Our commitment goes beyond buildings. We craft experiences,
              transform spaces into iconic destinations, and leave a legacy of
              sophistication and innovation across Qatar.
            </p>

          </div>

          {/* BUTTONS */}
          <div className="bg-white/20 rounded-[3px] mt-2  p-4 shadow-lg border border-white/10  backdrop-blur-sm ">
            <div className="flex gap-5  ">
              <button className="px-10 py-3 bg-[#0A2A4C] text-white text-[11px] md:text-[12px] rounded-[3px] font-semibold shadow-md">
                RENT
              </button>
              <button className="px-10 py-3 bg-[#0A2A4C] text-white text-[11px] md:text-[12px] rounded-[3px] font-semibold shadow-md">
                BUY
              </button>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="bg-white/20 rounded-[3px] mt-2  p-2  shadow-lg border border-white/10  backdrop-blur-sm ">
            <div className="flex items-center mx-4 px-4 bg-white rounded-[3px] shadow-md   py-3">
              <div className="p-2 bg-[#001730] rounded-[3px] flex items-center justify-center h-[32px] w-[32px]">
                <Search className="text-white h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Type here..."
                className="flex-1 ml-3 outline-none text-sm md:text-[10px]"
              />
              <Mic className="text-gray-500" size={20} />
            </div>
          </div>

        </div>

        {/* FILTER BUTTON */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white/20 rounded-[3px] p-4 px-14 shadow-lg border border-white/10 backdrop-blur-sm z-50">
          <div className="flex w-full bg-[#0A2A4C] text-white px-4 py-3 rounded-[3px] shadow-md items-center">

            {/* LEFT SIDE: Icon + Divider + Text */}
            <div className="flex items-center gap-3">

              {/* ICON */}
              <img
                src="/Icon (10).png"
                alt="Filter Icon"
                className="w-5 h-5"
              />

              {/* VERTICAL DIVIDER */}
              <div className="h-5 w-[1px] bg-white"></div>

              {/* TEXT */}
              <span className="font-medium text-sm md:text-[12px]">Filters</span>
            </div>

            {/* ARROW ICON */}
            <ArrowDown size={18} className="ml-24" />

          </div>
        </div>

      </section>
    </div>
  );
}