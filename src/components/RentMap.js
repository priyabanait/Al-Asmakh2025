"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Mic, MapPin, ArrowDown, Bed, Bath, Square, ArrowRight, Leaf, Home, Map as MapIcon, SlidersHorizontal } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import { FaMapLocationDot } from "react-icons/fa6";
import Link from "next/link";
import { FaList } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import DreamPropertySection from "./DreamPropertySection";

export default function Sale() {
  const [viewMode, setViewMode] = useState("LIST"); // "LIST" or "MAP"

  const properties = [
    {
      id: 1,
      title: "Floresta Tower",
      location: "The Pearl Island, Doha",
      bedrooms: 4,
      bathrooms: 2,
      area: "450",
      price: "280,000",
      image: "/div.property-thumbnail-wrapper.png",
    },
    {
      id: 2,
      title: "Floresta Tower",
      location: "The Pearl Island, Doha",
      bedrooms: 4,
      bathrooms: 2,
      area: "450",
      price: "280,000",
      image: "/div.property-thumbnail-wrapper.png",
    },
    {
      id: 3,
      title: "Floresta Tower",
      location: "The Pearl Island, Doha",
      bedrooms: 4,
      bathrooms: 2,
      area: "450",
      price: "280,000",
      image: "/div.property-thumbnail-wrapper.png",
    },
    {
      id: 4,
      title: "Floresta Tower",
      location: "The Pearl Island, Doha",
      bedrooms: 4,
      bathrooms: 2,
      area: "450",
      price: "280,000",
      image: "/div.property-thumbnail-wrapper.png",
    },
  ];

  return (
    <div>
      {/* ---------- HERO SECTION ---------- */}
      <section className="relative w-full min-h-[80vh] lg:min-h-[80vh] flex flex-col items-center justify-center overflow-visible">
        {/* Background Image */}
        <Image
          src="/images_pages/listings.png"
          alt="City Skyline"
          fill
          className="object-cover"
          priority
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0" />

        {/* 🔍 Search Bar (Half on BG, Half outside) */}
        {/* Mobile Version */}
        <div className="absolute left-1/2 bottom-0 mb-5 transform -translate-x-1/2 translate-y-1/2 z-20 w-[90%] lg:hidden">
          <div className="space-y-3">
            {/* Transaction Type Selector - Separate Box */}
            <div className="border border-white/10 backdrop-blur-sm bg-white/20  rounded-md border-[#8C8C8C66]  p-3 shadow-md">
              <div className="flex justify-center gap-2">
                <button className="px-8 py-1.5 rounded-md bg-[#001730] text-white font-medium shadow transition">
                  RENT
                </button>
                <button className="px-8 py-1.5 rounded-md bg-gray-400 text-white font-medium shadow transition">
                  BUY
                </button>
              </div>
            </div>

            {/* Search Bar - Separate Box */}
            <div className="bg-[#8C8C8C66] backdrop-blur-md border rounded-md border-[#8C8C8C66]  p-3 shadow-md">
              <div className="bg-white rounded-md shadow-sm flex items-center px-2 py-2">
                <button className="p-2 bg-[#001730] rounded-md mr-2 flex items-center justify-center h-8 w-8 flex-shrink-0">
                  <Search className="text-white h-4 w-4" />
                </button>
                <input
                  type="text"
                  placeholder="Type here .."
                  className="flex-1 text-gray-800 text-sm bg-transparent outline-none placeholder:text-gray-400"
                />
                <button className="p-2 bg-[#001730] rounded-md ml-2 flex items-center justify-center h-8 w-8 flex-shrink-0">
                  <Mic className="text-white h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons - Separate Box */}
            <div className="bg-[#8C8C8C66] backdrop-blur-md border rounded-md border-[#8C8C8C66]  p-3 shadow-md">
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-[#001730] text-white px-3 py-2.5 rounded-md font-medium shadow-lg text-sm">
                  <SlidersHorizontal className="h-4 w-4" />
                  <div className="h-4 w-[1px] bg-white"></div>
                  <span>Filters</span>
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#001730] text-white px-3 py-2.5 rounded-md font-medium shadow-lg text-sm">
                  <Image
                    src="/Icon (4).png"
                    alt="List Icon"
                    width={16}
                    height={16}
                    className="text-white"
                  />
                  <span>Map View</span>
                </button>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="text-center text-gray-600 text-sm font-medium pt-3  pb-2">
              Showing 10 of 50
            </div>
            <div className="w-[100%] h-[1px] bg-gray-300 my-2 mb-4  px-10"></div>
          </div>
        </div>

        {/* Desktop Version */}
        <div className="absolute left-1/2 bottom-20 mb-[6%]  transform -translate-x-1/2 translate-y-1/2 z-20 w-[70%] lg:w-[60%] hidden lg:block">
          <div className="border border-white/10 backdrop-blur-[10px] bg-white/30 rounded-md p-4 lg:p-6 shadow-lg">
            {/* Buttons Section */}
            <div className="flex justify-center gap-4 mb-4">

              <button className="px-20 py-1.5 rounded-md bg-[#001730] text-white font-medium shadow  transition">
                RENT
              </button>
              <button className="px-20 py-1.5 rounded-md bg-[#0B1F3A]/40 text-white  backdrop-blur-[20px]  border border-white/40
 font-medium shadow  transition text-[#001730]">
                BUY
              </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-md shadow-lg flex items-center px-4 mx-20 py-3">
              <div className="p-2 bg-[#001730] rounded-md mr-2 flex items-center justify-center h-[28px] w-[28px]">
                <Search className="text-white h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Explore and discover everything about our trusted agents..."
                className="flex-1 text-gray-500 text-[8px] lg:text-base bg-transparent outline-none
                 placeholder:text-[10px] lg:placeholder:text-base placeholder:text-gray-400"
              />
              <Mic className="text-gray-500 h-5 w-5 ml-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Map View */}
      <div className="block lg:hidden w-full mt-[130px] relative" style={{ height: "calc(100vh - 350px)", minHeight: "60vh" }}>
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

      <div className="hidden lg:flex w-full justify-center lg:pt-0 pt-0 lg:-mt-[2%] relative z-30">
        <div className="grid w-full border border-white/10 backdrop-blur-[10px] bg-white/20 p-4 lg:mx-10 rounded-md shadow-md 
                  gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

          {/* Filter Items */}
          {["Property Type", "Location", "Beds", "Baths", "Price"].map((label, index) => {
            // Get appropriate icon for each label
            const getIcon = () => {
              switch (label) {
                case "Property Type":
                  return <Home size={16} />;
                case "Location":
                  return <MapPin size={16} />;
                case "Beds":
                  return <Bed size={16} />;
                case "Baths":
                  return <Bath size={16} />;
                case "Price":
                  return <FaDollarSign size={16} />;
                default:
                  return null;
              }
            };

            return (
              <div
                key={index}
                className="flex items-center justify-between bg-[#0B1F3A] text-white px-4 py-1.5 
                     rounded-md shadow-lg hover:bg-[#001730] transition"
              >
                <div className="flex items-center gap-3">
                  {/* Icon + Divider */}
                  <div className="flex items-center gap-2">
                    {getIcon()}
                    <div className="h-5 w-[1px] bg-gray-400 opacity-60"></div>
                  </div>

                  {/* Label */}
                  <span className="text-[13px] ">{label}</span>
                </div>

                {/* Down Arrow */}
                <ArrowDown size={16} className="opacity-80" />
              </div>
            );
          })}
          {/* More Filters Button */}
          <button className="flex text-[13px] items-center 
          justify-center  bg-[#0B1F3A]/40 text-white px-6 py-2 
          rounded-md  font-medium shadow-lg hover:bg-[#5c1eff] transition">
            <span className="text-[13px]">+ More Filters</span>
          </button>
        </div>
      </div>

      {/* ---------- READY TO FIND SECTION ---------- */}
      {/* <div className="hidden lg:block w-[100%] h-[1px] bg-gray-300 my-4  px-10"></div> */}


      {/* ---------- LIST AND MAP VIEW SECTION ---------- */}
      <div className="hidden lg:block lg:py-10  py-4">



        {/* Header Bar */}
        <div className="bg-white border-gray-200 px-2   lg:px-4">
          <div className="hidden lg:flex max-w-full mb-5 bg-gray-50 mx-auto items-center gap-4">

            {/* Showing Count (Left) */}
            <div className="text-gray-400 text-sm font-medium whitespace-nowrap">
              Showing 5 of 50
            </div>

            {/* CENTER LINE */}
            <div className="flex-1 h-[1px] bg-gray-300"></div>

            {/* LIST / MAP Buttons (Right) */}
            <div className="flex items-center gap-2">
              {/* LIST Button */}
              <button
                onClick={() => setViewMode("LIST")}
                className={`flex items-center gap-1.5 px-6 py-2 rounded-md text-base font-semibold transition-all
    ${viewMode === "LIST"
                    ? "border border-white/40 backdrop-blur-md bg-[#e3e2d8]/40 text-[#001730] shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                    : "text-gray-600"
                  }`}
              >
                <FaList size={14} />
                <span className="text-[15px]">List</span>
              </button>


              {/* Divider */}
              <div className="h-4 w-[1px] bg-gray-300 mx-0.5"></div>

              {/* MAP Button */}
              <button
                onClick={() => setViewMode("MAP")}
                className={`flex items-center gap-1.5 px-6 py-2 rounded-md text-base font-semibold transition-all ${viewMode === "MAP"
                  ? "border border-white/40 backdrop-blur-md bg-[#e3e2d8]/40 text-[#001730] shadow-[0_4px_14px_rgba(0,0,0,0.15)]"

                  : "text-gray-600"
                  }`}
              >
                <FaMapLocationDot size={14} />
                <span className="text-[15px]">Map</span>
              </button>
            </div>

          </div>
        </div>

        {/* Main Content: List and Map */}
        {viewMode === "LIST" ? (
          <div
            className="grid gap-6 px-20 bg-[#F9F9F9] lg:grid-cols-3 xl:grid-cols-4 p-4"
          >
            {properties.map((property, index) => (
              <div
                key={index}
                className="w-full p-4 bg-[#E9E9E9] border  rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image Section */}
                <div className="relative w-full h-[220px]">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-fill rounded-md"
                  />
                </div>

                {/* Property Info */}
                <div className="pt-2">
                  <h3 className="font-semibold text-[#001730] text-base mb-1 leading-snug line-clamp-2">
                    {property.title}
                  </h3>

                  {/* Location */}
                 
<div className="flex items-center text-[#001730] text-sm mb-3">
                        <MapPin size={12} className="mr-2" />
                    <span>{property.location}</span>
                  </div>

                  {/* Bed/Bath/Area Info */}
                  <div className="grid grid-cols-3 gap-2 lg:gap-4 text-[#001730] text-sm mb-4">

                    {/* Beds */}
                    <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4  rounded-md justify-center">
                      <Image
                        src="/Icon (1).png"
                        alt="Beds"
                        width={16}
                        height={16}
                        className="w-[18px] h-[18px]"
                      />
                      <span className="text-xs lg:text-sm">{property.bedrooms}</span>
                    </div>

                    {/* Baths */}
                    <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4   rounded-md justify-center">
                      <Image
                        src="/Icon.png"
                        alt="Baths"
                        width={16}
                        height={16}
                        className="w-[18px] h-[18px]"
                      />
                      <span className="text-xs lg:text-sm">{property.bathrooms}</span>
                    </div>

                    {/* Area */}
                    <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4  rounded-md justify-center">
                      <Image
                        src="/Icon (2).png"
                        alt="Area"
                        width={16}
                        height={16}
                        className="w-[18px] h-[18px]"
                      />
                      <span className="text-xs lg:text-sm">{property.area}</span>
                    </div>

                  </div>

                  <div className="w-[100%]  h-[0.5px] bg-gray-300  my-3 " ></div>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-[#001730]">{property.price} QAR</p>

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
              </div>
            ))}
          </div>
        ) : (
          <div className="hidden lg:flex h-[calc(100vh-120px)]">
            {/* Left Section: Property List (50%) */}
            <div className="w-full lg:w-1/2 overflow-y-auto bg-white p-4">
              <div className="space-y-4">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-[#E9E9E9] rounded-md mt-2 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="flex p-4 rounded-md">
                      {/* Image Section - Left */}

                      {/* Image Section - Left */}
                      <div className="relative w-[320px] h-[192px] lg:w-[220px] lg:h-[192px] xl:w-[320px] xl:h-[192px]  flex-shrink-0">
                        <Image
                          src={property.image}
                          alt={property.title}
                          fill
                          className="object-cover rounded-md"
                        />

                      </div>


                      {/* Details Section - Right */}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-[#001730] mb-1">
                            {property.title}
                          </h3>
                         
<div className="flex items-center text-[#001730] text-sm mb-3">
                        <MapPin size={12} className="mr-2" />
                            <span>{property.location}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 lg:gap-4 text-[#001730] text-sm mb-4">

                            {/* Beds */}
                            <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4  rounded-md justify-center">
                              <Image
                                src="/Icon (1).png"
                                alt="Beds"
                                width={16}
                                height={16}
                                className="w-[18px] h-[18px]"
                              />
                              <span className="text-xs lg:text-sm">{property.bedrooms}</span>
                            </div>

                            {/* Baths */}
                            <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4   rounded-md justify-center">
                              <Image
                                src="/Icon.png"
                                alt="Baths"
                                width={16}
                                height={16}
                                className="w-[18px] h-[18px]"
                              />
                              <span className="text-xs lg:text-sm">{property.bathrooms}</span>
                            </div>

                            {/* Area */}
                            <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4  rounded-md justify-center">
                              <Image
                                src="/Icon (2).png"
                                alt="Area"
                                width={16}
                                height={16}
                                className="w-[18px] h-[18px]"
                              />
                              <span className="text-xs lg:text-sm">{property.area}</span>
                            </div>

                          </div>
                          <div className="w-[100%]  h-[0.5px] bg-gray-300 my-3"></div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-lg font-bold text-[#001730] m-0">
                            {property.price} QAR
                          </p>
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
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Properties Button */}
              <div className="mt-6 mb-4">
                <button className="w-full bg-[#001730] text-white py-3 rounded-md text-[12px] hover:bg-[#002d52] transition-colors flex items-center justify-between px-8">
                  <span>Load More Properties</span>
                  <ArrowRight size={18} />
                </button>
              </div>

            </div>

            {/* Right Section: Map (50%) */}
            <div className="hidden lg:block w-1/2 relative mt-6 bg-gray-200">
              {/* Map Container */}
              <div className="w-full h-full relative">
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



                {/* Zoom Controls */}
                <div className="absolute top-4 right-4 bg-white rounded-md shadow-lg flex flex-col z-10">
                  <button className="px-3 py-2 border-b border-gray-200 hover:bg-gray-50">
                    <span className="text-lg font-semibold">+</span>
                  </button>
                  <button className="px-3 py-2 hover:bg-gray-50">
                    <span className="text-lg font-semibold">-</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <DreamPropertySection />
    </div>
  );
}
