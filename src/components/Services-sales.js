"use client";

import React from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";

import DreamPropertySection from "./DreamPropertySection";
import FeaturedProperties from "./FeaturedProperties";

export default function Rent() {

  return (
    <div>
      {/* ---------- HERO SECTION ---------- */}
      <section className="relative w-full bg-gray-200 min-h-screen flex items-center justify-center overflow-visible">
        {/* Background Image - Full Background */}
        <Image
          src="/rep_img/sales.png"
          alt="City Skyline"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay (optional if you want to dim background) */}
        <div className="absolute inset-0 " />

        {/* Left Aligned Box */}
        <div className="absolute left-4 md:left-8 lg:left-12 top-[55%] md:top-[56%] lg:top-[57%] transform -translate-y-1/2 z-20 w-[90%] md:w-[60%] lg:w-[60%]">
          <div className="glass-effect text-center rounded-lg shadow-lg p-4 sm:p-6 md:p-10 lg:text-left w-full max-w-5xl mx-auto mt-4 md:mt-6 lg:mt-8">

            {/* Title */}
            <h2 className="heading px-10 lg:px-0 font-semibold text-[#001730] mb-2 sm:mb-3 md:mb-4 lg:mr-40">
              EXPERT REAL ESTATE SALES
            </h2>
            {/* Divider */}
            <div className="w-[80%] h-[0.5px] bg-gray-300 my-3 sm:my-4 lg:mr-40"></div>
            {/* Subtitle */}
            <p className="subheading mb-10 font-semibold text-[#001730] lg:mr-40">
              Whether buying or selling, our experienced team provides personalized
              service and market expertise to achieve your real estate goals.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 
                gap-y-12 gap-x-14 
                sm:gap-y-14 sm:gap-x-16
                md:gap-y-16 md:gap-x-20
                lg:gap-y-20 lg:gap-x-24
                lg:mr-[30%] 
                text-center">

              {/* Card 1 */}
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl lg:text-2xl font-bold text-[#001730]">500+</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Properties Sold</p>
              </div>

              {/* Card 2 */}
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">30</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Days Average Sale</p>
              </div>

              {/* Card 3 */}
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">98%</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Client Satisfaction</p>
              </div>

              {/* Card 4 */}
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">$2.5M</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Average Sale Price</p>
              </div>

            </div>
          </div>


          {/* Contact Team Button - Below the box */}
          <div className="w-full max-w-5xl mx-auto mt-4 lg:mt-6">

            <button className="bg-[#001730] w-[24%] text-white px-6 py-4 rounded-md font-medium text-[12px] lg:text-[12px] hover:bg-[#002d52] transition-all duration-300 flex items-center justify-between shadow-lg">
              <span>Contact Team</span>
              <FaArrowRight size={16} />
            </button>

          </div>
        </div>

      </section>


      {/* Featured Properties Section - Using FeaturedProperties component with sales filter */}
      <FeaturedProperties 
        priceType="sale"
        limit={4}
        status="published"
        viewAllLink="/listings/sale"
      />



      {/* ---------- READY TO FIND SECTION ---------- */}


      {/* ---------- LIST AND MAP VIEW SECTION ---------- */}
      <section className="w-full  py-16 px-6 md:px-20">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl text-[#001730]  mb-2">
            COMPREHENSIVE SALES SERVICES
          </h2>
          <div className="w-[30%] h-[0.5px] bg-gray-300  my-2  mx-auto md:my-3"></div>
          <p className="subheading text-gray-500">
            From initial consultation to closing, we provide full-service real estate sales support.
          </p>
        </div>

        {/* Service Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="glass-effect rounded-md p-6 bg-[#EEEEEE] shadow-md hover:shadow-xl transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Market Analysis</h3>
            <p className="subheading text-gray-600">
              Comprehensive market research and competitive analysis to price your property optimally.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-effect rounded-md p-6  bg-[#EEEEEE] shadow-md hover:shadow-xl transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Property Valuation</h3>
            <p className="subheading text-gray-600">
              Professional property appraisal and valuation services using latest market data.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-effect rounded-md p-6  bg-[#EEEEEE] shadow-md hover:shadow-xl transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Expert Negotiation</h3>
            <p className="subheading text-gray-600">
              Skilled negotiation to secure the best possible terms for buyers and sellers.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-effect rounded-md p-6  bg-[#EEEEEE] shadow-md hover:shadow-xl transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Transaction Management</h3>
            <p className="subheading text-gray-600">
              Complete transaction coordination from contract to closing with legal support.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-effect rounded-md p-6  bg-[#EEEEEE] shadow-md hover:shadow-xl transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Buyer Matching</h3>
            <p className="subheading text-gray-600">
              Extensive network and marketing to connect sellers with qualified buyers.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glass-effect rounded-md p-6 shadow-md bg-[#EEEEEE] hover:shadow-xl transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Closing Support</h3>
            <p className="subheading text-gray-600">
              Full support through the closing process ensuring smooth transactions.
            </p>
          </div>
        </div>
      </section>


      <DreamPropertySection />

    </div>
  );
}

