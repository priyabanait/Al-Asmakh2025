"use client";

import React from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import DreamPropertySection from "../../../components/DreamPropertySection";
import FeaturedProperties from "../../../components/FeaturedProperties";

export default function  leaseServices() {

  return (
    <main className="min-h-screen relative">
      <Header />
      {/* ---------- HERO SECTION ---------- */}
      <section className="relative w-full bg-gray-200 min-h-screen flex items-center justify-center overflow-visible">
        {/* Background Image - Full Background */}
        <Image
                   src="/images_pages/services lease.png"

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
              YOUR TRUSTED<br />PARTNER IN PROPERTY SALES
            </h2>
            {/* Divider */}
            <div className="w-[80%] h-[0.5px] bg-gray-300 my-3 sm:my-4 lg:mr-40"></div>
            {/* Subtitle */}
            <p className="subheading mb-10 font-semibold text-[#001730] lg:mr-40">
              Buying or selling a property is a big decision. We simplify the journey through clear communication, market insights, and a dedicated team to manage every detail.
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
                <p className="subheading text-[#001730]">Successful Sales</p>
              </div>

              {/* Card 2 */}
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">30 Days</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Average Sale Timeline</p>
              </div>

              {/* Card 3 */}
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">98%</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Client Satisfaction</p>
              </div>

              {/* Card 4 */}
              <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                <p className="text-xl sm:text-2xl font-bold text-[#001730]">2.5M</p>
                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                <p className="subheading text-[#001730]">Average Sale Value</p>
              </div>

            </div>
          </div>


          {/* Contact Team Button - Below the box */}
          <div className="mt-4 lg:mt-6">
            <div className="flex-shrink-0 lg:mr-40">
              <button className="btn-details text-[12px]">
                <span>Speak to a Sales Advisor</span>
                <FaArrowRight size={12} className="md:w-[14px] md:h-[14px] ml-4 md:ml-16" />
              </button>
            </div>
          </div>
        </div>

      </section>


      {/* Featured Properties Section - Using proper FeaturedProperties component */}
      <section className="w-full bg-gray-50 py-8 px-6 md:px-10">
        <div className="text-center mb-8">
          <p className="subheading text-gray-600 max-w-3xl mx-auto">
            Explore a selection of homes and investment-ready properties currently available for lease. Compare key details, shortlist your favourites, and book a viewing when you're ready.
          </p>
        </div>
      </section>
      <FeaturedProperties 
        offeringType="lease"
        limit={4}
        status="published"
        viewAllLink="/listings/lease"
      />



      {/* ---------- READY TO FIND SECTION ---------- */}


      {/* ---------- LIST AND MAP VIEW SECTION ---------- */}
      <section className="w-full  py-16 px-6 md:px-20">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl text-[#001730]  mb-2">
            FULL-SERVICE SALES SUPPORT
          </h2>
          <div className="w-[30%] h-[0.5px] bg-gray-300  my-2  mx-auto md:my-3"></div>
          <p className="subheading text-gray-500">
            We help you make every move with confidence, from the first consultation to closing day. We provide support that keeps your process organised, transparent, and moving forward.
          </p>
        </div>

        {/* Service Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="glass-effect rounded-md p-6 bg-[#EEEEEE] shadow-md hover:shadow-xl transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Market Analysis</h3>
            <p className="subheading text-gray-600">
              Thorough market research and comparable insights to position your property effectively.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-effect rounded-md p-6  bg-[#EEEEEE] shadow-md hover:shadow-xl transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Expert Negotiation</h3>
            <p className="subheading text-gray-600">
              Skilled guidance to navigate offers and agree on terms that work for you.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-effect rounded-md p-6  bg-[#EEEEEE] shadow-md hover:shadow-xl transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Buyer Matching</h3>
            <p className="subheading text-gray-600">
              Targeted exposure and qualified buyer matching to keep the process focused.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-effect rounded-md p-6  bg-[#EEEEEE] shadow-md hover:shadow-xl transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Property Valuation</h3>
            <p className="subheading text-gray-600">
              Professional appraisal support informed by current market conditions.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-effect rounded-md p-6  bg-[#EEEEEE] shadow-md hover:shadow-xl transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Transaction Management</h3>
            <p className="subheading text-gray-600">
              End-to-end coordination from contract preparation through to completion.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glass-effect rounded-md p-6 shadow-md bg-[#EEEEEE] hover:shadow-xl transition-all">
            <h3 className="text-[#001730] font-semibold mb-2">Closing Support</h3>
            <p className="subheading text-gray-600">
              Practical support through the final steps to ensure a well-managed closing.
            </p>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      {/* <section className="w-full bg-gray-50 py-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
            <div className="flex-1 text-left">
              <h2 className="text-2xl md:text-3xl text-[#001730] mb-4 font-semibold">
                Ready to take the next step?
              </h2>
              <p className="subheading text-gray-600 max-w-2xl">
                If you're buying your next home or selling your current property, we're here to guide you with clear advice and responsive support. Share your goals and timeline, and we'll recommend the most suitable path forward.
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <button className="btn-details text-[12px] whitespace-nowrap">
                <span>Contact Us Today</span>
                <FaArrowRight size={12} className="md:w-[14px] md:h-[14px] ml-4 md:ml-16" />
              </button>
            </div>
          </div>
        </div>
      </section> */}

      <DreamPropertySection 
        title="Ready to Find Your Dream Property ?"
        description="If you're buying your next home or selling your current property, we're here to guide you with clear advice and responsive support. Share your goals and timeline, and we'll recommend the most suitable path forward."
        btnText="Contact Us Today"
        btnLink="/contact"
      />
   
    <Footer />
    </main>
  );
}

