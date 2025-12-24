"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import { ChevronRight } from "lucide-react";
import { Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MdLocationOn } from "react-icons/md";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
export default function Profit() {
  const [currentSlides, setCurrentSlide] = useState(0);
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
  const testimonials = [
    {
      name: "Cameron Williamson",
      text: "AREDC’s attention to detail and understanding of my specific requirements made finding my dream penthouse an effortless experience.",
      image: "/518.png",
    },
    {
      name: "Victoria Chen",
      text: "Their global network and discreet approach were instrumental in helping us acquire multiple investment properties across three continents.",
      image: "/514.png",
    },
    {
      name: "Robert Keller",
      text: "The team at AREDC provided white-glove service from start to finish. They truly understand the meaning of luxury in real estate.",
      image: "/516.png",
    },
    {
      name: "Sophia Lewis",
      text: "The professionalism and attention to every small detail made our home buying process seamless and stress-free.",
      image: "/516.png",
    },
    {
      name: "Michael Brown",
      text: "Outstanding service and deep understanding of luxury properties — truly unmatched in the region.",
      image: "/516.png",
    },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const testimonialsPerSlide = 3;
  const totalTestimonialSlides = Math.ceil(testimonials.length / testimonialsPerSlide);

  // Track window size for responsive calculations
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Automatically move to the next card every 5 seconds (one by one)
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prevIndex) => {
        // Continue through all cards, then loop back to start
        return prevIndex >= testimonials.length - 1 ? 0 : prevIndex + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Get three testimonials for current slide (wrapping around)
  const visibleTestimonials = [];
  for (let i = 0; i < testimonialsPerSlide; i++) {
    const index = (startIndex + i) % testimonials.length;
    visibleTestimonials.push(testimonials[index]);
  }

  // Get current slide index for dots
  const currentTestimonialSlide = Math.floor(startIndex / testimonialsPerSlide);

  // Blog data
  const blogs = [
    {
      title: "Discover the Art of Living in Qatar",
      description: "Explore lifestyle stories, community highlights, and home inspirations that define modern living across Qatar.",
      image: "/Image.png",
    },
    {
      title: "Discover the Art of Living in banglore",
      description: "Explore lifestyle stories, community highlights, and home inspirations that define modern living across Qatar.",
      image: "/Image.png",
    },
    {
      title: "Discover the Art of Living in mumbai",
      description: "Explore lifestyle stories, community highlights, and home inspirations that define modern living across Qatar.",
      image: "/Image.png",
    },
    {
      title: "Discover the Art of Living in kerla",
      description: "Explore lifestyle stories, community highlights, and home inspirations that define modern living across Qatar.",
      image: "/Image.png",
    },
    {
      title: "Discover the Art of Living in Qatar",
      description: "Explore lifestyle stories, community highlights, and home inspirations that define modern living across Qatar.",
      image: "/Image.png",
    },
  ];

  const [blogStartIndex, setBlogStartIndex] = useState(0);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const blogsPerSlide = 3;
  const totalBlogSlides = Math.ceil(blogs.length / blogsPerSlide);

  // Get visible blogs for current slide (desktop)
  const visibleBlogs = [];
  for (let i = 0; i < blogsPerSlide; i++) {
    const index = (blogStartIndex + i) % blogs.length;
    visibleBlogs.push(blogs[index]);
  }

  // Get current blog slide index for dots
  const currentBlogSlide = Math.floor(blogStartIndex / blogsPerSlide);

  // Mobile: show first blog initially, all blogs when showAllBlogs is true
  const mobileBlogs = showAllBlogs ? blogs : [blogs[0]];

  // Automatically move to the next blog card every 5 seconds
  useEffect(() => {
    const blogInterval = setInterval(() => {
      setBlogStartIndex((prevIndex) => {
        // Continue through all cards, then loop back to start
        return prevIndex >= blogs.length - 1 ? 0 : prevIndex + 1;
      });
    }, 5000);
    return () => clearInterval(blogInterval);
  }, []);
  const offices = [
    {
      title: "Head Office",
      subtitle: "Main Office",
      address: "Floor 28, Tower 1, West Bay, Doha",
      phone: "+974 4444 4444",
      email: "headquaters@alasmakhrealestate.com",
      timing: "Sun - Thu :: 8:00am - 6.00pm",
      image: "/office_location_background 1.png",
    },
    {
      title: "The Pearl Office",
      subtitle: "Main Office",
      address: "Floor 28, Tower 1, West Bay, Doha",
      phone: "+974 4444 4444",
      email: "headquaters@alasmakhrealestate.com",
      timing: "Sun - Thu :: 8:00am - 6.00pm",
      image: "/office_location_background 1.png",
    },
    {
      title: "Ain Khalid Gate",
      subtitle: "Main Office",
      address: "Floor 28, Tower 1, West Bay, Doha",
      phone: "+974 4444 4444",
      email: "headquaters@alasmakhrealestate.com",
      timing: "Sun - Thu :: 8:00am - 6.00pm",
      image: "/office_location_background 1.png",
    },
    {
      title: "Al Sadd Office",
      subtitle: "Main Office",
      address: "Floor 28, Tower 1, West Bay, Doha",
      phone: "+974 4444 4444",
      email: "headquaters@alasmakhrealestate.com",
      timing: "Sun - Thu :: 8:00am - 6.00pm",
      image: "/office_location_background 1.png",
    },
    {
      title: "Al Thumama Office",
      subtitle: "Main Office",
      address: "Floor 28, Tower 1, West Bay, Doha",
      phone: "+974 4444 4444",
      email: "headquaters@alasmakhrealestate.com",
      timing: "Sun - Thu :: 8:00am - 6.00pm",
      image: "/office_location_background 1.png",
    },
  ];
  const CARD_WIDTH = 360; // lg:min-w-[360px]
  const CARD_GAP = 96; // lg:gap-24 (24 * 4px = 96px)
  const MOBILE_CARD_WIDTH = 320; // min-w-[320px]
  const MOBILE_CARD_GAP = 16; // gap-4 (4 * 4px = 16px)

  // Calculate total slides for offices (3 offices per slide)
  const officesPerSlide = 3;
  const totalOfficeSlides = Math.ceil(offices.length / officesPerSlide);

  // Mobile office state - show one at a time
  const [mobileOfficeIndex, setMobileOfficeIndex] = useState(0);

  // Auto Slide for offices (desktop only)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        // Continue through all offices, then loop back to start
        return prev >= offices.length - 1 ? 0 : prev + 1;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [offices.length]);

  // Auto Slide for mobile offices - one at a time
  useEffect(() => {
    const mobileInterval = setInterval(() => {
      setMobileOfficeIndex((prev) => (prev + 1) % offices.length);
    }, 4000); // Auto-scroll every 4 seconds
    return () => clearInterval(mobileInterval);
  }, [offices.length]);

  // Get visible offices for current slide (desktop) - show 3 offices with wrapping
  const visibleOffices = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentSlides + i) % offices.length;
    visibleOffices.push(offices[index]);
  }
  return (
    <div>
      {/* Full Page Image */}
      {/* <div className="relative w-screen h-screen">
        <Image
          src="/c6.jpg.png"
          alt="profit"
          fill
          className="object-cover"
          priority
        />
      </div> */}
      <section className="relative h-[100vh] lg:h-screen w-full text-white">
        {/* Background Image */}
        <Image
          src="WhatsApp Image 2025-11-08 at 10.47.12 PM.jpeg"
          alt="City Skyline"
          fill
          priority
          className="object-cover lg:object-fill"
          style={{ objectPosition: 'left center' }}
        />

        {/* Content */}
        <div
          className="
      absolute lg:static
      bottom-0 left-0 right-0
      z-10
      flex items-center justify-center lg:justify-end
      h-full
      px-3 sm:px-4 lg:px-20
      py-6 lg:py-0
    "
        >
          <div
            className="
        w-full max-w-md lg:max-w-lg
        space-y-3 lg:space-y-6
        text-center lg:text-left

        /* MOBILE BACKGROUND */
        bg-white/20 backdrop-blur-md
        p-4 sm:p-5
        rounded-t-xl

        lg:bg-transparent lg:backdrop-blur-0 lg:p-0 lg:rounded-none
      "
          >
            {/* Heading */}
            <div>
              <h1 className="text-sm sm:text-base lg:text-2xl font-semibold leading-tight">
                TURNING YOUR <br /> PROPERTY INTO PROFIT
              </h1>

              <div className="h-[0.5px] bg-gray-300 my-3 lg:my-4" />

              <p className="text-[0.7rem] sm:text-xs lg:text-[0.8rem] text-white lg:text-gray-400">
                Your complete real estate partner — from concept to completion, and beyond.
              </p>
            </div>

            {/* Info Boxes */}
            <div className="space-y-2 lg:space-y-3 mt-3 lg:mt-6">
              {[
                {
                  title: "Expert Knowledge",
                  text:
                    "Our development team transforms visionary ideas into architectural landmarks that define Qatar's urban landscape."
                },
                {
                  title: "Personalized Service",
                  text:
                    "We take the time to understand your needs and offer personalized solutions to ensure a seamless real estate experience."
                },
                {
                  title: "Trusted Partnerships",
                  text:
                    "These prestigious partnerships underscore our capability to manage large-scale, complex projects."
                },
                {
                  title: "Comprehensive Support",
                  text:
                    "From property search to finalizing the deal, we provide comprehensive support at every step."
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/30 p-3 sm:p-4 rounded-md"
                >
                  <h3 className="font-semibold text-xs sm:text-sm lg:text-base">
                    {item.title}
                  </h3>
                  <p className="text-[0.65rem] sm:text-xs lg:text-sm mt-1 text-white lg:text-gray-400">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Section Title + Cards */}
      <div className="relative w-full py-4 lg:py-4 px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-4 3xl:px-4 4xl:px-32 5xl:px-4">
        <div className="max-w-[1500px] mt-10 mx-auto w-full">
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

          {/* View All Button - Moved inside max-w container */}
          <div className="flex justify-center mt-4 lg:mt-6 mb-5">
            <button className="bg-[#001730] text-white text-[12px] px-4 md:px-4 lg:px-5 xl:px-5 2xl:px-6 3xl:px-7 4xl:px-8 5xl:px-10 py-1.5 md:py-1.5 lg:py-2 xl:py-2 2xl:py-3 3xl:py-3 4xl:py-4 5xl:py-5 rounded flex items-center justify-center gap-2 transition hover:bg-[#1b3a70]">
              <span>View All</span>
              <FaArrowRight
                size={12}
                className="w-3 h-3  lg:w-[12px] lg:h-[12px] ml-20"
              />
            </button>
          </div>
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

      <section className="bg-gray-100 py-8 lg:py-16 px-4 relative overflow-visible">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/BG_Form.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-[400px] flex flex-col w-full">

          {/* Heading (Top) */}
          <div className="mt-0 text-center mb-[80px]">
            <h2 id="my-heading" className="text-2xl text-[#001730] uppercase mb-2 3xl:mb-3 4xl:mb-4">
              STORY FROM OUR CLIENTS
            </h2>
            <div className="w-[40%] lg:w-[30%] h-[0.5px] bg-gray-300 mx-auto"></div>
          </div>

          {/* Testimonial Cards */}
          <div className="relative w-full mt-[10px]">
            <div className="flex justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={startIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 w-full mx-20"
                >
                  {visibleTestimonials.map((t, i) => (
                    <div
                      key={i}
                      className="relative bg-gray-200 shadow-md rounded-md
                               p-4 lg:p-6 pl-14 lg:pl-20 hover:shadow-xl transition overflow-visible"
                    >
                      {/* Image */}
                      <div className="absolute left-[10px] lg:-left-[60px] top-1/2 -translate-y-1/2 w-[70px] h-[70px] lg:w-[120px] lg:h-[120px] rounded-md overflow-hidden flex-shrink-0 z-10">
                        <Image
                          src={t.image}
                          alt={t.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="text-left relative">
                        <h3 className="text-[#001730] ml-10 lg:ml-0 font-semibold text-sm lg:text-lg mb-2
                                     flex items-center justify-between">
                          {t.name}
                          <Image
                            src="/SVG.png"
                            alt="quote"
                            width={16}
                            height={16}
                            className="lg:w-5 lg:h-5 object-contain"
                          />
                        </h3>

                        <p className="text-gray-600 ml-10 lg:ml-0 text-xs lg:text-sm leading-relaxed">
                          {t.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>


          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 space-x-3">
            {Array.from({ length: testimonials.length }).map((_, index) => (
              <button
                key={index}
                onClick={() => setStartIndex(index)}
                className={`w-5 h-5 flex items-center justify-center transition-all duration-300 ${startIndex === index
                  ? "border-2 border-[#10284C] rounded-[2px] bg-white"
                  : "bg-transparent"
                  }`}
              >
                <span
                  className={`block ${startIndex === index
                    ? "w-2 h-2 bg-[#10284C] rounded-[2px]"
                    : "w-2 h-2 bg-gray-400 rounded-[2px]"
                    }`}
                />
              </button>
            ))}
          </div>

        </div>
      </section>



      {/* Latest Real Estate Blogs Section */}
      <section className="bg-white py-4 lg:py-12 px-4">
        {/* Section Heading */}
        <div className="lg:hidden text-center mb-8 lg:mb-12 px-4">
          <h2 className="text-[22px] lg:text-[36px] font-semibold text-[#001730] uppercase mb-2 text-center 3xl:mb-3 4xl:mb-4">
            Explore Events
          </h2>
          <div className="w-32 lg:w-50 mx-auto h-[0.5px] bg-gray-300"></div>
        </div>
        <div className="hidden lg:block text-center mb-14">
          <h2 id="my-heading" className="text-2xl text-[#001730] uppercase mb-2 text-center 3xl:mb-3 4xl:mb-4">
            LATEST REAL ESTATE BLOGS
          </h2>
          <div className="w-40 h-[0.5px] bg-gray-300 mx-auto"></div>
        </div>

        {/* Mobile Version - Show one blog initially, all when View All is clicked */}
        <div className="block lg:hidden">
          <div className="grid grid-cols-1 gap-4 lg:gap-6 w-full">
            {mobileBlogs.map((blog, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-md overflow-hidden transition-shadow duration-300"
              >
                {/* Image Section with Overlapping Button and Text Overlay */}
                <div className="relative w-full h-[300px] lg:h-[400px]">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-fill"
                  />
                  {/* EXPLORE Button - overlapping top-left corner, partially on image and white space */}
                  <button className="absolute top-6 left-3 lg:top-8 lg:left-4 -translate-y-1/2 bg-[#001730] text-white text-[10px] lg:text-xs font-semibold px-3 lg:px-4 py-1.5 lg:py-2 rounded flex items-center gap-1.5 lg:gap-2 hover:bg-[#1b3a70] transition z-10 shadow-md">
                    <span>EXPLORE</span>
                    <FaArrowRight size={10} className="lg:w-3 lg:h-3 ml-2 lg:ml-6" />
                  </button>

                  {/* Text Overlay - absolute positioned at bottom with transparent dark gray background */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#001730]/50 backdrop-blur-sm p-4 lg:p-6 z-10">
                    <h3 id="my-heading" className="text-white font-semibold text-base lg:text-lg xl:text-xl mb-2 lg:mb-3">
                      {blog.title}
                    </h3>
                    <p id="desc" className="text-white text-sm lg:text-sm xl:text-base leading-relaxed opacity-90">
                      {blog.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button - Only show when not all blogs are displayed */}
          {!showAllBlogs && (
            <div className="flex justify-center mt-6 lg:mt-8">
              <button
                onClick={() => setShowAllBlogs(true)}
                className="bg-[#001730] text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-md font-semibold hover:bg-[#1b3a70] transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 text-sm lg:text-base"
              >
                <span>View All</span>
                <FaArrowRight size={14} className="lg:w-4 lg:h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Desktop Version - Keep carousel/pagination as is */}
        <div className="hidden lg:block">
          {/* Blog Cards Row */}
          <div className="flex justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={blogStartIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
              >
                {visibleBlogs.map((blog, i) => (
                  <div
                    key={i}
                    className="bg-white shadow-md rounded-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Image Section with Overlapping Button and Text Overlay */}
                    <div className="relative w-full h-[250px] lg:h-[300px]">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-fill"
                      />
                      {/* EXPLORE Button - overlapping top-left corner, partially on image and white space */}
                      <button className="absolute top-8 left-4 -translate-y-1/2 bg-[#001730] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-2 hover:bg-[#1b3a70] transition z-10 shadow-md">
                        <span>EXPLORE</span>
                        <FaArrowRight size={12} className="ml-6" />
                      </button>

                      {/* Text Overlay - absolute positioned at bottom with transparent dark gray background */}
                      <div className="absolute bottom-0 left-0 right-0 bg-[#001730]/50 backdrop-blur-sm p-6 z-10">
                        <h3 className="text-white font-semibold text-lg lg:text-xl mb-3">
                          {blog.title}
                        </h3>
                        <p className="text-white text-sm lg:text-base leading-relaxed opacity-90">
                          {blog.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {Array.from({ length: testimonials.length }).map((_, index) => (
              <button
                key={index}
                onClick={() => setStartIndex(index)}
                className={`w-5 h-5 flex items-center justify-center transition-all duration-300 ${startIndex === index
                  ? "border-2 border-[#10284C] rounded-[2px] bg-white"
                  : "bg-transparent"
                  }`}
              >
                <span
                  className={`block ${startIndex === index
                    ? "w-2 h-2 bg-[#10284C] rounded-[2px]"
                    : "w-2 h-2 bg-gray-400 rounded-[2px]"
                    }`}
                />
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="relative w-full h-auto lg:h-screen flex items-center py-6 lg:py-0">
        {/* Background Image */}
        <Image
          src="/WhatsApp Image 2025-11-07 at 10.45.55 PM.jpeg"
          alt="Background"
          fill
          className="object-cover"
        />

        {/* Content Container */}
        <div className="relative z-10 max-w-[1300px] mx-auto w-full h-full px-4 lg:px-4">
          <div className="flex flex-col lg:flex-row w-full h-full items-start justify-between py-6 lg:py-0">
            {/* Left Side Title - Overlaid on background */}
            <div className="text-white lg:w-1/2 flex flex-col mt-6 lg:mt-20 mb-4 lg:mb-0 h-full">
              <h2 className="text-base lg:text-2xl text-center lg:text-left mb-2 lg:mb-3">
                How Can We Help You Today?
              </h2>
              <div className="h-[0.5px] w-[50%] bg-gray-300 mx-auto lg:mx-0 mb-3 lg:mb-4"></div>
            </div>

            {/* Right Side - Form Panel and Map */}
            <div className="lg:w-1/2 max-w-2xl w-full flex flex-col lg:mt-20">
              {/* Form Panel - Translucent */}
              <div className="bg-blue-50/10 backdrop-blur-sm p-4 lg:p-6 lg:px-16 rounded-md shadow-xl relative overflow-visible">
                {/* Form Header */}
                <h3 className="text-[#001730] lg:px-10 text-xs lg:text-sm xl:text-base text-center font-medium mb-2 lg:mb-3">
                  Fill out the form below and our experts will get back to you within 24 hour
                </h3>
                <div className="h-[0.5px] w-40 lg:w-60 bg-gray-300 mb-3 lg:mb-4 mx-auto"></div>


                <form className="space-y-3 lg:space-y-4">
                  {/* First Row: Name and Email */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                    <div>
                      <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Name</label>
                      <input
                        type="text"
                        placeholder="John Carter"
                        className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="example@email.com"
                        className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730]"
                      />
                    </div>
                  </div>

                  {/* Second Row: Phone and Property Type */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                    <div>
                      <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Phone</label>
                      <input
                        type="text"
                        placeholder="(123) 456 - 789"
                        className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Property Type</label>
                      <select
                        className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm text-gray-500 focus:outline-none focus:border-[#001730]"
                      >
                        <option>Choose a Type</option>
                        <option>Apartment</option>
                        <option>Villa</option>
                        <option>Commercial</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label className="block text-[#001730] text-xs lg:text-sm mb-1.5 lg:mb-2">Message</label>
                    <textarea
                      placeholder="Tell us more about your requirement like budget ,area & others .."
                      rows={3}
                      className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730] resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="bg-[#001730] text-white text-[12px] px-6 lg:px-8 py-2 lg:py-2.5 rounded-md flex items-center justify-center lg:justify-end gap-2 hover:bg-[#0d2142] transition w-full lg:w-auto"
                  >
                    <span className="text-[12px]">Submit</span>
                    <FaArrowRight size={12} className="lg:w-[12px] lg:h-[12px] ml-2 lg:ml-20" />
                  </button>
                </form>
              </div>

              {/* Map Section - Below the blur card */}
              <div className="mt-3 mb-4 lg:mb-0 lg:mt-6 w-full h-[15vh] lg:h-[20vh] rounded-md overflow-hidden bg-gray-200 border border-gray-300 relative">
                <Image
                  src="/675.png"
                  alt="Map"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-8 lg:py-16 bg-white relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0"

        />
        <div className="max-w-[1300px] mx-auto px-4 lg:px-4 relative z-10">
          {/* Mobile Version */}
          <div className="block lg:hidden relative" style={{ overflow: "hidden", width: "100%" }}>
            <div
              className="relative"
              style={{
                height: "auto",
                minHeight: "300px",
                overflow: "hidden",
                width: "100%",
                position: "relative",
              }}
            >
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(calc(-${mobileOfficeIndex * 100}%))`,
                  willChange: "transform",
                }}
              >
                {offices.map((office, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0"
                    style={{
                      width: "100%",
                      padding: "0 8px",
                    }}
                  >
                    <div
                      style={{
                        backgroundImage: 'url(/images/office_location.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'left center',
                        backgroundRepeat: 'no-repeat',
                      }}
                      className="relative bg-[#EEEEEE] rounded-md p-3 shadow-md overflow-hidden"
                    >
                      <div className="relative text-left z-10">
                        <h3 className="text-xl lg:text-2xl text-[#001730] mb-1">{office.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{office.subtitle}</p>

                        <div className="space-y-3 text-sm text-gray-700">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="text-[0.7rem] break-all">{office.address}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Phone className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="text-[0.7rem] break-all">{office.phone}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Mail className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="text-[0.7rem] break-all">{office.email}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="text-[0.7rem] break-all">{office.timing}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {Array.from({ length: offices.length }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setMobileOfficeIndex(index)}
                  className={`w-5 h-5 flex items-center justify-center transition-all duration-300 ${mobileOfficeIndex === index
                    ? "border-2 border-[#10284C] rounded-[2px] bg-white"
                    : "bg-transparent"
                    }`}
                >
                  <span
                    className={`block ${mobileOfficeIndex === index
                      ? "w-2 h-2 bg-[#10284C] rounded-[2px]"
                      : "w-2 h-2 bg-gray-400 rounded-[2px]"
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Desktop Version */}
          <div className="hidden lg:block">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlides}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                >
                  {visibleOffices.map((office, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundImage: 'url(/images/office_location.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'left center',
                        backgroundRepeat: 'no-repeat',
                      }}
                      className="bg-[#EEEEEE] rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex overflow-hidden relative"
                    >
                      {/* Left Section - Office Information */}
                      <div className="flex-1 p-6 relative z-10">
                        <h3 className="text-2xl font-semibold text-[#001730] mb-1">
                          {office.title}
                        </h3>
                        <p className="text-gray-700 text-sm mb-2">{office.subtitle}</p>

                        {/* Separator Line */}
                        <div className="h-[0.5px] w-60 bg-gray-300 mb-2" />

                        {/* Contact Details */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <MapPin className="w-4 h-4 text-gray-700" />
                            {office.address}
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <Phone className="w-4 h-4 text-gray-700" />
                            {office.phone}
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <Mail className="w-4 h-4 text-gray-700" />
                            {office.email}
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <Clock className="w-4 h-4 text-gray-700" />
                            {office.timing}
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Patterned Strip */}
                      <div className="w-20 relative overflow-hidden z-10">
                        <Image
                          src="/images/BG_Form.png"
                          alt="Pattern"
                          fill
                          className="object-fill opacity-50"
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center mt-8 space-x-3">
              {Array.from({ length: offices.length }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-5 h-5 flex items-center justify-center transition-all duration-300 ${currentSlides === index
                    ? "border-2 border-[#10284C] rounded-[2px] bg-white"
                    : "bg-transparent"
                    }`}
                >
                  <span
                    className={`block ${currentSlides === index
                      ? "w-2 h-2 bg-[#10284C] rounded-[2px]"
                      : "w-2 h-2 bg-gray-400 rounded-[2px]"
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
