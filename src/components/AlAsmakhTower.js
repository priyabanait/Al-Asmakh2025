"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

export default function AlAsmakhTower() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const areaCarouselRef = useRef(null);

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

  const areas = [
    { name: "Lusail City", image: "/images_prop/1.png" },
    { name: "Pearl Island", image: "/images_prop/2.png" },
    { name: "Lusail City", image: "/images_prop/3.png" },
    { name: "Doha", image: "/images_prop/4.png" },
    { name: "Al Sadd", image: "/images_prop/5.png" },
    { name: "Lusail City", image: "/images_prop/6.png" },
    { name: "Al Dafna", image: "/images_prop/7.png" },
    { name: "West Bay", image: "/images_prop/8.png" },
  ];


  const projects = [
    {
      title: "AL ASMAKH TOWER",
      location: "West Bay",
      subheading: "A Future-Focused Tower with Heritage at Its Core.",
      description:
        "An iconic GSAS 4-star certified office tower in West Bay that brings together ARDEC's legacy, sustainable design, and smart technology to create a long-term base for leading organisations in Qatar. Al Asmakh Tower reflects how ARDEC thinks about commercial real estate: combine architectural presence with spaces that work in real life. Positioned along Doha's business skyline, the tower offers flexible floorplates and 40 commercial units that can adapt as companies grow, restructure, or expand regional teams.",
      img: "/407.png",
    },
    {
      title: "BEVERLY HILLS TOWER",
      location: "West Bay",
      subheading: "Serviced City Living, with Hotel-Style Comfort Every Day.",
      description:
        "A 30-storey residential tower in West Bay offering 318 fully furnished apartments, premium wellness facilities, and 24-hour concierge services in one centrally connected address. Beverly Hills Tower is designed for those who want hotel-style ease without losing the feeling of home. From the moment you arrive, a staffed lobby, round-the-clock concierge, and secure access create a sense of being looked after, whether you are staying for a year or a longer assignment in Doha.",
      img: "https://media.istockphoto.com/id/175767618/photo/modern-townhouse-complex.jpg?s=612x612&w=0&k=20&c=ltPDM5QTC1a4cdr7Fjvct-KNlNCUPC_IyNC2f93eJ84=",
    },
    {
      title: "FLORESTA TOWER, THE PEARL",
      location: "The Pearl",
      subheading: "Sea Views, Smart Living, and a Private Beach Below.",
      description:
        "A waterfront tower on The Pearl offering 102 luxury apartments, panoramic sea views, smart home technology, and private beach access in one of Qatar's most recognisable island settings. Floresta Tower is designed for those who crave the calm of a private shoreline with the convenience of tower living. Residences open out to sweeping views of the sea and marina, creating a daily connection to the water that is rare even on The Pearl. At ground level, residents enjoy direct access to a private beach area, turning early morning swims and sunset walks into a natural part of life at home.",
      img: "https://images.pexels.com/photos/358636/pexels-photo-358636.jpeg?cs=srgb&dl=pexels-pixabay-358636.jpg&fm=jpg",
    },
    {
      title: "LES MAISONS BLANCHES",
      location: "Lusail",
      subheading: "A Neighbourhood Feel, with City Life on Your Doorstep.",
      description:
        "An exclusive compound of villas and apartments, thoughtfully planned around a central clubhouse, with everyday services, and easy access to Lusail's key destinations. Les Maisons Blanches is for residents who want the feel of a neighbourhood, without losing the benefits of a central Lusail location. Inside the gates, the focus is on quiet streets, defined entrances, and homes that feel spacious and private. Outside, the city's newest retail and entertainment districts are only a short drive away.",
      img: "https://images.pexels.com/photos/358636/pexels-photo-358636.jpeg?cs=srgb&dl=pexels-pixabay-358636.jpg&fm=jpg",
    },
  ];

  const handleAreaTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleAreaTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleAreaTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

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
    setCurrentAreaIndex((prev) => (prev === 0 ? areas.length - 1 : prev - 1));
  };

  const goToNextArea = () => {
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

          {/* FROSTED GLASS CARD OVERLAY */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ padding: "16px" }}
          >
            <div
              className="relative bg-white/20 w-full max-w-md mx-auto p-4 md:p-8 rounded-2xl"
              style={{

                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
                margin: "0 auto",
              }}
            >
              {/* CONTENT */}
              <div className="relative text-center md:text-left ">
                {/* TITLE */}
                <h2
                  id="my-heading"
                  className=" text-[#001730] mb-2 md:mb-4 uppercase tracking-wide"
                >
                  {projects[activeSlide].title}
                </h2>

                {/* SUBHEADING */}
                {projects[activeSlide].subheading && (
                  <p className="text-[#001730] text-sm md:text-base font-medium mb-2 md:mb-3 italic">
                    {projects[activeSlide].subheading}
                  </p>
                )}

                <div className="w-[90%] h-[1px] bg-gray-300 mx-auto my-2"></div>
                {/* SEPARATOR LINE */}


                {/* LOCATION */}
                <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-5 justify-center md:justify-start text-center md:text-left">

                  <MapPin
                    size={16}
                    className="text-[#001730] md:w-[18px] md:h-[18px]"
                  />

                  <span
                    className="text-[#001730] text-sm md:text-base"
                    style={{ fontSize: "clamp(13px, 1vw, 16px)" }}
                  >
                    {projects[activeSlide].location}
                  </span>

                </div>


                {/* DESCRIPTION */}
                <p
                  className="text-gray-400  mb-4 md:mb-8 leading-relaxed text-sm md:text-base"
                  style={{ fontSize: "13px" }}
                >
                  {projects[activeSlide].description}
                </p>

                {/* DETAILS BUTTON */}
                <div className="flex justify-center md:justify-start">
                  <button
                    className="flex items-center justify-between gap-2 bg-[#001730] text-white px-4 md:px-6 py-2 md:py-3 rounded-md font-medium shadow-lg transition-all duration-300 hover:bg-[#002d52] text-sm md:text-base"
                    style={{ fontSize: "clamp(13px, 1.1vw, 16px)" }}
                  >
                    <span>Details</span>
                    <FaArrowRight size={12} className="md:w-[14px] md:h-[14px]" />
                  </button>
                </div>

              </div>
            </div>
          </motion.div>

          {/* NAVIGATION DOTS - Pill Style Below the card */}
          <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex items-center justify-center gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className="relative flex items-center justify-center"
                aria-label={`Go to slide ${index + 1}`}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={false}
                  animate={{
                    scale: index === activeSlide ? 1.2 : 1,
                    opacity: index === activeSlide ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                <motion.span
                  className={`
                    block rounded-full
                    ${index === activeSlide
                      ? "bg-[#001730]"
                      : "bg-gray-400"
                    }
                  `}
                  animate={{
                    width: index === activeSlide ? "24px" : "8px",
                    height: index === activeSlide ? "8px" : "8px",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* DESKTOP - Grid Layout */}
      <div className="hidden lg:grid grid-cols-[60%_40%] gap-6 md:gap-10 3xl:gap-10 4xl:gap-12 relative min-h-screen items-center ">

        {/* LEFT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative w-full h-full min-h-[500px]"
          style={{ marginLeft: 0, paddingLeft: 0, width: "100%" }}
        >
          <Image
            src={projects[activeSlide].img || "/407.png"}
            alt={projects[activeSlide].title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* DESKTOP RIGHT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="hidden lg:flex flex-col justify-center pl-6"
        >
          <h2
            className="font-semibold text-[#00254D] text-[18px] md:text-[22px] uppercase tracking-wide"
          >
            {projects[activeSlide].title}
          </h2>

          {/* SUBHEADING */}
          {projects[activeSlide].subheading && (
            <p className="text-[#00254D] text-[15px] md:text-[17px] font-medium mb-3 italic">
              {projects[activeSlide].subheading}
            </p>
          )}

          <div className="w-[30%] h-[1px]  bg-gray-300  my-4 "></div>
          <div className="flex items-center gap-2 mb-4 md:mb-5">
            <MapPin
              size={20}
              className="text-gray-600"
              style={{ width: "clamp(16px, 1.2vw, 20px)" }}
            />
            <span
              className="text-gray-600 text-[18px] md:text-[22px]"
              style={{ fontSize: "clamp(12px, 1vw, 16px)" }}
            >
              {projects[activeSlide].location}
            </span>
          </div>

          <p
            style={{ color: "#919191", fontSize: "clamp(13px, 0.8vw, 17px)" }}
            className="mb-6 mr-60 lg:mb-16 leading-relaxed text-[15px] md:text-[15px]"
          >
            {projects[activeSlide].description}
          </p>

          <div className="flex justify-center md:justify-start">
            <button className="flex items-center gap-2 bg-[#001730] text-white px-4 py-2 rounded-md text-[12px] hover:bg-[#002d52] transition-colors">
              <span>Details</span>
              <FaArrowRight size={12} className="md:w-[12px] md:h-[12px] ml-4 lg:ml-32" />
            </button>
          </div>


          {/* <button
            className="flex items-center justify-center gap-2 bg-[#001730] text-white px-6 md:px-8 py-3 md:py-3.5 rounded-md hover:bg-[#022d5e] transition-all duration-300 shadow-md hover:shadow-lg w-fit text-[18px] md:text-[22px]"
            style={{ fontSize: "clamp(12px, 1.1vw, 16px)" }}
          >
            <span>Details</span>
            <FaArrowRight size={16} className="ml-16" />
          </button> */}

          {/* PILL STYLE NAVIGATION DOTS */}
          <div className="flex items-center gap-2 mt-[60px] ml-[40px]">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className="relative flex items-center justify-center"
                aria-label={`Go to slide ${index + 1}`}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={false}
                  animate={{
                    scale: index === activeSlide ? 1.2 : 1,
                    opacity: index === activeSlide ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                <motion.span
                  className={`
                    block rounded-full
                    ${index === activeSlide
                      ? "bg-[#001730]"
                      : "bg-gray-400"
                    }
                  `}
                  animate={{
                    width: index === activeSlide ? "32px" : "8px",
                    height: index === activeSlide ? "8px" : "8px",
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

          {/* Mobile Carousel - Only visible on mobile */}
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
                className="flex transition-transform duration-300 ease-in-out"
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
                        style={{
                          borderRadius: "8px",
                          width: "100%",
                          maxWidth: "100%",
                          height: "300px",
                          position: "relative",
                          overflow: "hidden",
                          margin: "0 auto",
                        }}
                        className="shadow-lg md:h-[400px]"
                      >
                        <Image
                          src={area.image}
                          alt={area.name}
                          fill
                          className="object-cover rounded-lg"
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
                  className="w-9 h-9 md:w-10 md:h-10 rounded-sm bg-white border border-black flex items-center justify-center hover:bg-gray-50 transition-all duration-300"
                  aria-label="Previous area"
                >
                  <FaArrowLeft size={14} className="md:w-4 md:h-4 text-black" />
                </button>

                {/* Next Button */}
                <button
                  onClick={goToNextArea}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-sm bg-[#001730] flex items-center justify-center hover:bg-[#022d5e] transition-all duration-300"
                  aria-label="Next area"
                >
                  <FaArrowRight size={14} className="md:w-4 md:h-4 text-white" />
                </button>

              </div>

            </div>
          </div>

          {/* Desktop Grid - Hidden on mobile */}
          <div className="hidden lg:block">
            {/* --- TOP ROW --- */}
            <div className="flex justify-center rounded-lg gap-[10px] mb-[10px]">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`relative rounded-lg ${i === 1 ? "w-[865px] h-[300px]" : "w-[430px] h-[300px]"
                    }`}
                >
                  <Image
                    src={areas[i].image}
                    alt={areas[i].name}
                    fill
                    className="object-fill rounded-lg"
                  />
                </div>
              ))}
            </div>

            {/* --- BOTTOM ROW --- */}
            <div className="flex justify-center rounded-lg gap-[10px]">
              {[4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className={`relative rounded-lg ${i === 7 ? "w-[826px] h-[300px]" : "w-[404px] h-[300px]"
                    }`}
                >
                  <Image
                    src={areas[i].image}
                    alt={areas[i].name}
                    fill
                    className="object-fill rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

    </section>
  );
}
