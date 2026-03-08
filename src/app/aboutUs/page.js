'use client'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Image from 'next/image'
import { useRef, useState, useEffect, useCallback } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowRight } from "react-icons/fa6";
import { useAlert } from '../../contexts/AlertContext'
import { getApiUrl } from '../../config/api'

// Timeline data
const timelineData = [
  {
    year: '1930',
    title: 'Our Story Begins',
    content: 'In the heart of old Doha, the Al Asmakh family enters real estate, providing practical property solutions and building a reputation for reliability in a young and rapidly changing city.',
    image: '/images/about-us/TIMELINE/1.jpg'
  },
  {
    year: '1970',
    title: 'Shaping Modern Homes',
    content: 'With Qatar\'s rapid development, Al Asmakh helps introduce modern residential living to new districts, creating homes that reflect evolving lifestyles and the needs of a growing workforce.',
    image: '/images/about-us/TIMELINE/2.jpg'
  },
  {
    year: '1993',
    title: 'From Enterprise to Institution',
    content: 'A new strategic direction under Ibrahim Hassan Al Asmakh transforms the company from a traditional family enterprise into a forward-looking developer with clearer structures, processes, and ambitions.',
    image: '/images/about-us/TIMELINE/3.jpg'
  },
  {
    year: '2001–2003',
    title: 'A Broader Role in Nation-Building',
    content: 'By serving in a senior leadership role within Qatar\'s tourism sector, Ibrahim Hassan Al Asmakh brings a valuable national-level perspective back to the business, strengthening its understanding of how real estate supports the wider economy.',
    image: '/images/about-us/TIMELINE/4.jpg'
  },
  {
    year: '2003–2010',
    title: 'Strength in Partnership',
    content: 'Becoming part of Regency Group Holding marks a milestone in the company\'s evolution, adding scale, stability, and shared expertise that help accelerate the development and management of key assets.',
    image: '/images/about-us/TIMELINE/5.jpg'
  },
  {
    year: '2010–Present',
    title: 'Developing with Qatar\'s Future in Mind',
    content: 'Aligned with Qatar National Vision 2030, the company continues to focus on thoughtfully designed, well-managed communities that serve residents, businesses, and partners today while remaining relevant for many more generations to come.',
    image: '/images/about-us/TIMELINE/6.jpg'
  }
];

const HERO_SLIDE = 0;
const TIMELINE_START = 1;
const TIMELINE_END = timelineData.length;
const FORM_SLIDE = timelineData.length + 1;
const TOTAL_SLIDES = timelineData.length + 2;

