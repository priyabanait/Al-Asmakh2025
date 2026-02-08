"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import { IoIosArrowDown } from 'react-icons/io';
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import servicesData from "../data/servicesData.json";

// Animated Stats Card Component
function AnimatedStatsCard({ stat, index, isActive }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0, 
        y: isActive ? 0 : 50, 
        scale: isActive ? 1 : 0.9 
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      whileHover={{
        scale: 1.1,
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px] cursor-pointer"
    >
      <p className="text-xl lg:text-2xl font-bold text-[#001730]">
        {stat.value}
      </p>
      <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
      <p className="subheading text-[#001730]">{stat.label}</p>
    </motion.div>
  );
}

// Progress Indicator Component
const ProgressIndicator = ({ currentSlide, totalSlides, show }) => {
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
          {Array.from({ length: totalSlides }).map((_, index) => {
            const isActive = currentSlide === index;
            
            return (
              <div
                key={index}
                className="group relative flex items-center justify-end"
              >
                {/* Label on hover */}
                <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs whitespace-nowrap bg-black/50 px-2 py-1 rounded">
                  {index + 1}
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
const SlideCounter = ({ currentSlide, totalSlides, show }) => {
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
          <span className="text-white font-normal">{String(currentSlide + 1).padStart(2, '0')}</span>
          <span className="mx-2">/</span>
          <span>{String(totalSlides).padStart(2, '0')}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Service Slide Component
const ServiceSlide = ({ service, index, isActive, isLast }) => {
  const router = useRouter();

  const handleButtonClick = (buttonLink) => {
    if (buttonLink) {
      router.push(buttonLink);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image or Video with Ken Burns effect */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: isActive ? 1 : 1.1 }}
        transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
        className="absolute inset-0"
      >
        {service.backgroundVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={service.backgroundVideo} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={service.backgroundImage || "/images_pages/services lease.png"}
            alt={`${service.title} Background`}
            fill
            className="object-cover"
            sizes="100vw"
            priority={index < 2}
          />
        )}
      </motion.div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50 z-[1]" />

      {/* Content Box */}
      <div className="absolute left-4 md:left-8 lg:left-12 top-[55%] md:top-[56%] lg:top-[57%] transform -translate-y-1/2 z-20 w-[90%] md:w-[60%] lg:w-[60%]">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="glass-effect text-center rounded-lg shadow-lg p-4 sm:p-6 md:p-10 lg:text-left w-full max-w-5xl mx-auto mt-4 md:mt-6 lg:mt-8"
        >
          {/* Title */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="heading px-10 lg:px-0 font-semibold text-[#001730] mb-2 sm:mb-3 md:mb-4 lg:mr-40 whitespace-pre-line"
          >
            {service.title}
          </motion.h2>
          
          {/* Divider */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isActive ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="w-[80%] h-[0.5px] bg-gray-300 my-3 sm:my-4 lg:mr-40 origin-center"
          />
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="subheading mb-10 font-semibold text-[#001730] lg:mr-40"
          >
            {service.description}
          </motion.p>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-14 sm:gap-y-14 sm:gap-x-16 md:gap-y-16 md:gap-x-20 lg:gap-y-20 lg:gap-x-24 lg:mr-[30%] text-center"
          >
            {service.stats.map((stat, statIndex) => (
              <AnimatedStatsCard key={statIndex} stat={stat} index={statIndex} isActive={isActive} />
            ))}
          </motion.div>
        </motion.div>

        {/* Contact Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="mt-4 lg:mt-6"
        >
          <div className="flex-shrink-0 lg:mr-40">
            <button
              onClick={() => handleButtonClick(service.buttonLink)}
              className="btn-details text-[12px] cursor-pointer"
            >
              <span>{service.buttonText}</span>
              <FaArrowRight
                size={12}
                className="md:w-[14px] md:h-[14px] ml-4 md:ml-16"
              />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white text-xs tracking-widest uppercase">
          {isLast ? 'Continue' : 'Scroll'}
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

export default function DynamicServiceHero({ serviceId = null }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  const allServices = servicesData.services;
  
  // Filter services based on serviceId
  const servicesToShow = serviceId 
    ? allServices.filter(service => service.id === serviceId)
    : allServices;

  const TOTAL_SLIDES = servicesToShow.length;

  // Navigate to specific slide
  const navigateToSlide = useCallback((targetSlide) => {
    if (isAnimating) return;
    if (targetSlide < 0 || targetSlide >= TOTAL_SLIDES) return;
    if (targetSlide === currentSlide) return;
    
    setIsAnimating(true);
    setCurrentSlide(targetSlide);
    
    // Reset animation lock
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  }, [isAnimating, currentSlide, TOTAL_SLIDES]);

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

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [currentSlide, isAnimating, navigateToSlide]);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden bg-black z-40">
      {/* Progress Indicator */}
      <ProgressIndicator currentSlide={currentSlide} totalSlides={TOTAL_SLIDES} show={TOTAL_SLIDES > 1} />
      
      {/* Slide Counter */}
      <SlideCounter currentSlide={currentSlide} totalSlides={TOTAL_SLIDES} show={TOTAL_SLIDES > 1} />

      {/* Main Slides Container */}
      <motion.div
        animate={{ y: `-${currentSlide * 100}vh` }}
        transition={{ 
          duration: 0.9,
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
        className="w-full"
        style={{ height: `${TOTAL_SLIDES * 100}vh` }}
      >
        {/* Service Slides */}
        {servicesToShow.map((service, index) => (
          <div key={service.id} className="h-screen w-full">
            <ServiceSlide
              service={service}
              index={index}
              isActive={currentSlide === index}
              isLast={index === servicesToShow.length - 1}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
