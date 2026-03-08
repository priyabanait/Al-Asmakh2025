"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Search, Mic, MapPin, ArrowDown, Bed, Bath, Square, ArrowRight, Leaf, Home, Map as MapIcon } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import DreamPropertySection from "./DreamPropertySection";

export default function Rent() {
  const [viewMode, setViewMode] = useState("LIST"); // "LIST" or "MAP"
  const plans = [
    {
      percent: "8%",
      title: "Essential Management",
      description: "Core property management services",
      features: [
        "Rent collection & financial reporting",
        "Basic maintenance coordination",
        "Tenant screening & lease management",
        "Monthly financial statements",
        "Legal compliance support",
      ],
      highlighted: false,
    },
    {
      percent: "10%",
      title: "Premium Management",
      description: "Core property management services",
      features: [
        "All Essential features",
        "24/7 emergency support",
        "Regular property inspections",
        "Vendor management & coordination",
        "Facility management services",
        "Quality control programs",
        "Tenant relations management",
      ],
      highlighted: true,
    },
    {
      percent: "12%",
      title: "Elite Management",
      description: "Comprehensive property management",
      features: [
        "All Premium features",
        "Dedicated property manager",
        "Concierge services",
        "Investment consulting",
        "Portfolio optimization",
        "Custom reporting & Priority support",
      ],
      highlighted: false,
    },
  ];
  const blogs = [




    {
      title: "Most influential marketing department in Qatari Real Estate",
      description: "Recognized for exceptional lead generation and conversion rates in the premium property sector.",
      image: "/rep_img/Award.png",
    },
    {
      title: "Most leads’ generating marketing department in Qatari Real Estate",
      description: "Recognized for exceptional lead generation and conversion rates in the premium property sector.",
      image: "/rep_img/Award.png",

    },
    {
      title: "13th Annual Luxury Lifestyle Awards 2021",
      description: "Recognized for exceptional lead generation and conversion rates in the premium property sector.",
      image: "/rep_img/Award.png",

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
        {/* Background Image */}
        <Image
                           src="/rep_img/Marketing.jpeg"

          alt="City Skyline"
          fill
          className="object-fill "
          priority
        />

        {/* Dark Overlay (optional if you want to dim background) */}
        <div className="absolute inset-0 " />

        {/* Left Aligned Box */}
        <div className="absolute left-4 md:left-8 lg:left-12 top-[55%] md:top-[56%] lg:top-[57%] transform -translate-y-1/2 z-20 w-[90%] md:w-[60%] lg:w-[60%]">
          <div className="glass-effect text-center rounded-lg shadow-lg p-4 sm:p-6 md:p-10 lg:text-left">

            {/* Title */}
            <h2 className="heading font-semibold text-[#001730] mb-3 sm:mb-4 lg:mr-60">
              PREMIUM PROPERTY MARKETING
            </h2>
            <div className=" h-[0.5px] bg-gray-300 my-3 sm:my-4 l"></div>
            {/* Subtitle */}
            <p className="subheading mb-10 font-semibold text-[#001730] lg:mr-40">
              We help premium properties stand out for the right reasons through thoughtful strategy, high-quality presentation, and campaigns that connect with qualified buyers and tenants.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:mr-40 text-center">
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">500+</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Increased Property Views</p>
              </div>

              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[140px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">60%</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Faster Luxury Sale Cycles</p>
              </div>

              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[140px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">25%</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Improved Sale Price Performance</p>
              </div>

              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[140px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">98%</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Client Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Contact Team Button - Below the box */}
          <div className="mt-4 lg:mt-6">
            <div className="flex-shrink-0 lg:mr-40 ">
              <button className="btn-details text-[12px]">
                <span>View Premium Portfolio</span>
                <FaArrowRight size={12} className="md:w-[14px] md:h-[14px] ml-4 md:ml-16" />
              </button>
            </div>
          </div>
        </div>

        {/* <div className="absolute right-0 bottom-0 h-full w-[40%] hidden md:block">
          <Image
                                       src="/rep_img/Marketing.jpeg"

            alt="Building"
            fill
            className="object-contain object-bottom"
            style={{ objectPosition: 'bottom' }}
          />
        </div> */}

        {/* 🔍 Search Bar (Half on BG, Half outside if needed) */}

      </section>


      <section className="w-full bg-gray-50 py-16 px-6 md:px-10">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl  text-[#001730] mb-2">
            OUR LUXURY MARKETING PROCESS
          </h2>
          <div className="w-[20%] h-[0.5px] bg-gray-300 my-4 mx-auto "></div>
          <p className="subheading text-gray-500">
            A premium process built for consistency, so every touchpoint supports your property's value.

          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  mx-auto">
          {/* Card 1 */}
          <div className="glass-effect rounded-lg shadow-sm hover:shadow-md transition-all p-6 bg-[#EEEEEE]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E8ECF5] text-[#001730] font-bold text-lg mr-3 overflow-hidden">
                <img
                  src="/Icon Container.png"   // 🔹 replace with your image path
                  alt="icon"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-[#001730] font-semibold text-lg">
                Strategic Analysis
              </h3>
            </div>
            <p className="list-disc list-inside text-gray-600 subheading space-y-1">
              We clarify your property's unique value, define the ideal audience, and shape the story that guides the campaign.

            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-effect rounded-lg shadow-sm hover:shadow-md transition-all p-6 bg-[#EEEEEE]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E8ECF5] text-[#001730] font-bold text-lg mr-3 overflow-hidden">
                <img
                  src="/Icon Container.png"   // 🔹 replace with your image path
                  alt="icon"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-[#001730] font-semibold text-lg">
                Premium Content Creation
              </h3>
            </div>
            <p className="list-disc list-inside text-gray-600 subheading space-y-1">
              Photography, video, and brand-aligned messaging that make key details easy to understand and easy to trust.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-effect rounded-lg shadow-sm hover:shadow-md transition-all p-6 bg-[#EEEEEE]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E8ECF5] text-[#001730] font-bold text-lg mr-3 overflow-hidden">
                <img
                  src="/Icon Container.png"   // 🔹 replace with your image path
                  alt="icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-[#001730] font-semibold text-lg">Multi-Channel Campaign</h3>
            </div>
            <p className="list-disc list-inside text-gray-600 subheading space-y-1">
              Carefully selected placements across platforms and networks to generate relevant interest and enquiries.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-effect rounded-lg shadow-sm hover:shadow-md transition-all p-6 bg-[#EEEEEE]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E8ECF5] text-[#001730] font-bold text-lg mr-3 overflow-hidden">
                <img
                  src="/Icon Container.png"   // 🔹 replace with your image path
                  alt="icon"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-[#001730] font-semibold text-lg">
                Performance Optimization
              </h3>
            </div>
            <p className="list-disc list-inside text-gray-600 subheading space-y-1">
              We review performance regularly and refine what's working to improve relevance, reach, and lead quality.
            </p>
          </div>





        </div>
      </section>




      {/* ---------- READY TO FIND SECTION ---------- */}


      {/* ---------- LIST AND MAP VIEW SECTION ---------- */}

      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-12 px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl text-[#001730] mb-2">
            HONOURS & AWARDS
          </h2>
          <div className="w-[30%] h-[0.5px] bg-gray-300 my-4 mx-auto "></div>
          <p className="subheading text-gray-500">
            Recognition for excellence in luxury real estate marketing.

          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full  lgpx-10 p-4">
          {blogs.map((blog, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Image Section with Overlapping Button and Text Overlay */}
              <div className="relative w-full h-[300px] md:h-[400px]">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-fill"
                />

                {/* EXPLORE Button */}


                {/* Text Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#001730]/50 backdrop-blur-sm z-10 transition-all duration-300 ease-in-out py-2 px-2 group-hover:pb-2">
                  <h3 className="text-white font-bold text-lg md:text-xl mb-0 group-hover:mb-3 transition-all duration-300">
                    {blog.title}
                  </h3>
                  <div className="w-[90%] h-[1px] bg-gray-400 my-0 group-hover:my-4 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="overflow-hidden max-h-0 group-hover:max-h-[200px] transition-all duration-300 ease-in-out">
                    <p className="text-white subheading leading-relaxed opacity-0 group-hover:opacity-90 transform translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300 ease-in-out pt-0 group-hover:pt-2">
                      {blog.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DreamPropertySection />
    </div>
  );
}

