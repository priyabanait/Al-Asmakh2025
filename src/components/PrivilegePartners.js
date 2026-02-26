"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { ChevronRight } from "lucide-react";
import { Quote } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import { MdLocationOn } from "react-icons/md";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import FeaturedProperties from "./FeaturedProperties";
import useEmblaCarousel from "embla-carousel-react";
import { API_BASE_URL, getApiUrl, getMarketingApiUrl } from "../config/api";
import { useAlert } from "../contexts/AlertContext";
import { useBlogs } from "../hooks/useBlogs";
export default function Profit() {
  const [currentSlides, setCurrentSlide] = useState(0);
  const testimonials = [
    {
      name: "Sarah Mitchell",
      text: "Al-Asmakh's attention to detail and understanding of my specific requirements made finding my dream penthouse an effortless experience. ",
      image: "https://media.istockphoto.com/id/1394149744/photo/headshot-of-early-20s-middle-eastern-woman.jpg?s=612x612&w=0&k=20&c=Q4gBjPUfikbPtkFh3I9_CoLF53H8Bz9FAfxiMOO7eIY=",
    },
    {
      name: "Ahmed Al-Thani",
      text: "Their global network and discreet approach were instrumental in helping us acquire multiple investment properties across three continents. Truly professional service.",
      image: "https://media.istockphoto.com/id/1188035960/photo/arabian-man-with-traditional-dress.jpg?s=612x612&w=0&k=20&c=1YLblK80dPpriEy3-mcH8NQcBINrUc42c_P9lCF7zag=",
    },
    {
      name: "Emma Thompson",
      text: "The team at Al-Asmakh provided white-glove service from start to finish. They truly understand the meaning of luxury in real estate and made our journey seamless.",
      image: "https://i.pravatar.cc/150?img=9",
    },
    {
      name: "James Anderson",
      text: "The professionalism and attention to every small detail made our home buying process seamless and stress-free. Highly recommend their services to anyone looking for premium properties.",
      image: "https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg",
    },
    {
      name: "Fatima Hassan",
      text: "Outstanding service and deep understanding of luxury properties — truly unmatched in the region. Al-Asmakh exceeded all our expectations and delivered beyond what we imagined.",
      image: "https://media.istockphoto.com/id/487224796/photo/young-arabic-woman-in-modern-office.jpg?s=612x612&w=0&k=20&c=fr9umHN4hxFFVrgJFwk4_eBKfFvyrM79JzD9wePWWV4=",
    },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+974"); // Default to Qatar
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryDropdownRef = useRef(null);
  const { showSuccess, showError } = useAlert();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email) {
      showError('Please fill in your name and email');
      return;
    }

    setIsSubmitting(true);

    try {
      // Split name into firstName and lastName
      const nameParts = formData.name.trim().split(/\s+/);
      const firstName = nameParts[0] || formData.name.trim();
      const lastName = nameParts.slice(1).join(' ') || '';

      // Combine country code and phone number
      const fullPhone = selectedCountryCode + (formData.phone || '').replace(/\D/g, '');

      // Prepare notes with source tracking
      let notes = formData.message || '';
      if (typeof window !== 'undefined' && window.location.href) {
        if (notes) notes += '\n\n';
        notes += `Source: Privilege Partners Component\nURL: ${window.location.href}`;
      }

      // Transform form data to match property-service Lead entity structure
      const leadData = {
        // Personal Information (required fields)
        firstName: firstName,
        lastName: lastName || null,
        email: formData.email.trim().toLowerCase(),
        phone: fullPhone,
        gender: 'MALE', // Default value since it's required but not in form
        
        // Lead Source
        leadSource: 'Website', // Form submissions come from website
        
        // Interest/Property Type
        interest: formData.propertyType || null,
        propertyPreferences: formData.propertyType || null,
        
        // Notes/Message
        notes: notes || null,
        remark: notes || null,
        
        // Status (default to New)
        status: 'New'
      };

      const response = await fetch(getApiUrl('api/leads'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      const data = await response.json();

      // Handle different response formats from property-service
      if (response.ok && (data.success || data.id || data.data)) {
        showSuccess('Thank you for your inquiry! We will get back to you within 24 hours.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          propertyType: '',
          message: ''
        });
        setSelectedCountryCode('+974'); // Reset to default
      } else {
        const errorMessage = data.message || data.error || 'Failed to submit your inquiry. Please try again.';
        showError(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showError('Failed to submit your inquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };

    if (showCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCountryDropdown]);
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

  // Automatically move to the next card every 5 seconds (one by one) - Desktop only
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      const interval = setInterval(() => {
        setStartIndex((prevIndex) => {
          // Continue through all cards, then loop back to start
          return prevIndex >= testimonials.length - 1 ? 0 : prevIndex + 1;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  // Get three testimonials for current slide (wrapping around) - Desktop only
  const visibleTestimonials = [];
  for (let i = 0; i < testimonialsPerSlide; i++) {
    const index = (startIndex + i) % testimonials.length;
    visibleTestimonials.push(testimonials[index]);
  }

  // Get current slide index for dots
  const currentTestimonialSlide = Math.floor(startIndex / testimonialsPerSlide);

  // Motion Carousel setup for mobile testimonials
  const [emblaTestimonialRef, emblaTestimonialApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    skipSnaps: false,
    dragFree: false,
  });
  const [selectedTestimonialIndex, setSelectedTestimonialIndex] = useState(0);
  const [testimonialScrollSnaps, setTestimonialScrollSnaps] = useState([]);

  const scrollToTestimonial = useCallback(
    (index) => emblaTestimonialApi && emblaTestimonialApi.scrollTo(index),
    [emblaTestimonialApi]
  );

  const onSelectTestimonial = useCallback(() => {
    if (!emblaTestimonialApi) return;
    setSelectedTestimonialIndex(emblaTestimonialApi.selectedScrollSnap());
  }, [emblaTestimonialApi]);

  useEffect(() => {
    if (!emblaTestimonialApi) return;
    onSelectTestimonial();
    setTestimonialScrollSnaps(emblaTestimonialApi.scrollSnapList());
    emblaTestimonialApi.on("select", onSelectTestimonial);
    emblaTestimonialApi.on("reInit", onSelectTestimonial);
  }, [emblaTestimonialApi, onSelectTestimonial]);

  // Blog data - fetched from API
  // Use React Query hook for blogs - automatically cached and fast!
  // React Query checks cache → IF data exists & fresh → return instantly (0ms)
  // IF stale → call API → API checks Redis → Redis hit → return in <10ms
  const { data: blogsData, isLoading: blogsLoading, error: blogsError } = useBlogs({
    page: 1,
    limit: 20,
    publishStatus: 'Published',
  });

  // Extract blogs and limit to 3 for display
  const blogs = (blogsData?.blogs || []).slice(0, 3);

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

  // Motion Carousel setup for mobile blogs
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    skipSnaps: false,
    dragFree: false,
  });
  const [selectedBlogIndex, setSelectedBlogIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollToBlog = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelectBlog = useCallback(() => {
    if (!emblaApi) return;
    setSelectedBlogIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelectBlog();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelectBlog);
    emblaApi.on("reInit", onSelectBlog);
  }, [emblaApi, onSelectBlog]);

  // Automatically move to the next blog card every 5 seconds (desktop only)
  useEffect(() => {
    if (blogs.length === 0) return; // Don't start interval if no blogs
    
    const blogInterval = setInterval(() => {
      setBlogStartIndex((prevIndex) => {
        // Continue through all cards, then loop back to start
        return prevIndex >= blogs.length - 1 ? 0 : prevIndex + 1;
      });
    }, 5000);
    return () => clearInterval(blogInterval);
  }, [blogs.length]);
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

  // Ref and scroll animation for info boxes
  const infoBoxesRef = useRef(null);
  const isInView = useInView(infoBoxesRef, { once: false, amount: 0.2 });

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
      <section className="relative h-[100vh] lg:h-screen w-full text-white overflow-hidden">

        {/* BACKGROUND IMAGE */}
        <Image
          src="/mainScreen/19.png"
          alt="City Skyline"
          fill
          priority
          className="object-cover lg:object-fill"
          style={{ objectPosition: "left center" }}
        />

        {/* CONTENT WRAPPER */}
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

      /* MOBILE OVERLAY */
      bg-white/20 backdrop-blur-md
      p-4 sm:p-5
      rounded-t-xl

      lg:bg-transparent lg:backdrop-blur-0 lg:p-0 lg:rounded-none
    "
          >

            {/* HEADING BLOCK */}
            <div>
              <h1
                className="font-semibold leading-tight"
                style={{
                  fontSize: "clamp(16px, 1.2vw, 30px)"
                }}
              >
                Partnering to Grow the Value of Your Property
              </h1>

              <div className="h-[0.5px] bg-gray-300 my-3 lg:my-4" />

              <p
                className="text-white lg:text-gray-400"
                style={{
                  fontSize: "clamp(12px, 0.85vw, 18px)",
                  lineHeight: "1.6"
                }}
              >
                For owners and investors who want clarity, consistency, and care,
                we provide end-to-end support across Qatar's real estate market.
              </p>
            </div>

            {/* INFO BOXES */}
            <div
              ref={infoBoxesRef}
              className="
        space-y-2 sm:space-y-3 lg:space-y-4
        mt-3 sm:mt-4 lg:mt-6
        flex flex-col justify-center
      "
            >
              {[
                {
                  title: "Expert Knowledge",
                  text:
                    "Our teams blend local insight with design, engineering, and leasing expertise to turn well-located sites into well-run assets."
                },
                {
                  title: "Personalised Service",
                  text:
                    "We listen closely, tailor our approach, and keep you informed so every decision feels considered and transparent."
                },
                {
                  title: "Trusted Partnerships",
                  text:
                    "Long-standing relationships with authorities, consultants, and service providers help projects move more smoothly from plan to reality."
                },
                {
                  title: "Comprehensive Support",
                  text:
                    "From early studies to leasing, operations, and future upgrades, we provide continuous support at every stage of the journey."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="bg-white/30 p-3 sm:p-4 lg:p-5 rounded-md"
                  initial={{ opacity: 0, x: -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.15,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <h3
                    className="font-semibold"
                    style={{
                      fontSize: "clamp(13px, 0.9vw, 18px)"
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="mt-1 text-white lg:text-gray-400"
                    style={{
                      fontSize: "clamp(12px, 0.8vw, 16px)",
                      lineHeight: "1.6"
                    }}
                  >
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* Featured Properties Section */}
      <FeaturedProperties 
        priceType="rent"
        limit={4}
        status="published"
        viewAllLink="/listings/rent"
      />

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
          <div className="mt-0 text-center mb-8 lg:mb-[80px]">
            <h2 id="my-heading" className="text-2xl text-[#001730] uppercase mb-2 3xl:mb-3 4xl:mb-4">
              STORY FROM OUR CLIENTS
            </h2>
            <div className="w-[40%] lg:w-[30%] h-[0.5px] bg-gray-300 mx-auto"></div>
          </div>

          {/* Mobile Testimonials - Motion Carousel */}
          <div className="block lg:hidden relative w-full pt-2 pb-8 px-2">
            <div className="overflow-hidden" ref={emblaTestimonialRef}>
              <div className="flex touch-pan-y" style={{ gap: "1rem", paddingLeft: "1rem", paddingRight: "1rem" }}>
                {testimonials.map((t, index) => {
                  const isActive = index === selectedTestimonialIndex;
                  return (
                    <motion.div
                      key={index}
                      className="flex-shrink-0 w-[92%] sm:w-[80%]"
                      style={{
                        paddingLeft: "0.5rem",
                        paddingRight: "0.5rem",
                      }}
                      animate={{
                        scale: isActive ? 1 : 0.85,
                        opacity: isActive ? 1 : 0.6,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="relative bg-gray-200 shadow-lg rounded-md p-4 pl-14 hover:shadow-xl transition overflow-visible">
                        {/* Image */}
                        <div className="absolute left-[10px] top-1/2 -translate-y-1/2 w-[70px] h-[70px] rounded-md overflow-hidden flex-shrink-0 z-10">
                          <Image
                            src={t.image}
                            alt={t.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="text-left relative">
                          <h3 className="text-[#001730] ml-10 font-semibold text-sm mb-2 flex items-center justify-between">
                            {t.name}
                            <Image
                              src="/SVG.png"
                              alt="quote"
                              width={16}
                              height={16}
                              className="object-contain"
                            />
                          </h3>

                          <p className="text-gray-600 ml-10 text-xs leading-relaxed">
                            {t.text}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Pill-style Pagination for Mobile */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {testimonialScrollSnaps.map((_, index) => {
                const isActive = index === selectedTestimonialIndex;
                return (
                  <motion.button
                    key={index}
                    onClick={() => scrollToTestimonial(index)}
                    className="relative flex items-center justify-center outline-none border-none bg-transparent cursor-pointer p-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    <motion.div
                      className="h-2 rounded-full bg-[#001730]"
                      animate={{
                        width: isActive ? 24 : 8,
                        opacity: isActive ? 1 : 0.4,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Desktop Testimonials - Keep original grid */}
          <div className="hidden lg:block relative w-full mt-[10px]">
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

            {/* Dots Navigation - Desktop */}
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: testimonials.length }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setStartIndex(index)}
                  className="relative flex items-center justify-center"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={false}
                    animate={{
                      scale: index === startIndex ? 1.2 : 1,
                      opacity: index === startIndex ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <motion.span
                    className={`
                      block rounded-full
                      ${index === startIndex
                        ? "bg-[#001730]"
                        : "bg-gray-400"
                      }
                    `}
                    animate={{
                      width: index === startIndex ? "24px" : "8px",
                      height: index === startIndex ? "8px" : "8px",
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>



      {/* Latest Real Estate Blogs Section */}
      <section className="bg-white py-8 lg:py-16 3xl:py-20 4xl:py-24 5xl:py-28 px-4 lg:mb-[30px]">
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

        {/* Loading State */}
        {blogsLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-[#001730] text-lg">Loading blogs...</div>
          </div>
        )}

        {/* Error State */}
        {blogsError && !blogsLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-red-600 text-lg">Error loading blogs: {blogsError?.message || 'Failed to load blogs'}</div>
          </div>
        )}

        {/* No Blogs State */}
        {!blogsLoading && !blogsError && blogs.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500 text-lg">No blogs available at the moment.</div>
          </div>
        )}

        {/* Mobile Version - Motion Carousel */}
        {!blogsLoading && !blogsError && blogs.length > 0 && (
        <div className="block lg:hidden relative w-full py-8 px-2">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y" style={{ gap: "1rem", paddingLeft: "1rem", paddingRight: "1rem" }}>
              {blogs.map((blog, index) => {
                const isActive = index === selectedBlogIndex;
                return (
                  <motion.div
                    key={blog.id || index}
                    className="flex-shrink-0 w-[92%] sm:w-[80%]"
                    style={{
                      paddingLeft: "0.5rem",
                      paddingRight: "0.5rem",
                    }}
                    animate={{
                      scale: isActive ? 1 : 0.85,
                      opacity: isActive ? 1 : 0.6,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="bg-white shadow-lg rounded-md overflow-hidden transition-shadow duration-300 group">
                      {/* Image Section with Overlapping Button and Text Overlay */}
                      <div className="relative w-full h-[300px]">
                        <Image
                          src={blog.image || '/Image.png'}
                          alt={blog.title}
                          fill
                          className="object-cover"
                          unoptimized={blog.image && blog.image.startsWith('http')}
                          onError={(e) => {
                            e.target.src = '/Image.png';
                          }}
                        />
                        {/* EXPLORE Button - overlapping top-left corner */}
                        <Link href={`/BlogsDetails?id=${blog.id}`}>
                          <motion.button
                            className="absolute top-6 left-3 bg-[#001730] text-white text-[10px] font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 hover:bg-[#1b3a70] transition z-10 shadow-md"
                            animate={{
                              scale: isActive ? 1.05 : 1,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          >
                            <span>EXPLORE</span>
                            <FaArrowRight size={10} className="ml-2" />
                          </motion.button>
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
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Pill-style Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {scrollSnaps.map((_, index) => {
              const isActive = index === selectedBlogIndex;
              return (
                <motion.button
                  key={index}
                  onClick={() => scrollToBlog(index)}
                  className="relative flex items-center justify-center outline-none border-none bg-transparent cursor-pointer p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <motion.div
                    className="h-2 rounded-full bg-[#001730]"
                    animate={{
                      width: isActive ? 24 : 8,
                      opacity: isActive ? 1 : 0.4,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                </motion.button>
              );
            })}
          </div>
        </div>
        )}

        {/* Desktop Version - Keep carousel/pagination as is */}
        {!blogsLoading && !blogsError && blogs.length > 0 && (
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
                    key={blog.id || i}
                    className="bg-white shadow-md rounded-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                  >
                    {/* Image Section with Overlapping Button and Text Overlay */}
                    <div className="relative w-full h-[250px] lg:h-[300px]">
                      <Image
                        src={blog.image || '/Image.png'}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        unoptimized={blog.image && blog.image.startsWith('http')}
                        onError={(e) => {
                          e.target.src = '/Image.png';
                        }}
                      />
                      {/* EXPLORE Button - overlapping top-left corner, partially on image and white space */}
                      <Link href={`/BlogsDetails?id=${blog.id}`}>
                        <button className="absolute top-8 left-4 -translate-y-1/2 bg-[#001730] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-2 hover:bg-[#1b3a70] transition z-10 shadow-md">
                          <span>EXPLORE</span>
                          <FaArrowRight size={12} className="ml-6" />
                        </button>
                      </Link>

                      {/* Text Overlay - absolute positioned at bottom with transparent dark gray background */}
                      <div className="absolute bottom-0 left-0 right-0 bg-[#001730]/50 backdrop-blur-sm z-10 transition-all duration-300 ease-in-out py-6 px-6 group-hover:pb-6">
                        <h3 className="text-white font-semibold text-[18px] lg:text-[18px] mb-0 group-hover:mb-3 transition-all duration-300">
                          {blog.title}
                        </h3>

                        <div className="h-[0.3px] w-40 bg-gray-300 mb-0 group-hover:mb-3 lg:group-hover:mb-4 w-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        <div className="overflow-hidden max-h-0 group-hover:max-h-[300px] transition-all duration-300 ease-in-out">
                          <p className="text-white text-sm lg:text-base leading-relaxed opacity-0 group-hover:opacity-90 transform translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300 ease-in-out pt-0 group-hover:pt-2">
                            {blog.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: blogs.length }).map((_, index) => (
              <button
                key={index}
                onClick={() => setBlogStartIndex(index)}
                className="relative flex items-center justify-center"
                aria-label={`Go to slide ${index + 1}`}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={false}
                  animate={{
                    scale: index === blogStartIndex ? 1.2 : 1,
                    opacity: index === blogStartIndex ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                <motion.span
                  className={`
                    block rounded-full
                    ${index === blogStartIndex
                      ? "bg-[#001730]"
                      : "bg-gray-400"
                    }
                  `}
                  animate={{
                    width: index === blogStartIndex ? "24px" : "8px",
                    height: index === blogStartIndex ? "8px" : "8px",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </button>
            ))}
          </div>
        </div>
        )}
      </section>
      <section className="relative w-full h-auto lg:min-h-screen flex items-center py-8 lg:py-12 xl:py-16 2xl:py-20 overflow-hidden">
        {/* Background Image */}
        <Image
          src="/mainScreen/Contact-us.jpeg"
          alt="Background"
          fill
          className="object-cover"
        />

        {/* Content Container */}
        <div className="relative z-10 max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4xl:max-w-[2560px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="flex flex-col lg:flex-row w-full items-start justify-between gap-6 lg:gap-8 xl:gap-12">
            {/* Left Side Title - Overlaid on background */}
            <div className="text-white lg:w-1/2 flex flex-col justify-center lg:mt-0">
              <h2 className="text-base lg:text-2xl xl:text-3xl 2xl:text-4xl text-center lg:text-left mb-2 lg:mb-3">
                How Can We Help You Today?
              </h2>
              <div className="h-[0.5px] w-[75%] bg-gray-300 mx-auto lg:mx-0 mb-3 lg:mb-4"></div>
            </div>

            {/* Right Side - Form Panel and Map */}
            <div className="lg:w-1/2 w-full flex flex-col">
              {/* Form Panel - Translucent */}
              <div className="bg-blue-50/10 backdrop-blur-sm p-4 lg:p-6 xl:p-8 lg:px-8 xl:px-12 2xl:px-16 rounded-md shadow-xl relative overflow-hidden">
                {/* Form Header */}
                <h3 className="text-[#001730] text-xs lg:text-sm xl:text-base text-center font-medium mb-2 lg:mb-3">
                  Fill out the form below and our experts will get back to you within 24 hour
                </h3>
                <div className="h-[0.5px] w-40 lg:w-60 bg-gray-300 mb-3 lg:mb-4 mx-auto"></div>


                <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
                  {/* First Row: Name and Email */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-2">
                    <div>
                      <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Name</label>
                      <input
                        type="text"
                        placeholder="Enter Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730] h-[42px] lg:h-[45px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="Enter Your Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730] h-[42px] lg:h-[45px]"
                      />
                    </div>
                  </div>

                  {/* Second Row: Phone and Property Type */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                    <div className="flex flex-col">
                      <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Phone</label>
                      <div className="flex relative h-[42px] lg:h-[45px]" ref={countryDropdownRef}>
                        {/* Country Code Dropdown - Left Side */}
                        <div className="relative flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            className="h-[42px] lg:h-[45px] px-2 flex items-center justify-center gap-0 outline-none hover:bg-gray-50 bg-white border border-r-0 border-gray-300 rounded-l-md"
                            style={{ fontSize: '12px', color: "#001730" }}
                          >
                            <span>{selectedCountryCode}</span>
                            <svg
                              className={`w-3 h-3 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {/* Divider */}
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-5 bg-gray-300"></div>
                          {/* Country Dropdown Menu */}
                          {showCountryDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-50 min-w-[280px]">
                              {[
                                { code: "+974", country: "Qatar", flag: "🇶🇦" },
                                { code: "+971", country: "UAE", flag: "🇦🇪" },
                                { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
                                { code: "+965", country: "Kuwait", flag: "🇰🇼" },
                                { code: "+973", country: "Bahrain", flag: "🇧🇭" },
                                { code: "+968", country: "Oman", flag: "🇴🇲" },
                                { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
                                { code: "+44", country: "UK", flag: "🇬🇧" },
                                { code: "+91", country: "India", flag: "🇮🇳" },
                                { code: "+86", country: "China", flag: "🇨🇳" },
                                { code: "+81", country: "Japan", flag: "🇯🇵" },
                                { code: "+82", country: "South Korea", flag: "🇰🇷" },
                                { code: "+33", country: "France", flag: "🇫🇷" },
                                { code: "+49", country: "Germany", flag: "🇩🇪" },
                                { code: "+39", country: "Italy", flag: "🇮🇹" },
                                { code: "+34", country: "Spain", flag: "🇪🇸" },
                                { code: "+61", country: "Australia", flag: "🇦🇺" },
                                { code: "+27", country: "South Africa", flag: "🇿🇦" },
                                { code: "+20", country: "Egypt", flag: "🇪🇬" },
                                { code: "+212", country: "Morocco", flag: "🇲🇦" },
                                { code: "+90", country: "Turkey", flag: "🇹🇷" },
                                { code: "+7", country: "Russia", flag: "🇷🇺" },
                                { code: "+55", country: "Brazil", flag: "🇧🇷" },
                                { code: "+52", country: "Mexico", flag: "🇲🇽" },
                                { code: "+234", country: "Nigeria", flag: "🇳🇬" },
                                { code: "+92", country: "Pakistan", flag: "🇵🇰" },
                                { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
                                { code: "+62", country: "Indonesia", flag: "🇮🇩" },
                                { code: "+60", country: "Malaysia", flag: "🇲🇾" },
                                { code: "+65", country: "Singapore", flag: "🇸🇬" },
                                { code: "+66", country: "Thailand", flag: "🇹🇭" },
                                { code: "+84", country: "Vietnam", flag: "🇻🇳" },
                                { code: "+63", country: "Philippines", flag: "🇵🇭" },
                              ].map((item) => (
                                <button
                                  key={item.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountryCode(item.code);
                                    setShowCountryDropdown(false);
                                  }}
                                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${
                                    selectedCountryCode === item.code ? 'bg-gray-100 font-semibold' : ''
                                  }`}
                                  style={{ fontSize: '12px' }}
                                >
                                  <span>{item.flag}</span>
                                  <span className="flex-1">{item.country}</span>
                                  <span className="text-gray-600">{item.code}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Phone Number Input - Right Side */}
                        <input
                          type="text"
                          placeholder="(123) 456 - 789"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="flex-1 bg-white border border-l-0 border-gray-300 rounded-r-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730] h-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Property Type</label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm text-gray-500 focus:outline-none focus:border-[#001730] h-[42px] lg:h-[45px]"
                      >
                        <option value="">Choose a Type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Commercial">Commercial</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label className="block text-[#001730] text-xs lg:text-sm mb-1.5 lg:mb-2">Message</label>
                    <textarea
                      placeholder="Tell us more about your requirement like budget ,area & others .."
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730] resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#001730] text-white text-[12px] px-6 lg:px-8 py-2 lg:py-2.5 rounded-md flex items-center justify-center lg:justify-end gap-2 hover:bg-[#0d2142] transition w-full lg:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-[12px]">{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                    {!isSubmitting && <FaArrowRight size={12} className="lg:w-[12px] lg:h-[12px] ml-2 lg:ml-20" />}
                  </button>
                </form>
              </div>

              {/* Map Section - Below the blur card */}
              <div className="mt-4 lg:mt-6 xl:mt-8 w-full h-[15vh] lg:h-[20vh] xl:h-[22vh] rounded-md overflow-hidden bg-gray-200 border border-gray-300 relative">
                <Image
                  src="./mainScreen/675.png"
                  alt="Map"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="w-full py-4 lg:py-16 bg-white relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0"

        />
        <div className="max-w-[1300px] mx-auto px-4 lg:px-4 relative z-10">
          {/* Mobile Version */}
          <div className="block lg:hidden relative pt-4 pb-2" style={{ overflow: "hidden", width: "100%" }}>
            <div
              className="relative"
              style={{
                height: "auto",
                minHeight: "218px",
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
                          <a 
                            href={`tel:${office.phone.replace(/\s+/g, '')}`}
                            className="flex items-start gap-2 cursor-pointer hover:text-[#001730] transition-colors cursor-pointer"
                          >
                            <Phone className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="text-[0.7rem] break-all">{office.phone}</span>
                          </a>
                          <a 
                            href={`mailto:${office.email}`}
                            className="flex items-start gap-2 cursor-pointer hover:text-[#001730] transition-colors cursor-pointer"
                          >
                            <Mail className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="text-[0.7rem] break-all">{office.email}</span>
                          </a>
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
            <div className="flex justify-center mt-4 mb-2 gap-2">
              {Array.from({ length: offices.length }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setMobileOfficeIndex(index)}
                  className="relative flex items-center justify-center"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={false}
                    animate={{
                      scale: index === mobileOfficeIndex ? 1.2 : 1,
                      opacity: index === mobileOfficeIndex ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <motion.span
                    className={`
                      block rounded-full
                      ${index === mobileOfficeIndex
                        ? "bg-[#001730]"
                        : "bg-gray-400"
                      }
                    `}
                    animate={{
                      width: index === mobileOfficeIndex ? "24px" : "8px",
                      height: index === mobileOfficeIndex ? "8px" : "8px",
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
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
                          <a 
                            href={`tel:${office.phone.replace(/\s+/g, '')}`}
                            className="flex items-center gap-2 text-gray-700 text-sm hover:text-[#001730] transition-colors cursor-pointer"
                          >
                            <Phone className="w-4 h-4 text-gray-700" />
                            {office.phone}
                          </a>
                          <a 
                            href={`mailto:${office.email}`}
                            className="flex items-center gap-2 text-gray-700 text-sm hover:text-[#001730] transition-colors cursor-pointer"
                          >
                            <Mail className="w-4 h-4 text-gray-700" />
                            {office.email}
                          </a>
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
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: offices.length }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="relative flex items-center justify-center"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={false}
                    animate={{
                      scale: index === currentSlides ? 1.2 : 1,
                      opacity: index === currentSlides ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <motion.span
                    className={`
                      block rounded-full
                      ${index === currentSlides
                        ? "bg-[#001730]"
                        : "bg-gray-400"
                      }
                    `}
                    animate={{
                      width: index === currentSlides ? "24px" : "8px",
                      height: index === currentSlides ? "8px" : "8px",
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
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
