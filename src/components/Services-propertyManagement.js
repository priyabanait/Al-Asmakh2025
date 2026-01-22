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
      description: "",
      features: [
        "Rent collection and financial reporting",
        "Maintenance requests coordination",
        "Tenant screening support and lease administration",
        "Monthly reporting",
        "Compliance support",
      ],
      highlighted: false,
    },
    {
      percent: "10%",
      title: "Premium Management",
      description: "",
      features: [
        "All Essential Management services",
        "24/7 emergency coverage",
        "Regular inspections and reporting",
        "Vendor management and coordination",
        "Facility services coordination",
        "Quality control programs",
        "Tenant relations oversight",
      ],
      highlighted: true,
    },
    {
      percent: "12%",
      title: "Elite Management",
      description: "",
      features: [
        "All Essential and Premium Management services",
        "Dedicated property manager",
        "Concierge support",
        "Expanded reporting and priority handling",
        "Property performance reviews and improvement recommendations",
        "Custom reporting and priority support",
      ],
      highlighted: false,
    },
  ];
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

  return (
    <div>
      {/* ---------- HERO SECTION ---------- */}
      <section className="relative w-full bg-gray-200 min-h-screen flex items-center justify-center overflow-visible">
        {/* Background Image - Full Background */}
        <Image
          src="/rep_img/propertyManage.png"
          alt="/"
          fill
          className="object-cover"
          priority
        />

        {/* Dark Overlay (optional if you want to dim background) */}
        <div className="absolute inset-0 " />

        {/* Left Aligned Box */}
        <div className="absolute left-4 md:left-8 lg:left-12 top-[55%] md:top-[56%] lg:top-[57%] transform -translate-y-1/2 z-20 w-[90%] md:w-[60%] lg:w-[60%]">
          <div className="glass-effect text-center rounded-lg shadow-lg p-4 sm:p-6 md:p-10 lg:text-left">

            {/* Title */}
            <h2 className="heading font-semibold text-[#001730] mb-3 sm:mb-4 lg:mr-40">
              THE SMARTER WAY TO<br />MANAGE YOUR PROPERTY IN QATAR
            </h2>
            {/* Divider */}
            <div className="w-[80%] h-[0.5px] bg-gray-300 my-3 sm:my-4 lg:mr-40"></div>
            {/* Subtitle */}
            <p className="subheading mb-10 font-semibold text-[#001730] lg:mr-40">
              We offer a more reliable, structured approach to managing your property, covering tenants, operations, reporting, and standards, so your asset stays well-run and well-presented.
            </p>

            {/* Stats Section */}
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 
                gap-y-12 gap-x-14 
                sm:gap-y-14 sm:gap-x-16
                md:gap-y-16 md:gap-x-18
                lg:gap-y-20 lg:gap-x-24
                lg:mr-[30%] 
                text-center">

              {/* Card 1 */}
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">500+</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Properties Managed</p>
              </div>

              {/* Card 2 */}
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">15%</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Average ROI Increase</p>
              </div>

              {/* Card 3 */}
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">98%</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Client Satisfaction</p>
              </div>

              {/* Card 4 */}
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">24/7</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Emergency Support</p>
              </div>

            </div>

          </div>

          {/* Contact Team Button - Below the box */}
          <div className="mt-4 lg:mt-6">
            <div className="flex-shrink-0 lg:mr-40">
              <button className="btn-details text-[12px]">
                <span>View Premium Portfolio</span>
                <FaArrowRight size={12} className="md:w-[14px] md:h-[14px] ml-4 md:ml-16" />
              </button>
            </div>
          </div>
        </div>

        {/* 🔍 Search Bar (Half on BG, Half outside if needed) */}

      </section>


      <section className="w-full bg-gray-50 py-16 px-6 md:px-10">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl text-[#001730] mb-2">
            OUR PROPERTY MANAGEMENT SERVICES
          </h2>
          <div className="w-[20%] h-[0.5px] bg-gray-300 my-4 mx-auto "></div>
          <p className="subheading text-gray-500">
            Comprehensive services designed to keep your property well-managed and well-presented.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mx-auto">
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
                Moving Coordination
              </h3>
            </div>
            <ul className="list-disc list-inside text-gray-600 subheading space-y-1">
              <li>Managed move-in/move-out scheduling and handovers</li>
              <li>Vacant unit preparation and readiness checks</li>
              <li>Inventory checklists for check-in/check-out</li>
              <li>Condition inspections after tenant vacancy</li>
            </ul>
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
                Financial Reporting & Budgets
              </h3>
            </div>
            <ul className="list-disc list-inside text-gray-600 subheading space-y-1">
              <li>Consistent owner reporting and financial visibility</li>
              <li>Monthly/quarterly statements and expense tracking</li>
              <li>Budget setup with variance monitoring</li>
              <li>Vendor sourcing and cost control coordination</li>
            </ul>
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
              <h3 className="text-[#001730] font-semibold text-lg">Lease Contracts</h3>
            </div>
            <ul className="list-disc list-inside text-gray-600 subheading space-y-1">
              <li>Drafting and managing leases, renewals, and notices</li>
              <li>Documentation control and compliance support</li>
              <li>Guidance through terminations and formal steps, when required</li>
              <li>Coordination with legal support as needed</li>
            </ul>
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
                Communication with Tenants
              </h3>
            </div>
            <ul className="list-disc list-inside text-gray-600 subheading space-y-1">
              <li>Tenant queries, follow-ups, and relationship management</li>
              <li>Deposit handling processes and documentation</li>
              <li>Clear communication of rules, regulations, and responsibilities</li>
              <li>Coordinating requirements with relevant third parties when needed</li>
            </ul>
          </div>

          {/* Card 5 */}
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
                Facility Management
              </h3>
            </div>
            <ul className="list-disc list-inside text-gray-600 subheading space-y-1">
              <li>Operational oversight for building systems and services</li>
              <li>Maintenance scheduling for HVAC, MEP, and lifts</li>
              <li>Housekeeping, façade cleaning, and pest control</li>
              <li>Common-area and pool maintenance coordination</li>
            </ul>
          </div>

          {/* Card 6 */}
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
                Quality Control
              </h3>
            </div>
            <ul className="list-disc list-inside text-gray-600 subheading space-y-1">
              <li>Routine inspections and service quality checks</li>
              <li>Preventive maintenance coordination and reporting</li>
              <li>Detailed documentation and continuous improvement</li>
              <li>Procedures aligned with AREDC Standards</li>
            </ul>
          </div>
        </div>
      </section>




      {/* ---------- READY TO FIND SECTION ---------- */}


      {/* ---------- LIST AND MAP VIEW SECTION ---------- */}

      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-12 px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl text-[#001730] mb-2">
            SELECT YOUR MANAGEMENT PLAN
          </h2>
          <div className="w-[30%] h-[0.5px] bg-gray-300 my-4 mx-auto "></div>
          <p className="subheading text-gray-500">
            Pick a level of service that fits your property and priorities, then scale up when needed.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md p-8 text-center transition-all duration-300 ${plan.highlighted
                ? "border-2 border-[#001730] shadow-xl scale-105"
                : "hover:shadow-lg"
                }`}
            >
              <div className="text-[#001730] font-bold text-3xl mb-1">{plan.percent}</div>
              <p className="text-gray-500 text-sm ">Per Month</p>
              <div className="w-[60%] h-[0.5px] bg-gray-300 my-4 mx-auto "></div>
              <h3 className="text-lg font-semibold text-[#001730] mb-6">{plan.title}</h3>

              <ul className="text-left text-gray-600 subheading space-y-2 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-[#001730] mr-2">•</span> {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-2.5 text-[12px] rounded-md text-white font-medium flex items-center justify-between px-6 gap-2 transition ${plan.highlighted
                  ? "bg-[#001730] hover:bg-[#0A1A36]"
                  : "bg-[#001730] hover:bg-[#0A1A36]"
                  }`}
              >
                Select Plan
                <FaArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <section className="w-full bg-gray-50 py-16 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl text-[#001730] mb-4 font-semibold">
            Ready for a smarter, easier way to manage your property?
          </h2>
          <p className="subheading text-gray-600 mb-8">
            Let our team handle day-to-day operations with consistent standards and clear reporting, so you can stay informed, stay compliant, and enjoy peace of mind.
          </p>
          <p className="subheading text-gray-600 mb-8">
            Share your property details and preferred service level, and we'll recommend the best next steps.
          </p>
          <button className="btn-details text-[12px]">
            <span>Contact Us Now</span>
            <FaArrowRight size={12} className="md:w-[14px] md:h-[14px] ml-4 md:ml-16" />
          </button>
        </div>
      </section>

      <DreamPropertySection />
    </div>
  );
}

