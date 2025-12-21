"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function PrivilegeProgram() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  // Image Icon Components
  const LeasingIcon = () => (
    <Image
      src="/1_Icons Used_Leasing.png"
      alt="Leasing"
      width={35}
      height={35}
      className="object-contain"
    />
  );

  const SalesIcon = () => (
    <Image
      src="/2_Icons Used_Sales.png"
      alt="Sales"
      width={48}
      height={48}
      className="object-contain text-[#001730]"
      style={{ color: '#10284C' }}
    />
  );

  const LuxuryMarketingIcon = () => (
    <Image
      src="/4_Icons Used_Luxury Markt 1.png"
      alt="Luxury Marketing"
      width={48}
      height={48}
      className="object-contain"
    />
  );

  const ProjectDevelopmentIcon = () => (
    <Image
      src="/3_Icons Used_Project Dvt 1.png"
      alt="Project Development"
      width={48}
      height={48}
      className="object-contain"
    />
  );

  const PropertyManagementIcon = () => (
    <Image
      src="/5_Icons Used_Property Mgt 1.png"
      alt="Property Management"
      width={48}
      height={48}
      className="object-contain"
    />
  );

  const FacilitiesManagementIcon = () => (
    <Image
      src="/6_Icons Used_Facility Mgt 1.png"
      alt="Facilities Management"
      width={48}
      height={48}
      className="object-contain"
    />
  );

  const TransactionAdvisoryIcon = () => (
    <Image
      src="/7_Icons Used_Adisory 1.png"
      alt="Transaction Advisory"
      width={48}
      height={48}
      className="object-contain"
    />
  );

  const services = [
    {
      icon: <LeasingIcon />,
      title: "Leasing",
      description: "Premium solutions for residential and commercial properties",
    },
    {
      icon: <SalesIcon />,
      title: "Sales",
      description: "Expert property sales with market-leading results",
    },
    {
      icon: <LuxuryMarketingIcon />,
      title: "Luxury Marketing",
      description: "Sophisticated marketing for high-end properties",
    },
    {
      icon: <ProjectDevelopmentIcon />,
      title: "Project Development",
      description: "Redefining luxury in residential, commercial, and mixed-use.",
    },
    {
      icon: <PropertyManagementIcon />,
      title: "Property Management",
      description: "Comprehensive property management solutions",
    },
    {
      icon: <FacilitiesManagementIcon />,
      title: "Facilities Management",
      description: "Professional management and maintenance services",
    },
    {
      icon: <TransactionAdvisoryIcon />,
      title: "Transaction Advisory",
      description: "Strategic advisory services for complex real estate transactions",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

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
    <section
      ref={sectionRef}
      style={{
        backgroundImage: "url('/images/BG_Form.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflowX: "hidden",
      }}
      className="relative bg-gray-100  px-4  lg:px-8 3xl:px-12 4xl:px-16"
    >
      <div className="container-custom text-center lg:mb-20 mb-4">

       <div className="lg:mt-16 lg:mb-16 mt-20 mb-8">
        <h1 className="text-sm sm:text-2xl text-[#10284C]  mx-20 text-uppercase lg:mx-0 text-uppercase   md:text-[23px] lg:text-[23px] mb-2 md:mb-3 lg:mb-4 ">
          HOW CAN WE HELP ?

        </h1>


        <div
          className={`w-32 lg:w-40  mt-2 3xl:mt-5 4xl:mt-6 h-[0.5px] bg-gray-300 mx-auto mb-4 3xl:mb-8 4xl:mb-10 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
        ></div>



        <p
          style={{ fontSize: "clamp(13px, 0.8vw, 17px)", color: "#919191" }}

          className="mb-7"

        >

          Real Estate Services for Residents, Owners, and Partners

        </p></div>

        {/* Mobile Carousel - Only visible on mobile */}
        <div
          className="block lg:hidden relative"
          style={{
            overflow: "hidden",
            width: "100%",
            marginLeft: "-16px",
            marginRight: "-16px",
            paddingLeft: "16px",
            paddingRight: "16px",
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
              minHeight: "320px",
              overflow: "visible",
              width: "100%",
              position: "relative",
            }}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(calc(50vw - 125px - ${currentIndex * 266}px))`,
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
                      width: "250px",
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
                      style={{
                        borderRadius: "8px",
                        width: "100%",
                        height: "auto",
                        minHeight: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                      }}
                      className={`
                        bg-white shadow-sm p-6 text-center
                        ${isCenter ? "shadow-lg" : "shadow-sm"}
                        transition-all duration-500 ease-out
                        ${isCenter ? "hover:scale-105" : ""}
                      `}
                    >
                      <div className={`flex justify-center items-center h-[60px] mb-4 transition-transform duration-300 ${isCenter ? "hover:scale-110" : ""}`}>
                        {item.icon}
                      </div>

                      <div>
                        <h3
                          style={{
                            // fontSize: "clamp(16px, 4vw, 20px)",
                            color: "#2D3748",
                          }}
                          className=" text-[16px] md:text-[16px]"
                        >
                          {item.title}
                        </h3>
                        <div className="w-[90%] h-[0.5px]  bg-gray-300 mx-auto my-2 "></div>
                        <p
                          style={{
                            color: "#4A5568",

                          }}
                          // id="desc"

                          className=" subheading p-0 leading-relaxed mb-0 "
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 hover:scale-125 ${index === currentIndex
                  ? "w-2 h-2 bg-gray-800 scale-125"
                  : "w-2 h-2 border border-gray-800 bg-transparent hover:bg-gray-400"
                  }`}
                style={{
                  borderRadius: "2px",
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid - Hidden on mobile */}
        <div className="hidden lg:block">
          {/* Top Row - 3 blocks */}
          <div
            className="
              grid grid-cols-1 lg:grid-cols-3
              gap-6 3xl:gap-8 4xl:gap-10
              mb-6 3xl:mb-8 4xl:mb-10 px-40
            "
          >
            {services.slice(0, 3).map((item, index) => (
              <div
                key={index}
                style={{
                  borderRadius: "8px",
                  width: "100%",
                  transitionDelay: `${400 + index * 100}ms`,
                }}
                className={`
                  bg-white shadow-sm p-6 3xl:p-8 4xl:p-10
                  hover:shadow-lg hover:scale-105 hover:-translate-y-2
                  transition-all duration-500 text-center
                  ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                  }
                `}
              >
                <div className="flex justify-center items-center h-[70px] mb-4 3xl:mb-5 4xl:mb-6 transform transition-transform duration-300 hover:scale-110">
                  {item.icon}
                </div>

                <h3
                  style={{ fontSize: "16px", color: "#2D3748" }}
                  className=" mb-3 3xl:mb-4 4xl:mb-5 transition-colors duration-300 hover:text-[#001730] text-[16px] md:text-[16px]"
                >
                  {item.title}
                </h3>
                <div className="w-[90%] h-[0.5px] bg-gray-300 mx-auto my-2 transition-all duration-300 group-hover:w-full"></div>
                <p
                  style={{ color: "#4A5568", fontSize: "clamp(13px, 0.8vw, 17px)" }}
                  className="p-0 leading-relaxed mb-0  "
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Row - 4 blocks */}
          <div
            className="
              grid grid-cols-1  lg:grid-cols-4
              gap-6 3xl:gap-8 4xl:gap-10
            "
          >
            {services.slice(3, 7).map((item, index) => (
              <div
                key={index + 3}
                style={{
                  borderRadius: "8px",
                  width: "100%",
                  transitionDelay: `${700 + index * 100}ms`,
                }}
                className={`
                  bg-white shadow-sm p-6 3xl:p-8 4xl:p-10
                  hover:shadow-lg hover:scale-105 hover:-translate-y-2
                  transition-all duration-500 text-center
                  ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                  }
                `}
              >
                <div className="flex justify-center items-center h-[70px] mb-4 3xl:mb-5 4xl:mb-6 transform transition-transform duration-300 hover:scale-110">
                  {item.icon}
                </div>

                <h3
                  style={{ fontSize: "16px", color: "#2D3748" }}
                  className=" mb-3 3xl:mb-4 4xl:mb-5 transition-colors duration-300 hover:text-[#001730] text-[16px] md:text-[16px]"
                >
                  {item.title}
                </h3>
                <div className="w-[90%] h-[0.5px] bg-gray-300 mx-auto my-2 transition-all duration-300 group-hover:w-full"></div>
                <p
                  style={{ fontSize: "clamp(13px, 0.8vw, 17px)", color: "#4A5568" }}
                  className="p-0 leading-relaxed mb-0 "
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Transaction Advisory - Below carousel */}
        {/* <div className="block lg:hidden mt-8">
          <div
            style={{ borderRadius: "8px", width: "100%", maxWidth: "320px", margin: "0 auto" }}
            className="
              bg-white shadow-sm p-6 text-center
            "
          >
            <div className="flex justify-center items-center h-[60px] mb-4">
              {transactionAdvisory.icon}
            </div>

            <h3
              style={{
                fontSize: "clamp(16px, 4vw, 20px)",
                color: "#2D3748",
              }}
              className="font-semibold mb-3"
            >
              {transactionAdvisory.title}
            </h3>

            <p
              style={{
                fontSize: "clamp(12px, 3.5vw, 15px)",
                color: "#4A5568",
              }}
              className="p-0 leading-relaxed mb-0"
            >
              {transactionAdvisory.description}
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
}
