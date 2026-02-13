"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Mic, MapPin, ArrowDown, Bed, Bath, Square, ArrowRight, Leaf, Home, Map as MapIcon, SlidersHorizontal } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import { FaTag, FaBook, FaFolder, FaCalendar } from "react-icons/fa";
import Link from "next/link";
import DreamPropertySection from "./DreamPropertySection";
import { useBlogs } from "../hooks/useBlogs";

export default function Buy() {
  const [viewMode, setViewMode] = useState("LIST"); // "LIST" or "MAP"
  const [showFilters, setShowFilters] = useState(false); // Toggle for mobile filters
  const filtersRef = useRef(null); // Ref for filter container
  
  // Use React Query hook for blogs - automatically cached and fast!
  // React Query checks cache → IF data exists & fresh → return instantly (0ms)
  // IF stale → call API → API checks Redis → Redis hit → return in <10ms
  const { data: blogsData, isLoading: blogsLoading, error: blogsError } = useBlogs({
    page: 1,
    limit: 50,
    publishStatus: 'Published',
  });

  // Extract blogs from the data
  const blogs = blogsData?.blogs || [];

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
            {!blogsLoading && !blogsError ? `Showing ${blogs.length} ${blogs.length === 1 ? 'blog/article' : 'blogs/articles'}` : 'Loading...'}
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
      {/* Loading State */}
      {blogsLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-[#001730] text-lg">Loading blogs and articles...</div>
        </div>
      )}

      {/* Error State */}
      {blogsError && !blogsLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-red-600 text-lg">Error loading blogs: {blogsError}</div>
        </div>
      )}

      {/* No Blogs State */}
      {!blogsLoading && !blogsError && blogs.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500 text-lg">No blogs or articles available at the moment.</div>
        </div>
      )}

      {/* Blogs Grid */}
      {!blogsLoading && !blogsError && blogs.length > 0 && (
        <div className="mt-10 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-8 md:px-10 lg:px-10 p-4 sm:p-6">
          {blogs.map((blog, i) => (
            <div
              key={blog.id || i}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image Section with Overlapping Button and Text Overlay */}
              <div className="relative w-full h-80 lg:h-80">
                <Link href={blog.slug ? `/blog/${blog.slug}` : `/blog/${blog.id}`}>
                  <Image
                    src={blog.image || '/Image.png'}
                    alt={blog.title}
                    fill
                    className="object-cover cursor-pointer"
                    unoptimized={blog.image && blog.image.startsWith('http')}
                    onError={(e) => {
                      e.target.src = '/Image.png';
                    }}
                  />
                </Link>

                {/* EXPLORE Button */}
                <Link href={blog.slug ? `/blog/${blog.slug}` : `/blog/${blog.id}`}>
                  <button className="absolute top-4 sm:top-8 left-3 sm:left-4 bg-[#001730] text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded flex items-center gap-2 hover:bg-[#1b3a70] transition z-10 shadow-md">
                    <span>EXPLORE</span>
                    <FaArrowRight size={10} className="sm:w-[12px] sm:h-[12px] sm:ml-6" />
                  </button>
                </Link>


                 {/* Text Overlay - absolute positioned at bottom with transparent dark gray background */}
                 <div className="absolute bottom-0 left-0 right-0 bg-[#001730]/50 backdrop-blur-sm z-10 transition-all duration-300 ease-in-out py-4 px-4 group-hover:pb-4">
                          <h3 className="text-white font-semibold text-[10px] mb-0 group-hover:mb-2 transition-all duration-300">
                            {blog.title}
                          </h3>
                          <div className="overflow-hidden max-h-0 group-hover:max-h-[200px] transition-all duration-300 ease-in-out">
                            <p className="text-white text-sm leading-relaxed opacity-0 group-hover:opacity-90 transform translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300 ease-in-out pt-0 group-hover:pt-2">
                              {blog.description}
                            </p>
                          </div>
                        </div>

                {/* Text Overlay */}
                {/* <div className="absolute bottom-0 left-0 right-0 bg-[#001730]/50 backdrop-blur-sm p-4 sm:p-6 z-10">
                  <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">
                    {blog.title}
                  </h3>
                  <p className="text-white text-xs sm:text-sm md:text-base leading-relaxed opacity-90">
                    {blog.description}
                  </p>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}

      <DreamPropertySection />
    </div>
  );
}
