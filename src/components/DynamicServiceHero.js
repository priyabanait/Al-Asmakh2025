"use client";

import { useRef } from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import servicesData from "../data/servicesData.json";

// Animated Stats Card Component
function AnimatedStatsCard({ stat, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1 
      } : { 
        opacity: 0, 
        y: 50, 
        scale: 0.9 
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
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

export default function DynamicServiceHero({ serviceId = null }) {
  const router = useRouter();
  const allServices = servicesData.services;

  const handleButtonClick = (buttonLink) => {
    if (buttonLink) {
      router.push(buttonLink);
    }
  };

  return (
    <>
      {allServices.map((service, serviceIndex) => (
        <section 
          key={service.id}
          className="relative w-full bg-gray-200 min-h-screen flex items-center justify-center overflow-visible"
        >
          {/* Background Image or Video */}
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
              priority={serviceIndex === 0}
            />
          )}
          
          {/* Dark Overlay */}
          <div className="absolute inset-0" />

          {/* Content Box */}
          <div className="absolute left-4 md:left-8 lg:left-12 top-[55%] md:top-[56%] lg:top-[57%] transform -translate-y-1/2 z-20 w-[90%] md:w-[60%] lg:w-[60%]">
            <div className="glass-effect text-center rounded-lg shadow-lg p-4 sm:p-6 md:p-10 lg:text-left w-full max-w-5xl mx-auto mt-4 md:mt-6 lg:mt-8">
              {/* Title */}
              <h2 className="heading px-10 lg:px-0 font-semibold text-[#001730] mb-2 sm:mb-3 md:mb-4 lg:mr-40 whitespace-pre-line">
                {service.title}
              </h2>
              {/* Divider */}
              <div className="w-[80%] h-[0.5px] bg-gray-300 my-3 sm:my-4 lg:mr-40"></div>
              {/* Subtitle */}
              <p className="subheading mb-10 font-semibold text-[#001730] lg:mr-40">
                {service.description}
              </p>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-14 sm:gap-y-14 sm:gap-x-16 md:gap-y-16 md:gap-x-20 lg:gap-y-20 lg:gap-x-24 lg:mr-[30%] text-center">
                {service.stats.map((stat, index) => (
                  <AnimatedStatsCard key={index} stat={stat} index={index} />
                ))}
              </div>
            </div>

            {/* Contact Button */}
            <div className="mt-4 lg:mt-6">
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
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
