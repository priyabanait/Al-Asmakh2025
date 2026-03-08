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
  
  // Filter states
  const [selectedType, setSelectedType] = useState(null); // Blog, Article, or null (all)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  
  // Use React Query hook for blogs - automatically cached and fast!
  // React Query checks cache → IF data exists & fresh → return instantly (0ms)
  // IF stale → call API → API checks Redis → Redis hit → return in <10ms
  const { data: blogsData, isLoading: blogsLoading, error: blogsError } = useBlogs({
    page: 1,
    limit: 50,
    contentType: selectedType || undefined,
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
    // Removed publishStatus filter to get all blogs from API
    // The hook will filter for Blog/Article content types and handle publishStatus internally
  });

  // Extract blogs from the data
  const blogs = blogsData?.blogs || [];
  
  // Get unique categories from blogs
  const categories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))];
  
  // Filter blogs by date (if needed)
  const filteredBlogs = blogs.filter(blog => {
    if (selectedDate) {
      const blogDate = new Date(blog.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now - blogDate) / (1000 * 60 * 60 * 24));
      
      if (selectedDate === 'week' && daysDiff > 7) return false;
      if (selectedDate === 'month' && daysDiff > 30) return false;
      if (selectedDate === 'year' && daysDiff > 365) return false;
    }
    return true;
  });

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters && filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
      // Close dropdowns when clicking outside
      if (!event.target.closest('.filter-dropdown-container')) {
        setShowTypeDropdown(false);
        setShowCategoryDropdown(false);
        setShowDateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

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
            <div className="flex items-center gap-3">
              <Search className="text-[#001730] w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs and articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[#001730] placeholder-gray-500 text-base lg:text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#001730] hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
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
                {/* Type Filter */}
                <div className="relative">
                  <div
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="flex items-center justify-between bg-[#0B1F3A] text-white px-4 py-3 rounded-md w-full shadow-lg hover:bg-[#001730] transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <FaTag className="w-4 h-4 sm:w-4 sm:h-4" />
                        <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                      </div>
                      <span className="text-xs sm:text-sm font-medium">
                        Type: {selectedType || 'All'}
                      </span>
                    </div>
                    <ArrowDown size={16} className={`text-white opacity-80 w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                  </div>
                  {showTypeDropdown && (
                    <div className="mt-2 bg-[#0B1F3A] rounded-md shadow-lg overflow-hidden">
                      {[null, 'Blog', 'Article'].map((type) => (
                        <div
                          key={type || 'all'}
                          onClick={() => {
                            setSelectedType(type);
                            setShowTypeDropdown(false);
                          }}
                          className={`px-4 py-2 text-white text-xs sm:text-sm cursor-pointer hover:bg-[#001730] ${selectedType === type ? 'bg-[#001730]' : ''}`}
                        >
                          {type || 'All'}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <div
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="flex items-center justify-between bg-[#0B1F3A] text-white px-4 py-3 rounded-md w-full shadow-lg hover:bg-[#001730] transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <FaFolder className="w-4 h-4 sm:w-4 sm:h-4" />
                        <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                      </div>
                      <span className="text-xs sm:text-sm font-medium">
                        Category: {selectedCategory || 'All'}
                      </span>
                    </div>
                    <ArrowDown size={16} className={`text-white opacity-80 w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                  </div>
                  {showCategoryDropdown && (
                    <div className="mt-2 bg-[#0B1F3A] rounded-md shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                      <div
                        onClick={() => {
                          setSelectedCategory(null);
                          setShowCategoryDropdown(false);
                        }}
                        className={`px-4 py-2 text-white text-xs sm:text-sm cursor-pointer hover:bg-[#001730] ${!selectedCategory ? 'bg-[#001730]' : ''}`}
                      >
                        All
                      </div>
                      {categories.map((category) => (
                        <div
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowCategoryDropdown(false);
                          }}
                          className={`px-4 py-2 text-white text-xs sm:text-sm cursor-pointer hover:bg-[#001730] ${selectedCategory === category ? 'bg-[#001730]' : ''}`}
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date Filter */}
                <div className="relative">
                  <div
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    className="flex items-center justify-between bg-[#0B1F3A] text-white px-4 py-3 rounded-md w-full shadow-lg hover:bg-[#001730] transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="w-4 h-4 sm:w-4 sm:h-4" />
                        <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                      </div>
                      <span className="text-xs sm:text-sm font-medium">
                        Date: {selectedDate === 'week' ? 'This Week' : selectedDate === 'month' ? 'This Month' : selectedDate === 'year' ? 'This Year' : 'All'}
                      </span>
                    </div>
                    <ArrowDown size={16} className={`text-white opacity-80 w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
                  </div>
                  {showDateDropdown && (
                    <div className="mt-2 bg-[#0B1F3A] rounded-md shadow-lg overflow-hidden">
                      {[null, 'week', 'month', 'year'].map((date) => (
                        <div
                          key={date || 'all'}
                          onClick={() => {
                            setSelectedDate(date);
                            setShowDateDropdown(false);
                          }}
                          className={`px-4 py-2 text-white text-xs sm:text-sm cursor-pointer hover:bg-[#001730] ${selectedDate === date ? 'bg-[#001730]' : ''}`}
                        >
                          {date === 'week' ? 'This Week' : date === 'month' ? 'This Month' : date === 'year' ? 'This Year' : 'All'}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
            {/* Type Filter */}
            <div className="relative filter-dropdown-container">
              <div
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="flex items-center justify-between bg-[#0B1F3A] text-white px-8 py-2 w-full max-w-[250px] rounded-md shadow-lg hover:bg-[#001730] transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FaTag className="w-4 h-4" />
                    <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                  </div>
                  <span className="text-[13px]">Type: {selectedType || 'All'}</span>
                </div>
                <ArrowDown size={16} className={`opacity-80 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
              </div>
              {showTypeDropdown && (
                <div className="absolute top-full mt-2 w-full max-w-[250px] bg-[#0B1F3A] rounded-md shadow-lg overflow-hidden z-50">
                  {[null, 'Blog', 'Article'].map((type) => (
                    <div
                      key={type || 'all'}
                      onClick={() => {
                        setSelectedType(type);
                        setShowTypeDropdown(false);
                      }}
                      className={`px-4 py-2 text-white text-sm cursor-pointer hover:bg-[#001730] ${selectedType === type ? 'bg-[#001730]' : ''}`}
                    >
                      {type || 'All'}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative filter-dropdown-container">
              <div
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center justify-between bg-[#0B1F3A] text-white px-8 py-2 w-full max-w-[250px] rounded-md shadow-lg hover:bg-[#001730] transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FaFolder className="w-4 h-4" />
                    <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                  </div>
                  <span className="text-[13px]">Category: {selectedCategory || 'All'}</span>
                </div>
                <ArrowDown size={16} className={`opacity-80 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </div>
              {showCategoryDropdown && (
                <div className="absolute top-full mt-2 w-full max-w-[250px] bg-[#0B1F3A] rounded-md shadow-lg overflow-hidden max-h-48 overflow-y-auto z-50">
                  <div
                    onClick={() => {
                      setSelectedCategory(null);
                      setShowCategoryDropdown(false);
                    }}
                    className={`px-4 py-2 text-white text-sm cursor-pointer hover:bg-[#001730] ${!selectedCategory ? 'bg-[#001730]' : ''}`}
                  >
                    All
                  </div>
                  {categories.map((category) => (
                    <div
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowCategoryDropdown(false);
                      }}
                      className={`px-4 py-2 text-white text-sm cursor-pointer hover:bg-[#001730] ${selectedCategory === category ? 'bg-[#001730]' : ''}`}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date Filter */}
            <div className="relative filter-dropdown-container">
              <div
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="flex items-center justify-between bg-[#0B1F3A] text-white px-8 py-2 w-full max-w-[250px] rounded-md shadow-lg hover:bg-[#001730] transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="w-4 h-4" />
                    <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                  </div>
                  <span className="text-[13px]">
                    Date: {selectedDate === 'week' ? 'This Week' : selectedDate === 'month' ? 'This Month' : selectedDate === 'year' ? 'This Year' : 'All'}
                  </span>
                </div>
                <ArrowDown size={16} className={`opacity-80 transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
              </div>
              {showDateDropdown && (
                <div className="absolute top-full mt-2 w-full max-w-[250px] bg-[#0B1F3A] rounded-md shadow-lg overflow-hidden z-50">
                  {[null, 'week', 'month', 'year'].map((date) => (
                    <div
                      key={date || 'all'}
                      onClick={() => {
                        setSelectedDate(date);
                        setShowDateDropdown(false);
                      }}
                      className={`px-4 py-2 text-white text-sm cursor-pointer hover:bg-[#001730] ${selectedDate === date ? 'bg-[#001730]' : ''}`}
                    >
                      {date === 'week' ? 'This Week' : date === 'month' ? 'This Month' : date === 'year' ? 'This Year' : 'All'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </section>

      <div className="bg-white border-gray-200 px-2  lg:px-4">
        <div className="hidden lg:flex max-w-full mb-2 bg-gray-50    mt-24 mx-auto items-center gap-4">

          {/* Showing Count (Left) */}
          <div className="text-gray-400 text-sm font-medium whitespace-nowrap">
            {!blogsLoading && !blogsError ? `Showing ${filteredBlogs.length} ${filteredBlogs.length === 1 ? 'blog/article' : 'blogs/articles'}` : 'Loading...'}
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
      {!blogsLoading && !blogsError && filteredBlogs.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500 text-lg">
            {blogs.length === 0 
              ? 'No blogs or articles available at the moment.' 
              : 'No blogs match your filters. Try adjusting your search criteria.'}
          </div>
        </div>
      )}

      {/* Blogs Grid */}
      {!blogsLoading && !blogsError && filteredBlogs.length > 0 && (
        <div className="mt-10 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-8 md:px-10 lg:px-10 p-4 sm:p-6">
          {filteredBlogs.map((blog, i) => (
            <div
              key={blog.id || i}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image Section with Overlapping Button and Text Overlay */}
              <div className="relative w-full h-80 lg:h-80">
                <Link href={`/BlogsDetails?id=${blog.id}`}>
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
                <Link href={`/BlogsDetails?id=${blog.id}`}>
                  <button className="absolute top-4 sm:top-8 left-3 sm:left-4 bg-[#001730] text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded flex items-center gap-2 hover:bg-[#1b3a70] transition z-10 shadow-md">
                    <span>EXPLORE</span>
                    <FaArrowRight size={10} className="sm:w-[12px] sm:h-[12px] sm:ml-6" />
                  </button>
                </Link>


                 {/* Text Overlay - absolute positioned at bottom with transparent dark gray background */}
                 <Link href={`/BlogsDetails?id=${blog.id}`}>
                   <div className="absolute bottom-0 left-0 right-0 bg-[#001730]/50 backdrop-blur-sm z-10 transition-all duration-300 ease-in-out py-4 px-4 group-hover:pb-4 cursor-pointer">
                     <h3 className="text-white font-semibold text-[14px] mb-0 group-hover:mb-2 transition-all duration-300">
                       {blog.title}
                     </h3>
                     <div className="overflow-hidden max-h-0 group-hover:max-h-[200px] transition-all duration-300 ease-in-out">
                       <span className="text-white text-sm leading-relaxed opacity-0 group-hover:opacity-90 transform translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300 ease-in-out pt-0 group-hover:pt-2 block">
                         {blog.description}
                       </span>
                     </div>
                   </div>
                 </Link>

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
