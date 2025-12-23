"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Mic, MapPin, ArrowDown, Bed, Bath, Square, ArrowRight, Leaf, Home, Map as MapIcon, SlidersHorizontal } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import { FaTag, FaBook, FaFolder, FaCalendar } from "react-icons/fa";
import Link from "next/link";
import DreamPropertySection from "./DreamPropertySection";
export default function Buy() {
  const [viewMode, setViewMode] = useState("LIST"); // "LIST" or "MAP"
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


  const blogs = [
    {
      title: "Discover the Art of Living in Qatar",
      description: "Explore lifestyle stories, community highlights, and home inspirations that define modern living across Qatar.",
      image: "/Image.png",
    },
    {
      title: "Discover the Art of Living in Qatar",
      description: "Explore lifestyle stories, community highlights, and home inspirations that define modern living across Qatar.",
      image: "/Image.png",
    },
    {
      title: "Discover the Art of Living in Qatar",
      description: "Explore lifestyle stories, community highlights, and home inspirations that define modern living across Qatar.",
      image: "/Image.png",
    },
    {
      title: "Discover the Art of Living in Qatar",
      description: "Explore lifestyle stories, community highlights, and home inspirations that define modern living across Qatar.",
      image: "/Image.png",
    },
    {
      title: "Discover the Art of Living in Qatar",
      description: "Explore lifestyle stories, community highlights, and home inspirations that define modern living across Qatar.",
      image: "/Image.png",
    },
  ];

  return (
    <div>
      {/* ---------- HERO SECTION ---------- */}
      <section className="relative w-full min-h-[80vh] lg:min-h-[80vh] flex flex-col items-center justify-center overflow-visible">
        {/* Background Image */}
        <Image
          src="/rep_img/About.png"
          alt="City Skyline"
          fill
          className="object-cover"
          priority
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0" />

        {/* 🔍 Search Bar (Half on BG, Half outside) - First - Centered */}
        <div className="absolute left-1/2 bottom-20 lg:bottom-12 transform -translate-x-1/2 z-30 w-[70%] lg:w-[60%] hidden lg:block">
          <div className="border border-white/10 backdrop-blur-[10px] bg-white/30 rounded-md p-4 lg:p-6 shadow-lg">
            <p className="text-center font-semibold text-lg sm:text-base md:text-lg lg:text-xl text-[#001730]">Lets Learn More !</p>
          </div>
        </div>

        {/* Mobile Filters Button - Absolute positioned in hero section */}
        <div className="absolute left-1/2 bottom-[-45px] mb-4 transform -translate-x-1/2 z-20 w-[90%] px-4 md:hidden">
          <div ref={filtersRef} className="flex flex-col gap-3 bg-[#8C8C8C66] border border-white/20 p-3 px-10 rounded-md shadow-md">
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
              <div className="flex flex-col gap-3">
                {[
                  { label: "Type", icon: FaTag },
                  { label: "Topic", icon: FaBook },
                  { label: "Categories", icon: FaFolder },
                  { label: "Date", icon: FaCalendar },
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-[#0B1F3A] text-white px-4 py-3 rounded-md w-full shadow-lg hover:bg-[#001730] transition"
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon + Divider */}
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 sm:w-4 sm:h-4" />
                          <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                        </div>

                        {/* Label */}
                        <span className="text-xs sm:text-sm font-medium">{item.label}</span>
                      </div>

                      {/* Down Arrow */}
                      <ArrowDown size={16} className="text-white opacity-80 w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Filter Items - Second - Centered on image */}
        <div className="hidden lg:flex absolute w-full justify-center bottom-14 lg:bottom-[-32px] z-20">
          <div
            className="
      flex w-full border border-white/10 backdrop-blur-[10px] bg-white/20 lg:mx-10 p-4 rounded-md shadow-md gap-4 justify-center items-center
    "
          >
            {/* Filter Items */}
            {[
              { label: "Type", icon: FaTag },
              { label: "Topic", icon: FaBook },
              { label: "Categories", icon: FaFolder },
              { label: "Date", icon: FaCalendar },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#0B1F3A] text-white px-8 py-2 w-full max-w-[250px] rounded-md shadow-lg hover:bg-[#001730] transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon + Divider */}
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                    </div>

                    {/* Label */}
                    <span className="text-[13px]">{item.label}</span>
                  </div>

                  {/* Down Arrow */}
                  <ArrowDown size={16} className="opacity-80" />
                </div>
              );
            })}
          </div>
        </div>

      </section>

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
      {/* ---------- READY TO FIND SECTION ---------- */}


      {/* ---------- LIST AND MAP VIEW SECTION ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-8 md:px-10 lg:px-10 p-4 sm:p-6">
        {blogs.map((blog, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image Section with Overlapping Button and Text Overlay */}
            <div className="relative w-full h-80 lg:h-80">
              <Link href={`/BlogsDetails`}>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-fill cursor-pointer"
                />
              </Link>

              {/* EXPLORE Button */}
              <button className="absolute top-4 sm:top-8 left-3 sm:left-4 bg-[#001730] text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded flex items-center gap-2 hover:bg-[#1b3a70] transition z-10 shadow-md">
                <span>EXPLORE</span>
                <FaArrowRight size={10} className="sm:w-[12px] sm:h-[12px] sm:ml-6" />
              </button>

              {/* Text Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#001730]/50 backdrop-blur-sm p-4 sm:p-6 z-10">
                <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">
                  {blog.title}
                </h3>
                <p className="text-white text-xs sm:text-sm md:text-base leading-relaxed opacity-90">
                  {blog.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DreamPropertySection />
    </div>
  );
}
