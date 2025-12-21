"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Mic, MapPin, ArrowDown, SlidersHorizontal, Tag, Star, Globe } from "lucide-react";
import { Phone, Mail } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import DreamPropertySection from "./DreamPropertySection";

export default function MeetOurAgents() {
  const [showFilters, setShowFilters] = useState(false); // Toggle for mobile filters
  const filtersRef = useRef(null); // Ref for filter container

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters && filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  const agents = [
    {
      name: "Sarah Johnson",
      title: "Luxury Property Specialist",
      properties: 45,
      clients: 127,
      specialties: "West Bay, Commercial, Penthouse",
      languages: "English, Spanish, Arabic",
      image: "/div.png", // replace with your actual image path
    },
    {
      name: "Mohammed Al-Thani",
      title: "Luxury Property Specialist",
      properties: 45,
      clients: 127,
      specialties: "West Bay, Commercial, Penthouse",
      languages: "English, Spanish, Arabic",
      image: "/div (2).png", // replace with your actual image path
    },
  ];
  return (
    <div>
      {/* ---------- HERO SECTION ---------- */}
      <section className="relative w-full min-h-[80vh] lg:min-h-[80vh] flex flex-col items-center justify-center overflow-visible">
        {/* Background Image */}
        <Image
          src="/WhatsApp Image 2025-11-08 at 10.47.12 PM.jpeg"
          alt="City Skyline"
          fill
          className="object-cover"
          priority
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 " />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-4 md:px-8 mt-10 md:mt-36">
          {/* Transparent Box for Heading */}
          <div className="glass-effect rounded-md px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10 shadow-lg max-w-[900px] mx-auto w-[90%] sm:w-[80%]">
            <h1 className="heading text-white font-semibold mb-2">
              MEET OUR EXPERT AGENTS
            </h1>
            <div className="w-[40%]  lg:w-[40%] h-[0.5px] mt-2 bg-gray-300 mb-3 md:mb-4 mx-auto"></div>
            <p className="subheading text-white/80 font-medium">
              Our experienced team of property professionals is here to guide
              you through every step of your real estate journey.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-6 lg:mt-4 w-[90%] sm:w-[80%] md:w-auto px-4">
            {[
              { value: "50+", label: "Expert Agents" },
              { value: "1,200+", label: "Properties Sold" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "15+", label: "Years Experience" },
            ].map((item, index) => (
              <div
                key={index}
                className="glass-effect flex flex-col items-center rounded-md p-3 sm:p-4 md:p-6 md:px-14 text-white h-28 sm:h-32 md:h-auto"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1">
                  {item.value}
                </h2>
                <div className="w-[60%] sm:w-[70%] md:w-[60%] lg:w-[90%] h-[0.5px] bg-gray-300 my-2 sm:my-3 md:mb-4 mx-auto"></div>
                <p className="subheading text-white/70 text-center">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>



        {/* Desktop Filter Items - Moved to bottom of hero */}
        <div className="hidden lg:flex absolute w-full justify-center bottom-14 lg:bottom-[-32px] z-20">
          <div className="flex w-full border border-white/10 backdrop-blur-[10px] bg-white/20 lg:mx-10 p-4 rounded-md shadow-md 
                  gap-4 justify-center items-center">
            {/* Filter Items */}
            {["Location", "Specialities", "Reviews", "Languages"].map((label, index) => {
              // Get appropriate icon for each label
              const getIcon = () => {
                switch (label) {
                  case "Location":
                    return <MapPin size={16} />;
                  case "Specialities":
                    return <Tag size={16} />;
                  case "Reviews":
                    return <Star size={16} />;
                  case "Languages":
                    return <Globe size={16} />;
                  default:
                    return <MapPin size={16} />;
                }
              };

              return (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#0B1F3A] text-white px-8 py-2 w-full max-w-[250px]
                       rounded-md shadow-lg hover:bg-[#001730] transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon + Divider */}
                    <div className="flex items-center gap-2">
                      {getIcon()}
                      <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                    </div>

                    {/* Label */}
                    <span className="text-[13px]">{label}</span>
                  </div>

                  {/* Down Arrow */}
                  <ArrowDown size={16} className="opacity-80" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Filters Button - Absolute positioned in hero section */}
        <div className="absolute left-1/2 bottom-[-45px] mb-4 transform -translate-x-1/2 z-20 w-[90%] px-4 md:hidden">
          <div ref={filtersRef} className="glass-effect flex flex-col gap-3 p-3 px-10 rounded-md shadow-md">
            {/* Single Filters Button for Mobile */}
            <div
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between bg-[#0B1F3A] text-white px-4 py-3 rounded-md shadow-lg hover:bg-[#001730] transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {/* Filter Icon */}
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} />
                  <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                </div>
                {/* Label */}
                <span className="text-sm font-medium">Filters</span>
              </div>
              {/* Down Arrow - Rotates when open */}
              <ArrowDown
                size={16}
                className={`text-white opacity-80 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
              />
            </div>

            {/* Filter Items - Shown when button is clicked */}
            {showFilters && (
              <div className="flex flex-col bottom-20 gap-3">
                {["Location", "Specialities", "Reviews", "Languages"].map((label, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#0B1F3A] text-white px-4 py-3 rounded-md w-full shadow-lg hover:bg-[#001730] transition"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon + Divider */}
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                      </div>

                      {/* Label */}
                      <span className="text-sm font-medium">{label}</span>
                    </div>

                    {/* Down Arrow */}
                    <ArrowDown size={16} className="text-white opacity-80" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- LIST AND MAP VIEW SECTION ---------- */}
      <div className="hidden lg:block  ">

        {/* Header Bar */}
        <div className="bg-white border-gray-200 px-2  lg:px-4">
          <div className="hidden lg:flex max-w-full mb-2 bg-gray-50    mt-24 mx-auto items-center gap-4">

            {/* Showing Count (Left) */}
            <div className="text-gray-400 text-sm font-medium whitespace-nowrap">
              Showing 10 of 50
            </div>

            {/* CENTER LINE */}
            <div className="flex-1 h-[0.5px] bg-gray-300"></div>

            {/* LIST / MAP Buttons (Right) */}
            <div className="flex items-center gap-2">


              {/* Divider */}
             
            </div>

          </div>
        </div>
      </div>

      {/* ---------- AGENTS SECTION ---------- */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-10">
        <div className="container mx-auto px-4 sm:px-6 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {agents.concat(agents).map((agent, index) => (
            <div
              key={index}
              className="shadow-lg rounded-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 bg-gray-200"
            >
              {/* Combined Header Section (Image + Name + Title) */}
              <div className="shadow-md bg-gray-100 rounded-md overflow-hidden mx-2 sm:mx-4 mt-2 sm:mt-4">
                {/* Profile Image */}
                <div className="relative w-full h-80">
                  <Image
                    src={agent.image}
                    alt={agent.title}
                    fill
                    className="object-fill"
                  />

                  {/* Name + Title - Absolute positioned over image */}
                  <div className="absolute text-center backdrop-blur-md bg-gradient-to-b from-gray-100/20 to-gray-100 shadow-lg bottom-0 left-0 right-0 p-3 lg:p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-[#001730]">
                      {agent.name}
                    </h3>
                    <p className="text-[#001730] text-xs sm:text-sm">{agent.title}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center mt-3 sm:mt-4 px-3 sm:px-4 pb-4 sm:pb-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 lg:gap-2 mb-3 sm:mb-4">
                  {/* Box 1 */}
                  <div className="glass-effect shadow-md p-2 px-4 sm:px-6 md:px-8 rounded-md ">
                    <p className="font-semibold text-[#001730] text-base sm:text-lg">
                      {agent.properties}
                    </p>
                    <div className="h-[0.5px] bg-gray-300 my-1 sm:my-2 md:my-2 mx-auto"></div>
                    <p className="subheading text-[#001730]">Properties</p>
                  </div>

                  {/* Box 2 */}
                  <div className="glass-effect shadow-md p-2 px-4 sm:px-6 md:px-4 rounded-md ">
                    <p className="font-semibold text-[#001730] text-base sm:text-lg">
                      {agent.clients}
                    </p>
                    <div className="h-[0.5px] bg-gray-300 my-1 sm:my-2 md:my-2 "></div>
                    <p className="subheading text-[#001730]">Clients Served</p>
                  </div>
                </div>


                {/* Info */}
                <div className="glass-effect text-left text-xs sm:text-sm mb-2 shadow-md p-2 rounded-md">
                  <p className="text-gray-400">Specialities</p>
                  <p className="subheading text-gray-700 font-medium text-center">{agent.specialties}</p>
                </div>

                <div className="glass-effect text-left text-xs sm:text-sm mb-3 sm:mb-4 shadow-md p-2 rounded-md">
                  <p className="text-gray-400">Languages</p>
                  <p className="subheading text-gray-700 font-medium text-center">{agent.languages}</p>
                </div>

                {/* Buttons */}
                <div className="flex flex-row gap-2">
                <button
  className="flex-1 flex items-center justify-between
    p-2 px-4 bg-[#001730] text-white py-2 rounded-md
    text-[12px] sm:text-[12px] font-medium
    hover:bg-[#0d1f3a] transition"
>
  <span>Call Agent</span>
  <FaArrowRight size={12} className="sm:w-[14px] sm:h-[14px]" />
</button>

<button
  className="flex-1 flex items-center justify-between
    p-2 px-4 bg-[#001730] text-white rounded-md
    text-[12px] sm:text-[12px] font-medium
    hover:bg-[#0d1f3a] transition"
>
  <span>Send Email</span>
  <FaArrowRight size={12} className="sm:w-[14px] sm:h-[14px]" />
</button>

                </div>
              </div>
            </div>
          ))}

        </div>
      </section>
      <DreamPropertySection />
    </div>
  );
}