// Hero Section Component
const HeroSection = ({ isActive }) => {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
               src="/rep_img/About.png"
        alt="City Skyline"
        fill
        className="object-cover"
        priority
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-4 md:px-8">
        {/* Transparent Box for Heading */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 60 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="glass-effect rounded-md px-4 md:px-10 py-6 md:py-10 shadow-lg max-w-[900px] mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="heading text-[#10284C] font-semibold mb-2"
          >
            BUILDING LEGACY THAT LASTS
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: isActive ? 1 : 0, scaleX: isActive ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="w-[40%] h-[1px] mt-8 bg-gray-400 mb-3 md:mb-4 mx-auto origin-center"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="subheading text-[#10284C] font-medium"
          >
            Our enduring commitment to quality and service ensures that every property we offer stands as a testament to trust, innovation, and excellence.
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 mt-4 md:mt-10 mb-6 md:mb-10 px-2 md:px-0"
        >
          {[
            { value: "90+", label: "Years of Excellence" },
            { value: "$12B+", label: "In Rental Volume" },
            { value: "98%", label: "Client Satisfaction" },
            { value: "5000+", label: "Homes Sold" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 50 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.5 + index * 0.1,
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
              className="glass-effect rounded-md p-3 md:p-6 md:px-14 text-[#10284C] hover:shadow-lg transition-shadow"
            >
              <h2 className="text-base md:text-2xl font-semibold mb-1">
                {item.value}
              </h2>
              <div className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-[90%] h-[1px] bg-gray-400 my-2 md:my-3 md:mb-4 mx-auto" />
              <p className="subheading text-[#10284C]">
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[#10284C]/60 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <IoIosArrowDown size={24} className="text-[#10284C]/80" />
        </motion.div>
      </motion.div>
    </div>
  );
};

// Timeline Item Component
const TimelineItem = ({ item, index, isActive, isLastTimeline }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image with Ken Burns effect */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: isActive ? 1 : 1.1 }}
        transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
        className="absolute inset-0"
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority={index < 2}
        />
      </motion.div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50 z-[1]" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8 z-10">
        {/* Growing with Qatar Title - Only on first item */}
        {/* {index === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="mb-8 md:mb-12"
          >
            <h2 className="heading text-white font-medium text-[22px] mb-4 tracking-wide">
              Growing with Qatar
            </h2>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isActive ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="w-24 md:w-32 h-[2px] bg-white/60 mx-auto origin-center"
            />
          </motion.div>
        )} */}
        
        {/* Year */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
          transition={{ duration: 0.7, delay: index === 0 ? 0.3 : 0.1, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="flex items-center justify-center gap-4 mb-5"
        >
          {/* <motion.div 
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isActive ? 1 : 0 }}
            transition={{ duration: 0.5, delay: index === 0 ? 0.4 : 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="w-[2px] h-10 bg-white origin-bottom"
          /> */}
          <span className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wider">
            {item.year}
          </span>
          {/* <motion.div 
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isActive ? 1 : 0 }}
            transition={{ duration: 0.5, delay: index === 0 ? 0.4 : 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="w-[2px] h-10 bg-white origin-bottom"
          /> */}
        </motion.div>
        
        {/* Title */}
        <motion.h3 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
          transition={{ duration: 0.7, delay: index === 0 ? 0.4 : 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="heading text-white font-medium text-[22px] mb-4 tracking-wide"
        >
          {item.title}
        </motion.h3>
        
        {/* Divider */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0 }}
          transition={{ duration: 0.6, delay: index === 0 ? 0.5 : 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="w-16 md:w-24 h-[2px] bg-white/60 mb-5 origin-center"
        />
        
        {/* Content */}
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
          transition={{ duration: 0.7, delay: index === 0 ? 0.6 : 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="subheading text-white/90 text-[16px] leading-relaxed max-w-4xl mx-auto"
        >
          {item.content}
        </motion.p>
      </div>

      {/* Scroll Indicator - show on all timeline slides */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-red-500 text-xs tracking-widest uppercase">
          {isLastTimeline ? 'Continue' : 'Scroll'}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <IoIosArrowDown size={24} className="text-red-500" />
        </motion.div>
      </motion.div>
    </div>
  );
};

// Progress Indicator Component
const ProgressIndicator = ({ currentSlide, show }) => {
  // Only show dots for Hero + Timeline (not footer)
  const totalDots = timelineData.length + 1; // Hero + 6 timeline
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4 }}
          className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3"
        >
          {Array.from({ length: totalDots }).map((_, index) => {
            const label = index === 0 ? 'Home' : timelineData[index - 1].year;
            const isActive = currentSlide === index;
            
            return (
              <div
                key={index}
                className="group relative flex items-center justify-end"
              >
                {/* Label on hover */}
                <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs whitespace-nowrap bg-black/50 px-2 py-1 rounded">
                  {label}
                </span>
                
                {/* Dot */}
                <motion.div
                  animate={{
                    scale: isActive ? 1 : 0.6,
                    backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.4)'
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-3 h-3 rounded-full"
                />
                
                {/* Active line */}
                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute right-0 w-6 h-[2px] bg-white"
                    initial={false}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Slide Counter Component
const SlideCounter = ({ currentSlide, show }) => {
  // Don't count footer slide in display
  const displaySlide = Math.min(currentSlide + 1, timelineData.length + 1);
  const totalDisplay = timelineData.length + 1; // Hero + 6 timeline
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="fixed left-6 md:left-10 bottom-10 z-50 text-white/60 text-sm font-light tracking-widest"
        >
          <span className="text-white font-normal">{String(displaySlide).padStart(2, '0')}</span>
          <span className="mx-2">/</span>
          <span>{String(totalDisplay).padStart(2, '0')}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function AboutUsPage() {
  const [currentSlide, setCurrentSlide] = useState(HERO_SLIDE);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const containerRef = useRef(null);
  const { showSuccess, showError } = useAlert();

  const [countryCode, setCountryCode] = useState("+974"); // Default to Qatar
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryDropdownRef = useRef(null);
  
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
      const fullPhone = countryCode + (formData.phone || '').replace(/\D/g, '');

      // Prepare notes with source tracking
      let notes = formData.message || '';
      if (typeof window !== 'undefined' && window.location.href) {
        if (notes) notes += '\n\n';
        notes += `Source: About Us Page\nURL: ${window.location.href}`;
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
        setCountryCode('+974'); // Reset to default
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

  const showUI = currentSlide <= FORM_SLIDE;
  // Navigate to specific slide
  const navigateToSlide = useCallback((targetSlide) => {
    if (isAnimating) return;
    if (targetSlide < HERO_SLIDE || targetSlide > FORM_SLIDE) return;
    if (targetSlide === currentSlide) return;
    
    setIsAnimating(true);
    setCurrentSlide(targetSlide);
    
    // Reset animation lock
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  }, [isAnimating, currentSlide]);

  // Scroll handler
  useEffect(() => {
    let touchStartY = 0;
    let lastScrollTime = 0;
    const scrollCooldown = 1000;

    const handleWheel = (e) => {
      if (isAnimating) {
        e.preventDefault();
        return;
      }
      
      const now = Date.now();
      if (now - lastScrollTime < scrollCooldown) {
        e.preventDefault();
        return;
      }

      const delta = e.deltaY;
      
      // Threshold to prevent accidental scrolls
      if (Math.abs(delta) < 20) return;

      e.preventDefault();
      lastScrollTime = now;

      // Scrolling down
      if (delta > 0) {
        navigateToSlide(currentSlide + 1);
      }
      // Scrolling up
      else if (delta < 0) {
        navigateToSlide(currentSlide - 1);
      }
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (isAnimating) return;
      
      const now = Date.now();
      if (now - lastScrollTime < scrollCooldown) return;

      const touchEndY = e.changedTouches[0].clientY;
      const delta = touchStartY - touchEndY;

      // Threshold for touch
      if (Math.abs(delta) < 50) return;

      lastScrollTime = now;

      // Swiping up (scroll down)
      if (delta > 0) {
        navigateToSlide(currentSlide + 1);
      }
      // Swiping down (scroll up)
      else if (delta < 0) {
        navigateToSlide(currentSlide - 1);
      }
    };

    const handleKeyDown = (e) => {
      if (isAnimating) return;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        navigateToSlide(currentSlide + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        navigateToSlide(currentSlide - 1);
      }
    };

    // Prevent default scroll
    const preventScroll = (e) => {
      if (!showFooter) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    
    // Only prevent scroll when not on footer
    if (!showFooter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [currentSlide, isAnimating, navigateToSlide, showFooter]);

  return (
    <div ref={containerRef} className={`fixed inset-0 ${showFooter ? 'overflow-auto' : 'overflow-hidden'} bg-black`}>
      <Header />
      
      {/* Progress Indicator */}
      <ProgressIndicator currentSlide={currentSlide} show={showUI} />
      
      {/* Slide Counter */}
      <SlideCounter currentSlide={currentSlide} show={showUI} />

      {/* Main Slides Container */}
      <motion.div
        animate={{ y: showFooter ? `-${(FORM_SLIDE - 1) * 100}vh` : `-${currentSlide * 100}vh` }}
        transition={{ 
          duration: showFooter ? 0 : 0.9,
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
        className="w-full"
        style={{ height: showFooter ? 'auto' : `${TOTAL_SLIDES * 100}vh` }}
      >
        {/* Hero Section - Slide 0 */}
        <div className="h-screen w-full">
          <HeroSection isActive={currentSlide === HERO_SLIDE} />
        </div>

        {/* Timeline Slides - Slides 1-6 */}
        {timelineData.map((item, index) => (
          <div key={index} className="h-screen w-full">
            <TimelineItem
              item={item}
              index={index}
              isActive={currentSlide === TIMELINE_START + index}
              isLastTimeline={index === timelineData.length - 1}
            />
          </div>
        ))}

{/* Form Section - Slide 7 */}
<div className="w-full flex flex-col min-h-screen">
<section className="relative w-full flex items-center py-6 lg:py-12 min-h-screen">
        {/* Background Image */}
        <Image
                  src="/images_pages/aboutus.jpg"
                  alt="Background"
          fill
          className="object-cover"
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col lg:flex-row w-full h-full px-4 lg:px-14 items-center justify-center py-6 lg:py-0">
        

          {/* Right Side - Form Panel and Map */}
          <div className="lg:w-1/2 max-w-2xl w-full flex flex-col">
            {/* Form Panel - Translucent */}
            <div className="bg-blue-50/10 backdrop-blur-sm p-4 lg:p-6 lg:px-16 rounded-md shadow-xl relative overflow-visible">
              {/* Form Header */}
              <h3 className="text-[#001730] lg:px-10 text-xs lg:text-sm xl:text-base text-center font-medium mb-2 lg:mb-3">
                Fill out the form below and our experts will get back to you within 24 hour
            </h3>
              <div className="h-[0.5px] w-40 lg:w-60 bg-gray-300 mb-3 lg:mb-4 mx-auto"></div>


              <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
                {/* First Row: Name and Email */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                  <div>
                    <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Name</label>
                    <input
                      type="text"
                      placeholder="John Carter"
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
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730] h-[42px] lg:h-[45px]"
                    />
                  </div>
                </div>

                {/* Second Row: Phone and Property Type */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                  <div>
                    <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Phone</label>
                    {/* Combined Phone Input with Country Code */}
                    <div className="flex relative h-[42px] lg:h-[45px]" ref={countryDropdownRef}>
                      {/* Country Code Dropdown - Left Side */}
                      <div className="relative flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="h-full px-2 flex items-center justify-center gap-0.5 outline-none hover:bg-gray-50 bg-white border border-r-0 border-gray-300 rounded-l-md"
                          style={{ fontSize: '12px', color: "#001730", height: '100%' }}
                        >
                          <span>{countryCode}</span>
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
                                  setCountryCode(item.code);
                                  setShowCountryDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${
                                  countryCode === item.code ? 'bg-gray-100 font-semibold' : ''
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
                  <div>
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

          
          </div>
        </div>
      </section>

    
</div>
       
      </motion.div>

      {/* Back to Top Button - Only on Footer */}
      <AnimatePresence>
        {currentSlide === FORM_SLIDE && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigateToSlide(HERO_SLIDE)}
            className="fixed right-6 md:right-10 bottom-10 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm tracking-wide transition-colors flex items-center gap-2"
          >
            <IoIosArrowDown className="rotate-180" size={16} />
            Back to Top
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
