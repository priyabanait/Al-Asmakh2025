"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { Search, Mic, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

    const partners = [
        "/491.png",
        "/492.png",
        "/494.png",
        "/497.png",
        "/495.png",
      ];
    const services = [
        {
          icon: "/Icon for previlage_Registration.png",
          title: "Easy Registration",
          desc: "Tenants and staff can quickly register online to become Privilege Members with minimal steps.",
        },
        {
          icon: "/Icon for previlage_Digital Card.png",
          title: "Digital Membership Card",
          desc: "Instantly receive a personalized digital membership card for convenient access anytime, anywhere.",
        },
        {
          icon: "/Icon for previlage_Family Membership.png",
          title: "Family Memberships",
          desc: "Add and manage family members under your account to extend program benefits effortlessly.",
        },
        {
          icon: "/2_Icons Used_Sales 1.png",
          title: "Exclusive Offers",
          desc: "Access partner discounts, promotions, and privileges curated exclusively for Al Asmakh members.",
        },
        {
          icon: "/icons/icon5.png",
          title: "Future-Ready Integration",
          desc: "Built to seamlessly connect with the broader AREDC platform.",
        },
      ];

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused) {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
      return;
    }

    autoScrollIntervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= services.length - 1) {
          return 0; // Loop back to start
        }
        return prevIndex + 1;
      });
    }, 3000); // Auto-scroll every 3 seconds

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isPaused, services.length]);

  const handleTouchStart = (e) => {
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      // Resume auto-scroll after a delay if no swipe occurred
      setTimeout(() => setIsPaused(false), 2000);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < services.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    // Resume auto-scroll after user interaction
    setTimeout(() => setIsPaused(false), 3000);
  };

  const goToSlide = (index) => {
    setIsPaused(true);
    setCurrentIndex(index);
    // Resume auto-scroll after clicking dot
    setTimeout(() => setIsPaused(false), 3000);
  };
    
  return (
    <div>

   
    <section className="hidden md:flex relative w-full min-h-screen  items-center justify-center overflow-hidden">

    <Image
      src="/images/Banner.jpg"
      alt="Luxury Apartment"
      fill
      className="object-cover object-center"
      priority
    />
  
    {/* overlay only for mobile */}
    <div className="absolute inset-0 bg-black/20 md:bg-transparent" />
  
    {/* MAIN BOX */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="
        relative z-10 lg:text-center text-center font-semibold text-white
        px-4 md:px-4 lg:px-8
        border border-white/10 backdrop-blur-sm bg-white/20 
        p-5 sm:p-6 md:p-5 lg:p-8  
  
        mx-auto
        mt-16  lg:mt-52
        
        w-[92%] sm:w-[96%] md:w-[90%] lg:w-[85%]
        max-w-[360px] sm:max-w-[550px] md:max-w-[770px] lg:max-w-[900px]
  
        max-h-[750px] sm:max-h-[550px] md:max-h-[430px] lg:max-h-[500px]
        rounded-md
      "
    >
  
      {/* HEADING */}
      <h1 className="text-xl sm:text-2xl mx-20 lg:mx-40  md:text-[27px] lg:text-[36px] mb-2 md:mb-3 lg:mb-4 leading-relaxed ">
      <span className="block">Welcome To Al Asmakh</span>
      <span className="block mt-2">Privilege Program Platform</span>
      </h1>
  
      {/* Line */}
      <div className="w-[90%] h-[0.2px]  bg-[#FFFFFF] mx-auto  lg:mx-0 my-4"></div>
  
      {/* DESCRIPTION */}
      <p
        className="mb-3 text-[10px] font-semibold text-center sm:text-[11px]  mx-2 lg:mx-20 md:text-[12px] lg:text-xs"
        
      >
      A secure and intuitive system designed to digitize membership, enhance user experience, 
      and connect with the AREDC ecosystem.
      </p>
  
      {/* BUTTONS */}
      <div className="hidden lg:flex text-center justify-center flex-wrap gap-2 lg:gap-12 mt-4  lg:mt-6">
  
        <button
          style={{ backgroundColor: "#001730", borderRadius: "5px", height: "35px" }}
          className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[160px] 
                     px-2 py-2 text-white text-[11px] md:text-[12px] lg:text-[13px]
                     shadow-lg transition-all duration-300"
        >
       SIGN IN
        </button>
  
        <button
          style={{  borderRadius: "5px", height: "35px" }}
          className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[160px] bg-white/30
                     px-2 py-2 text-white text-[11px] md:text-[12px] lg:text-[13px]
                     shadow-lg transition-all duration-300"
        >
          SIGN UP
        </button>
        
       
  
      </div>
     
      {/* <div className="p-4 bg-gray-400 rounded-md shadow-md gap-4 flex flex-wrap lg:hidden">

<button
  style={{ backgroundColor: "#001730", borderRadius: "5px", height: "35px" }}
  className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[160px]
             px-2 py-2 text-white text-[11px] md:text-[12px] lg:text-[13px]
             shadow-lg hover:bg-[#022d5e] transition-all duration-300"
>
  RENT
</button>

<button
  style={{ backgroundColor: "#001730", borderRadius: "5px", height: "35px" }}
  className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[160px]
             px-2 py-2 text-white text-[11px] md:text-[12px] lg:text-[13px]
             shadow-lg hover:bg-[#022d5e] transition-all duration-300"
>
  BUY
</button>

</div> */}

  
     
  
    </motion.div>
    
  </section>
  <section className="block lg:hidden relative w-full min-h-[70vh]  items-center justify-center overflow-hidden">

<Image
  src="/images/Banner.jpg"
  alt="Luxury Apartment"
  fill
  className="object-cover object-center"
  priority
/>

{/* overlay only for mobile */}
<div className="absolute inset-0 bg-black/20 md:bg-transparent" />

{/* MAIN BOX */}
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
  className="
    relative z-10 lg:text-center text-center font-semibold text-white
    px-4 md:px-4 lg:px-8
    border border-white/10 backdrop-blur-sm bg-white/20 
    p-5 sm:p-6 md:p-5 lg:p-8  

    mx-auto
    mt-[150px]  lg:mt-52
    
    w-[92%] sm:w-[96%] md:w-[90%] lg:w-[85%]
    max-w-[360px] sm:max-w-[550px] md:max-w-[770px] lg:max-w-[900px]

    max-h-[750px] sm:max-h-[550px] md:max-h-[430px] lg:max-h-[500px]
    rounded-md
  "
>

  {/* HEADING */}
  <h1 className="text-xl lg:text-2xl mx-4 lg:mx-40  md:text-[27px] lg:text-[36px] mb-2 md:mb-3 lg:mb-4 leading-relaxed ">
  <span className="block">Welcome To Al Asmakh</span>
  <span className="block mt-2">Privilege Program Platform</span>
  </h1>

  {/* Line */}
  <div className="w-[90%] h-[0.2px]  bg-[#FFFFFF] mx-auto  lg:mx-0 my-4"></div>

  {/* DESCRIPTION */}
  <p
    className="mb-3 text-[10px] font-semibold text-center sm:text-[11px]  mx-2 lg:mx-20 md:text-[12px] lg:text-xs"
    
  >
  A secure and intuitive system designed to digitize membership, enhance user experience, 
  and connect with the AREDC ecosystem.
  </p>

  {/* BUTTONS */}
  <div className="flex flex-col text-center justify-center items-center gap-2 lg:gap-3 mt-4 lg:mt-6">

  <button
    style={{ backgroundColor: "#001730", borderRadius: "5px", height: "35px" }}
    className="w-[150px] sm:w-[130px] md:w-[140px] lg:w-[160px] 
               px-2 py-2 text-white text-[11px] md:text-[12px] lg:text-[13px]
               shadow-lg transition-all duration-300"
  >
    SIGN IN
  </button>

  <button
    style={{ borderRadius: "5px", height: "35px" }}
    className="w-[150px] sm:w-[130px] md:w-[140px] lg:w-[160px] bg-white/30
               px-2 py-2 text-white text-[11px] md:text-[12px] lg:text-[13px]
               shadow-lg transition-all duration-300"
  >
    SIGN UP
  </button>

</div>

 
  {/* <div className="p-4 bg-gray-400 rounded-md shadow-md gap-4 flex flex-wrap lg:hidden">

<button
style={{ backgroundColor: "#001730", borderRadius: "5px", height: "35px" }}
className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[160px]
         px-2 py-2 text-white text-[11px] md:text-[12px] lg:text-[13px]
         shadow-lg hover:bg-[#022d5e] transition-all duration-300"
>
RENT
</button>

<button
style={{ backgroundColor: "#001730", borderRadius: "5px", height: "35px" }}
className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[160px]
         px-2 py-2 text-white text-[11px] md:text-[12px] lg:text-[13px]
         shadow-lg hover:bg-[#022d5e] transition-all duration-300"
>
BUY
</button>

</div> */}


 

</motion.div>

</section>
 
 <section className="w-full bg-[#F5F7FA] py-16">
      <div className=" lg:mx-14 mx-auto px-6 text-center">

        {/* TITLE */}
        <h2 className="text-[28px] md:text-[32px] font-semibold tracking-wide text-[#001730]">
          PRIVILEGE PROGRAM
        </h2>
        <div className="w-[30%] h-[0.2px]  bg-gray-300 mx-auto my-4"></div>
        {/* SUBTITLE */}
        <p className="mt-4 max-w-3xl mx-auto text-gray-600 leading-relaxed">
          A digital platform designed to reward tenants and staff with exclusive benefits,
          seamless membership management, and a connected community experience.
        </p>

        {/* Mobile Carousel - Only visible on mobile */}
        <div 
          className="block lg:hidden relative mt-12" 
          style={{ 
            overflow: "hidden",
            width: "100%",
            marginLeft: "-24px",
            marginRight: "-24px",
            paddingLeft: "4px",
            paddingRight: "4px",
          }}
        >
          <div
            ref={carouselRef}
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{ 
              height: "auto",
              minHeight: "280px",
              overflow: "visible",
              width: "100%",
              position: "relative",
            }}
          >
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(calc(50vw - 140px - ${currentIndex * 280}px))`,
                willChange: "transform",
              }}
            >
              {services.map((item, index) => {
                const isCenter = index === currentIndex;
                const offset = index - currentIndex;

                return (
                  <div
                    key={index}
                    className="flex-shrink-0"
                    style={{
                      width: "280px",
                      padding: "0 8px",
                      transform: isCenter
                        ? "translateY(0) scale(1)"
                        : `translateY(${20 + Math.abs(offset) * 5}px) scale(${0.9 - Math.abs(offset) * 0.05})`,
                      transition: "transform 0.3s ease-in-out",
                      zIndex: isCenter ? 10 : 5 - Math.abs(offset),
                      opacity: Math.abs(offset) > 1 ? 0.6 : 0.9,
                    }}
                  >
                    <div
                      className="bg-white p-4 rounded-md shadow-md flex flex-col items-center text-center hover:shadow-lg transition"
                      style={{
                        height: "100%",
                      }}
                    >
                      <img src={item.icon} alt={item.title} className="h-12 w-12 mb-4" />
                      <h3 className="text-[18px] font-semibold text-[#001730] mb-3">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2">
            {services.map((_, index) => (
              <div key={index} className="flex items-center">
                <button
                  onClick={() => (goToSlide(index))}
                  className={`
                    transition-all duration-300 flex items-center justify-center
                    ${index === currentIndex 
                      ? "w-5 h-5 border-2 border-[#001730] rounded-sm" 
                      : "w-3 h-3"
                    }
                  `}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <span
                    className={`
                      block
                      ${index === currentIndex 
                        ? "w-2.5 h-2.5 bg-[#001730] rounded-sm" 
                        : "w-3 h-3 bg-gray-400"
                      }
                    `}
                  ></span>
                </button>
                {/* {index < projects.length - 1 && (
                  <div className="w-px h-3 bg-gray-300 mx-2"></div>
                )} */}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Grid - Only visible on desktop */}
        <div className="hidden lg:grid grid-cols-5 gap-6 mt-12">
          {services.map((item, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-md shadow-md flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <img src={item.icon} alt={item.title} className="h-12 w-12 mb-4" />

              <h3 className="text-[18px] font-semibold text-[#001730] mb-3">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
    <section className="w-full bg-white py-20">
      {/* PARTNERS SECTION */}
      <div className="max-w-6xl mx-auto text-center px-6">
        <h2 className="text-[28px] md:text-[32px] text-[#001730] font-semibold tracking-[1px]">
          PRIVILEGE PARTNERS
        </h2>
        <div className="w-[30%] h-[0.2px]  bg-gray-300 mx-auto my-4"></div>
        <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-[15px] leading-relaxed">
          A digital platform designed to reward tenants and staff with exclusive benefits, 
          seamless membership management, and a connected community experience.
        </p>

        {/* PARTNER LOGOS */}
        <div className="flex flex-wrap justify-center items-center gap-12 mt-12">
          {partners.map((logo, i) => (
            <Image
              key={i}
              src={logo}
              alt="partner logo"
              width={180}
              height={100}
              className="object-contain opacity-90 hover:opacity-100 transition"
            />
          ))}
        </div>
      </div>

      {/* SIGN IN SECTION */}
      <div className="max-w-lg mx-auto text-center mt-24 px-6">
        <h3 className="text-[26px] md:text-[30px] font-semibold text-[#001730]">
          SIGN IN
        </h3>
        <div className="w-[30%] h-[0.2px]  bg-gray-300 mx-auto my-4"></div>
        <p className="text-gray-600 mt-3 text-[14.5px] leading-relaxed">
          Securely log in to your Privilege Program dashboard and manage your 
          profile with ease.
        </p>

        {/* SIGN IN BUTTON */}
        <button className="mt-8 w-full md:w-56 bg-[#001730] text-white py-3 rounded-md font-medium flex items-center justify-between px-6  mx-auto hover:bg-[#0d2340] transition">
          Sign In <FaArrowRight />
          
        </button>

        {/* SIGN UP LINK */}
        <p className="text-gray-500 text-sm mt-4">
          Don’t have an Account?{" "}
          <span className="text-[#001730] font-semibold cursor-pointer">
            Sign Up
          </span>
        </p>
        <div className="w-[50%] h-[0.5px]  bg-gray-300 mx-auto my-4"></div>
        {/* PARTNER LOGIN */}
        <p className="text-[#001730] font-semibold text-sm mt-2 cursor-pointer hover:text-[#001730] transition">
          Partner Log In
        </p>
      </div>
    </section>
</div>
  );
}
