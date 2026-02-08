"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Mic, MapPin, ArrowDown, Bed, Bath, Square, ArrowRight, Leaf, Home, Map as MapIcon, Check, SlidersHorizontal } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import { FaList } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { Calendar, Building2 } from "lucide-react";
import Link from "next/link";
import DreamPropertySection from "./DreamPropertySection";
export default function Commercial() {
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
  const properties = [
    {
      id: 1,
      title: "Pearl Towers",
      location: "The Pearl-Qatar",
      year: "2023",
      units: "120",
      status: "100% Completed",
      statusType: "completed",
      price: "QAR 800,000",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Pearl Towers",
      location: "The Pearl-Qatar",
      year: "2023",
      units: "120",
      status: "100% Completed",
      statusType: "completed",
      price: "QAR 800,000",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Pearl Towers",
      location: "The Pearl-Qatar",
      year: "2023",
      units: "120",
      status: "30% Ongoing",
      statusType: "ongoing",
      price: "QAR 800,000",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    },
  ];



  return (
    <div>
      {/* ---------- HERO SECTION ---------- */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[85vh] flex flex-col items-center justify-center overflow-visible">
        {/* Background Image */}
        <Image
          src="/c4630f1da5043e1a5c0d91a308c6487bfbad67a8.jpg"
          alt="City Skyline"
          fill
          className="object-cover"
          priority
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0" />

        {/* 🔍 Search Bar (Half on BG, Half outside) */}
        <div className="absolute left-1/2 lg:bottom-[228px] bottom-56 shadow-md transform -translate-x-1/2 translate-y-1/2 z-20 w-[90%] lg:w-[50%] px-4 lg:px-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shadow-md lg:gap-6  mb-10 lg:mb-10">
            {[
              { value: "34", label: "Total Projects" },
              { value: "16", label: "Completed " },
              { value: "02", label: "Ongoing" },
              { value: "05", label: "Upcoming" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center  border border-white/10 backdrop-blur-[10px] bg-white/20  rounded-md p-3  lg:p-6 text-white h-28 lg:h-32"
              >
                <h2 className="text-lg  lg:text-2xl font-semibold mb-2">
                  {item.value}
                </h2>
                <div className="w-[60%] h-[0.5px] bg-gray-300 lg:mb-2"></div>
                <p className="text-white text-[10px] lg:text-sm text-center">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>




        {/* Desktop Filter Items - Moved to bottom of hero */}
        <div className="hidden lg:flex absolute w-full justify-center bottom-10 lg:bottom-[-32px] z-20">
          <div className="flex w-full border border-white/10 backdrop-blur-[10px] bg-white/20 lg:mx-10 p-4 rounded-md shadow-md 
                  gap-4 justify-center items-center">
            {/* Filter Items */}
            {["Property Type", "Location", "Status", "Date"].map((label, index) => {
              // Get appropriate icon for each label
              const getIcon = () => {
                switch (label) {
                  case "Property Type":
                    return <Home size={16} />;
                  case "Location":
                    return <MapPin size={16} />;
                  case "Status":
                    return <Check size={16} />;
                  case "Date":
                    return <Calendar size={16} />;
                  default:
                    return <MapPin size={16} />;
                }
              };

              return (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#0B1F3A] text-white px-8 py-2 w-full max-w-[250px]
                       rounded-md shadow-lg hover:bg-[#001730] transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon + Divider */}
                    <div className="flex items-center gap-2">
                      {getIcon()}
                      <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                    </div>

                    {/* Label */}
                    <span className="text-[13px]">{label}</span>
                  </div>

                  {/* Down Arrow */}
                  <ArrowDown size={16} className="opacity-80" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Filters Button - Absolute positioned in hero section */}
        <div className="absolute left-1/2 bottom-[50px] mb-4 transform -translate-x-1/2 z-20 w-[100%] px-4 lg:hidden">
          <div ref={filtersRef} className="flex flex-col gap-3 bg-white/20 backdrop-blur-[10px] border border-white/10 p-3 px-10  rounded-md shadow-md">
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
                {["Property Type", "Location", "Status", "Date"].map((label, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#0B1F3A] text-white px-4 py-3 rounded-md w-full shadow-lg hover:bg-[#001730] transition"
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon + Divider */}
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                      </div>

                      {/* Label */}
                      <span className="text-sm font-medium">{label}</span>
                    </div>

                    {/* Down Arrow */}
                    <ArrowDown size={16} className="opacity-80" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* LUXURY/COMMERCIAL/INDUSTRIAL Box - Moved to top after section */}
      <div className="w-full flex justify-center px-4 lg:px-40 lg:pt-0 pt-0 lg:-mt-[145px] lg:mb-8 relative z-50">
        <div
          className="
      grid w-full overflow-x-auto lg:overflow-visible
      border border-white/20 backdrop-blur-[10px] lg:mx-24 bg-[#8C8C8C66]
      p-2 lg:p-4 lg:px-4 rounded-md shadow-md gap-2 lg:gap-3
      grid-cols-3  lg:grid-cols-3
      justify-center 
    "
        >
          {["LUXURY", "COMMERCIAL", "INDUSTRIAL"].map((label, index) => (
            <div
              key={index}
              className="
          flex items-center justify-center bg-[#0B1F3A] text-white
          px-4 py-1.5 rounded-md shadow-lg hover:bg-[#001730] transition
        "
            >
              <span className="text-xs lg:text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>


      {/* ---------- READY TO FIND SECTION ---------- */}
      {/* <div className="hidden lg:block w-[100%] h-[1px] bg-gray-300 my-4  px-10"></div> */}


      {/* ---------- LIST AND MAP VIEW SECTION ---------- */}
      <div className="hidden lg:block lg:py-28 py-4">



        {/* Header Bar */}
        <div className="bg-white border-gray-200 px-2   lg:px-6">
          <div className="hidden lg:flex max-w-full mb-6 bg-gray-50 mx-auto items-center gap-4">

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

        {/* Main Content: List and Map */}
        {viewMode === "LIST" ? (
          <div className="grid grid-cols-1 mt-5 lg:mt-5 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 px-4   lg:px-10 xl:px-20 p-4 lg:p-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-gray-100 rounded-md  shadow-md "
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-80 lg:h-80 object-cover"
                  />

                  {/* Top Labels */}
                  <div className="absolute top-2 lg:top-3 right-2 lg:right-3 flex flex-wrap gap-1 lg:gap-2">
                    <span className="bg-[#8C8C8C66] text-white text-[10px] lg:text-xs px-2 py-1 rounded-md">
                      Completed
                    </span>
                    <span className="bg-[#8C8C8C66] text-white text-[10px] lg:text-xs px-2 py-1 rounded-md">
                      Commercial
                    </span>
                  </div>

                  {/* Title + Location Overlay */}
                  <div className="absolute backdrop-blur-md bg-gradient-to-b from-gray-100/20 to-gray-100 shadow-md bottom-0 left-0 right-0 p-3 lg:p-4">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
                      <h3 className="text-base lg:text-xl font-semibold text-[#001730] truncate w-full lg:w-auto">
                        {property.title}
                      </h3>

                      <div className="flex items-center text-[#001730] text-xs lg:text-sm flex-shrink-0">
                        <MapPin size={12} className="mr-1" />
                        <span className="truncate">{property.location}</span>
                      </div>
                    </div>

                    <div className="w-[60%] h-[1px] bg-gray-500 my-2"></div>

                    <p className="text-xs lg:text-sm text-[#001730] leading-snug">
                      Luxury residential towers offering stunning sea views and premium
                      residential, commercial, and leisure facilities.
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="">

                  {/* Info Row — GRID RESPONSIVE */}
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-1 mt-2 ">

                    {/* Year Box */}
                    <div
                      className="
flex items-center gap-2
bg-gray-50 border border-gray-200 shadow-sm 
rounded-md px-2 py-2
"
                    >
                      <img
                        src="/Time.png"
                        className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5object-contain"
                      />
                      <span className="lg:text-xs xl:text-sm font-semibold text-[#001730]">
                        {property.year}
                      </span>
                    </div>

                    {/* Units Box */}
                    <div
                      className="
flex items-center gap-2
bg-white border border-gray-200 shadow-sm 
rounded-md px-2 py-2
"
                    >
                      <img
                        src="/3_Icons Used_Project Dvt 1 (1).png"
                        className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5object-contain"
                      />
                      <span className="lg:text-xs xl:text-sm font-semibold text-[#001730]">
                        {property.units} <span className='text-xs text-gray-500'>Units</span>
                      </span>
                    </div>

                    {/* Status Box */}
                    <div
                      className="
flex flex-col justify-center
bg-white border border-gray-200 shadow-sm 
rounded-md px-3 py-2
w-fit
"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>

                        <span className="text-xs font-semibold">100%</span>
                        <span className="text-xs text-gray-500">Completed</span>
                      </div>

                      <div className="w-full h-1 bg-green-200 rounded-full mt-1">
                        <div className="w-full h-full bg-green-500 rounded-full"></div>
                      </div>
                    </div>

                  </div>




                  {/* TAGS — GRID RESPONSIVE */}
                  {/* TAGS — GRID RESPONSIVE */}
                  <div className='p-2 shadow-md bg-gray-50 rounded-md mt-2'>
                    <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-1 ">

                      {/* Box 1 */}
                      <div className="bg-gray-300 text-white flex items-center justify-center text-center flex-wrap border border-gray-200 shadow-sm rounded-md px-2 py-2 text-[0.6rem] font-semibold">
                        Smart City
                      </div>

                      {/* Box 2 */}
                      <div className="bg-gray-300 text-white flex items-center justify-center text-center flex-wrap border border-gray-200 shadow-sm rounded-md px-2 py-2 text-[0.6rem] font-semibold">
                        Private Beach Access
                      </div>

                      {/* Box 3 */}
                      <div className="bg-gray-300 text-white flex items-center justify-center text-center flex-wrap border border-gray-200 shadow-sm rounded-md px-2 py-2 text-[0.6rem] font-semibold">
                        Concierge Service
                      </div>

                      {/* Small +1 box */}
                      <div className="bg-gray-300 text-white flex items-center justify-center text-center border border-gray-200 shadow-sm rounded-md px-2 py-2 text-[0.6rem] font-semibold w-fit">
                        +1
                      </div>

                    </div>
                  </div>






                  {/* Map */}
                  <img
                    src="/div.property-thumbnail-wrapper (2).png"
                    className="w-full h-20  mt-3 object-cover"
                  />
                </div>


                {/* Footer */}
                <div className="bg-gray-100 border-t border-gray-200 px-3 lg:px-4 py-2 lg:py-3 flex justify-between items-center rounded-b-xl">
                  <div>
                    <p className="text-[10px] lg:text-xs text-gray-500">Starting at</p>
                    <p className="text-base lg:text-lg font-semibold text-[#001730]">
                      {property.price}
                    </p>
                  </div>


                  <button className="bg-[#001730] text-white text-[12px] font-medium px-3 md:px-4 lg:px-5 xl:px-5 2xl:px-6 3xl:px-7 4xl:px-8 5xl:px-10 py-1.5  lg:py-2  rounded-md flex items-center justify-between shadow-lg transition-all duration-300 hover:bg-[#002d52]">
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
            ))}
          </div>
        ) : (
          /* MAP View */
          <div className="hidden lg:block w-full mt-6 relative" style={{ height: "calc(100vh - 200px)", minHeight: "60vh" }}>
            {/* Los Angeles Map */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423283.4355503344!2d-118.69192047499999!3d34.02016129999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>

            {/* Zoom Controls - Bottom Right */}
            <div className="absolute bottom-4 right-4 bg-white rounded-md shadow-lg flex flex-col z-10">
              <button className="px-3 py-2 border-b border-gray-200 hover:bg-gray-50">
                <span className="text-lg font-semibold">+</span>
              </button>
              <button className="px-3 py-2 hover:bg-gray-50">
                <span className="text-lg font-semibold">-</span>
              </button>
            </div>
          </div>
        )}
      </div>


      <DreamPropertySection />
    </div>
  );
}
