"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import MotionCarousel from "./MotionCarousel";

export default function PrivilegeProgram() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  // Mount check and mobile detection for carousel
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      src="/services/3.png"
      alt="Luxury Marketing"
      width={48}
      height={48}
      className="object-contain"
    />
  );

  const ProjectDevelopmentIcon = () => (
    <Image
      src="/services/1.png"
      alt="Project Development"
      width={48}
      height={48}
      className="object-contain"
    />
  );

  const PropertyManagementIcon = () => (
    <Image
      src="/services/5.png"
      alt="Property Management"
      width={48}
      height={48}
      className="object-contain"
    />
  );

  const FacilitiesManagementIcon = () => (
    <Image
      src="/services/6.png"
      alt="Facilities Management"
      width={48}
      height={48}
      className="object-contain"
    />
  );

  const TransactionAdvisoryIcon = () => (
    <Image
      src="/services/7.png"
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

        <div className="lg:mt-16 lg:mb-16 mt-8 mb-8">
          <h1
            className="text-[#10284C] uppercase mb-2 md:mb-3 lg:mb-4 px-2 sm:px-4"
            style={{
              fontSize: "clamp(18px, 3.5vw, 23px)",
              whiteSpace: "nowrap"
            }}
          >
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

        {/* Motion Carousel - Mobile Only */}
        <div className="block lg:hidden relative w-full py-2 px-2 sm:px-4 ">
          {isMounted && isMobile ? (
            <MotionCarousel
              slides={services.map((item, index) => (
                <div
                  key={index}
                  style={{
                    borderRadius: "8px",
                    width: "100%",
                    height: "auto",
                    minHeight: "200px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                  className="bg-white shadow-lg p-6 text-center"
                >
                  <div className="flex justify-center items-center h-[60px] mb-4">
                    {item.icon}
                  </div>

                  <div>
                    <h3
                      style={{
                        color: "#2D3748",
                      }}
                      className="text-[16px] md:text-[16px]"
                    >
                      {item.title}
                    </h3>
                    <div className="w-[90%] h-[0.5px] bg-gray-300 mx-auto my-2"></div>
                    <p
                      style={{
                        color: "#4A5568",
                      }}
                      className="subheading p-0 leading-relaxed mb-0"
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
              options={{
                loop: true,
                align: "center",
                slidesToScroll: 1,
                dragFree: false,
              }}
            />
          ) : (
            <div className="flex flex-row flex-nowrap gap-4 justify-center items-stretch overflow-x-auto">
              {services.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[85%] sm:w-[75%]"
                  style={{
                    borderRadius: "8px",
                    width: "100%",
                    height: "auto",
                    minHeight: "280px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  <div className="bg-white shadow-lg p-6 text-center h-full">
                    <div className="flex justify-center items-center h-[60px] mb-4">
                      {item.icon}
                    </div>

                    <div>
                      <h3
                        style={{
                          color: "#2D3748",
                        }}
                        className="text-[16px] md:text-[16px]"
                      >
                        {item.title}
                      </h3>
                      <div className="w-[90%] h-[0.5px] bg-gray-300 mx-auto my-2"></div>
                      <p
                        style={{
                          color: "#4A5568",
                        }}
                        className="subheading p-0 leading-relaxed mb-0"
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                  transition-all duration-200 text-center
                  ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                  }
                `}
              >
                <div className="flex justify-center items-center h-[70px] mb-4 3xl:mb-5 4xl:mb-6 transform transition-transform duration-200 hover:scale-110">
                  {item.icon}
                </div>

                <h3
                  style={{ fontSize: "16px", color: "#2D3748" }}
                  className=" mb-3 3xl:mb-4 4xl:mb-5 transition-colors duration-200 hover:text-[#001730] text-[16px] md:text-[16px]"
                >
                  {item.title}
                </h3>
                <div className="w-[90%] h-[0.5px] bg-gray-300 mx-auto my-2 transition-all duration-200 group-hover:w-full"></div>
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
                  transition-all duration-200 text-center
                  ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                  }
                `}
              >
                <div className="flex justify-center items-center h-[70px] mb-4 3xl:mb-5 4xl:mb-6 transform transition-transform duration-200 hover:scale-110">
                  {item.icon}
                </div>

                <h3
                  style={{ fontSize: "16px", color: "#2D3748" }}
                  className=" mb-3 3xl:mb-4 4xl:mb-5 transition-colors duration-200 hover:text-[#001730] text-[16px] md:text-[16px]"
                >
                  {item.title}
                </h3>
                <div className="w-[90%] h-[0.5px] bg-gray-300 mx-auto my-2 transition-all duration-200 group-hover:w-full"></div>
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
