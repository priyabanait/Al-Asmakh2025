"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Search, Mic, MapPin, ArrowDown, Bed, Bath, Square, ArrowRight, Leaf, Home, Map as MapIcon } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";

import DreamPropertySection from "./DreamPropertySection";
export default function Rent() {
  const [viewMode, setViewMode] = useState("LIST"); // "LIST" or "MAP"

  const properties = [
    {
      title: "Floresta Tower Floresta Tower Les Maisons Blanches",
      location: "The Pearl Island, Doha",
      price: "280,000 QAR",
      beds: 4,
      baths: 2,
      area: 450,
      image: "/div.property-thumbnail-wrapper.png",
    },
    {
      title: "Floresta Tower Floresta Tower Les Maisons Blanches",
      location: "The Pearl Island, Doha",
      price: "280,000 QAR",
      beds: 4,
      baths: 2,
      area: 450,
      image: "/div.property-thumbnail-wrapper.png",
    },
    {
      title: "Floresta Tower Floresta Tower Les Maisons Blanches",
      location: "The Pearl Island, Doha",
      price: "280,000 QAR",
      beds: 4,
      baths: 2,
      area: 450,
      image: "/div.property-thumbnail-wrapper.png",
    },
    {
      title: "Floresta Tower Floresta Tower Les Maisons Blanches",
      location: "The Pearl Island, Doha",
      price: "280,000 QAR",
      beds: 4,
      baths: 2,
      area: 450,
      image: "/div.property-thumbnail-wrapper.png",
    },
  ];

  const scrollRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    const checkOverflow = () => {
      if (el && el.scrollWidth > el.clientWidth) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <div>
      {/* ---------- HERO SECTION ---------- */}
      <section className="relative w-full bg-gray-200 min-h-screen flex items-center justify-center overflow-visible">
        {/* Background Image - Full Background */}
        <Image
          src="/rep_img/sales.png"
          alt="City Skyline"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay (optional if you want to dim background) */}
        <div className="absolute inset-0 " />

        {/* Left Aligned Box */}
        <div className="absolute left-4 md:left-8 lg:left-12 top-1/2 transform -translate-y-1/2 z-20 w-[90%] md:w-[60%] lg:w-[60%]">
          <div className="glass-effect text-center rounded-lg shadow-lg p-4 sm:p-6 md:p-10 lg:text-left w-full max-w-5xl mx-auto">

            {/* Title */}
            <h2 className="heading px-10 lg:px-0 font-semibold text-[#001730] mb-2 sm:mb-3 md:mb-4 lg:mr-40">
              EXPERT REAL ESTATE SALES
            </h2>
            {/* Divider */}
            <div className="w-[80%] h-[0.5px] bg-gray-300 my-3 sm:my-4 lg:mr-40"></div>
            {/* Subtitle */}
            <p className="subheading mb-10 font-semibold text-[#001730] lg:mr-40">
              Whether buying or selling, our experienced team provides personalized
              service and market expertise to achieve your real estate goals.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 
                gap-y-12 gap-x-14 
                sm:gap-y-14 sm:gap-x-16
                md:gap-y-16 md:gap-x-20
                lg:gap-y-20 lg:gap-x-24
                lg:mr-[30%] 
                text-center">

              {/* Card 1 */}
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl lg:text-2xl font-bold text-[#001730]">500+</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Properties Sold</p>
              </div>

              {/* Card 2 */}
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">30</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Days Average Sale</p>
              </div>

              {/* Card 3 */}
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">98%</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Client Satisfaction</p>
              </div>

              {/* Card 4 */}
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">$2.5M</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Average Sale Price</p>
              </div>

            </div>
          </div>


          {/* Contact Team Button - Below the box */}
          <div className="w-full max-w-5xl mx-auto mt-4 lg:mt-6">

            <button className="bg-[#001730] w-[24%] text-white px-6 py-4 rounded-md font-medium text-[12px] lg:text-[12px] hover:bg-[#002d52] transition-all duration-300 flex items-center justify-between shadow-lg">
              <span>Contact Team</span>
              <FaArrowRight size={16} />
            </button>

          </div>
        </div>

      </section>


      <div className="relative w-full h-screen py-6 lg:py-8 px-4 md:px-8 lg:px-16 xl:px-18 2xl:px-20 3xl:px-24 4xl:px-32 5xl:px-40 overflow-hidden">
        <div className="max-w-[1500px] mx-auto">
          <h2
            id="my-heading"
            className="text-2xl text-[#001730] uppercase mb-2  lg:mb-2 text-center"
          >
            FEATURED PROPERTIES
          </h2>
          <div className="flex-1 h-[0.5px] bg-gray-300 my-2 lg:my-2
          mx-auto w-[60%] md:w-[40%] lg:w-[20%] "></div>
          <p
            id="desc"
            className="
    text-gray-500 
    mx-auto text-center px-2 md:px-4 lg:px-0

    max-w-xs md:max-w-xl lg:max-w-2xl 
    xl:max-w-3xl 2xl:max-w-4xl 
    3xl:max-w-5xl 
    4xl:max-w-6xl 
    5xl:max-w-7xl 

    mb-6 md:mb-8 lg:mb-12 xl:mb-12 2xl:mb-14 3xl:mb-16 4xl:mb-20 5xl:mb-24
 
  " style={{ fontSize: "clamp(13px, 0.8vw, 17px)" }}
          >
            From luxury residences to commercial developments, we deliver trusted
            services that turn your
            <br />
            real estate goals into reality.
          </p>

          <div
            ref={scrollRef}
            className="flex gap-3 md:gap-4 lg:gap-6 xl:gap-6 2xl:gap-7 3xl:gap-8 4xl:gap-10 5xl:gap-12 overflow-x-auto no-scrollbar scroll-smooth pb-4 lg:pb-6 "
          >
            {properties.map((property, index) => (
              <div
                key={index}
                className={`
          w-[250px]  lg:w-[350px]
          p-4
          bg-[#E9E9E9] border border-gray-200 
          rounded-md overflow-hidden shadow-md 
          hover:shadow-xl transition-shadow duration-300 
          flex-shrink-0
          ${index === 0 || index === properties.length - 1
                    ? 'scale-95'
                    : 'scale-100'
                  }
        `}
              >
                {/* Image Section */}
                <div className="relative w-full h-[180px]  xl:h-[200px] ">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-fill rounded-md"
                  />
                </div>

                {/* Property Info */}
                <div className="py-2">
                  <h3 className="font-semibold text-[#001730] text-sm lg:text-lg mb-1 leading-snug line-clamp-2">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center text-[#001730] text-sm mb-3">
                    <MapPin size={12} className="mr-2" />
                    <span
                      className="line-clamp-1 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl"
                      style={{ fontSize: "clamp(13px, 0.8vw, 17px)" }}
                    >
                      {property.location}
                    </span>
                  </div>


                  {/* Bed/Bath/Area Info */}
                  <div className="grid grid-cols-3 gap-2 lg:gap-3 text-[#001730] text-xs lg:text-sm mb-3 lg:mb-4">

                    <div className="flex items-center justify-center gap-1 bg-[#F5F5F5] shadow p-1.5 lg:p-2 rounded-md">
                      <Image
                        src="/Icon (1).png"
                        alt="Beds"
                        width={14}
                        height={14}
                        className="lg:w-[18px] lg:h-[18px]"
                      />
                      <span>{property.beds}</span>
                    </div>

                    <div className="flex items-center justify-center gap-1 bg-[#F5F5F5] shadow p-1.5 lg:p-2 rounded-md">
                      <Image
                        src="/Icon.png"
                        alt="Baths"
                        width={14}
                        height={14}
                        className="lg:w-[18px] lg:h-[18px]"
                      />
                      <span>{property.baths}</span>
                    </div>

                    <div className="flex items-center justify-center gap-1 bg-[#F5F5F5] shadow p-1.5 lg:p-2 rounded-md">
                      <Image
                        src="/Icon (2).png"
                        alt="Area"
                        width={14}
                        height={14}
                        className="lg:w-[18px] lg:h-[18px]"
                      />
                      <span>{property.area}</span>
                    </div>

                  </div>


                  <div
                    className="w-[100%]  h-[0.5px] bg-gray-300  my-3 "
                  ></div>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-base md:text-base lg:text-base xl:text-lg 2xl:text-lg 3xl:text-xl 4xl:text-2xl 5xl:text-3xl font-semibold text-[#001730]">
                      {property.price}
                    </p>

                    <button className="bg-[#001730] text-white text-[12px] px-3 md:px-4 lg:px-5 xl:px-5 2xl:px-6 3xl:px-7 4xl:px-8 5xl:px-10 py-1.5  lg:py-2  rounded-md flex items-center justify-between shadow-lg transition-all duration-300 hover:bg-[#002d52]">
                      <Link
                        href="/propertydetails"
                        className="flex items-center gap-2 w-full"
                      >
                        <span>Details</span>
                        <FaArrowRight
                          size={12}
                          className="w-3 h-3  lg:w-[16px]  ml-10"
                        />
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center  ">
          <button className="bg-[#001730] text-white text-[12px] px-4 md:px-4 lg:px-5 xl:px-5 2xl:px-6 3xl:px-7 4xl:px-8 5xl:px-10 py-1.5 md:py-1.5 lg:py-2 xl:py-2 2xl:py-3 3xl:py-3 4xl:py-4 5xl:py-5 rounded flex items-center justify-center gap-2 transition hover:bg-[#1b3a70]">
            <span>View All</span>
            <FaArrowRight
              size={12}
              className="w-3 h-3  lg:w-[12px] lg:h-[12px] ml-20"
            />
          </button>
        </div>

        {/* Scroll Button */}
        {showScrollButton && (
          <button
            onClick={scrollRight}
            className="absolute right-2 md:right-3 lg:right-4 xl:right-5 2xl:right-6 3xl:right-8 4xl:right-10 5xl:right-12 top-1/2 transform -translate-y-1/2 
                     bg-white border border-gray-300 rounded-md p-2 md:p-2.5 lg:p-3 xl:p-3.5 2xl:p-4 3xl:p-5 4xl:p-6 5xl:p-7 px-4 md:px-5 lg:px-6 xl:px-7 2xl:px-8 3xl:px-10 4xl:px-12 5xl:px-14
                     shadow-md z-10 hover:shadow-lg transition"
          >
            <FaArrowRight className="text-[#001730] w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10 4xl:w-12 4xl:h-12 5xl:w-14 5xl:h-14" />
          </button>
        )}
      </div>



      {/* ---------- READY TO FIND SECTION ---------- */}


      {/* ---------- LIST AND MAP VIEW SECTION ---------- */}
      <section className="w-full  py-16 px-6 md:px-20">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl text-[#001730]  mb-2">
            COMPREHENSIVE SALES SERVICES
          </h2>
          <div className="w-[30%] h-[0.5px] bg-gray-300  my-2  mx-auto md:my-3"></div>
          <p className="subheading text-gray-500">
            From initial consultation to closing, we provide full-service real estate sales support.
          </p>
        </div>

        {/* Service Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="glass-effect rounded-md p-6 bg-[#EEEEEE] shadow-md transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Market Analysis</h3>
            <p className="subheading text-gray-600">
              Comprehensive market research and competitive analysis to price your property optimally.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-effect rounded-md p-6  bg-[#EEEEEE] shadow-md transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Property Valuation</h3>
            <p className="subheading text-gray-600">
              Professional property appraisal and valuation services using latest market data.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-effect rounded-md p-6  bg-[#EEEEEE] shadow-md transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Expert Negotiation</h3>
            <p className="subheading text-gray-600">
              Skilled negotiation to secure the best possible terms for buyers and sellers.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-effect rounded-md p-6  bg-[#EEEEEE] shadow-md transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Transaction Management</h3>
            <p className="subheading text-gray-600">
              Complete transaction coordination from contract to closing with legal support.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-effect rounded-md p-6  bg-[#EEEEEE] shadow-md transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Buyer Matching</h3>
            <p className="subheading text-gray-600">
              Extensive network and marketing to connect sellers with qualified buyers.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glass-effect rounded-md p-6 shadow-md bg-[#EEEEEE]  transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Closing Support</h3>
            <p className="subheading text-gray-600">
              Full support through the closing process ensuring smooth transactions.
            </p>
          </div>
        </div>
      </section>


      <DreamPropertySection />

    </div>
  );
}

