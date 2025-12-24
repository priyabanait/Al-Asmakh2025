"use client";

import React from 'react'
import { CircleDot } from "lucide-react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import DreamPropertySection from "./DreamPropertySection";

function AboutUs() {

  return (
    <div>
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-visible">
        {/* Background Image */}
        <Image
          src="/64f1105774e6cfad5b7a1de490c1415c3d850ec4.jpg"
          alt="City Skyline"
          fill
          className="object-cover"
          priority
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 " />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-4 md:px-8 mt-8 md:mt-36">
          {/* Transparent Box for Heading */}
          <div className="glass-effect rounded-md px-4 md:px-10 py-6 md:py-10 shadow-lg max-w-[900px] mx-auto">
            <h1 className="heading text-[#001730]  mb-2">
              BUILDING LEGACY THAT LASTS
            </h1>
            <div className="w-[40%] sm:w-[40%] md:w-[40%] lg:w-[40%] h-[0.5px]  mt-8 bg-gray-300 mb-3 md:mb-4 mx-auto"></div>
            <p className="subheading text-[#001730] font-medium">
              Our enduring commitment to quality and service ensures that every property we offer stands as a testament to trust, innovation, and excellence.

            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 mt-4 md:mt-10 mb-6 md:mb-10 px-2 md:px-0">
            {[
              { value: "90+", label: "Years of Excellence" },
              { value: "$12B+", label: "In Rental Volume" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "5000+", label: "Homes Sold" },
            ].map((item, index) => (
              <div
                key={index}
                className="glass-effect rounded-md p-3 md:p-6 md:px-14 text-[#001730]"
              >
                <h2 className="text-base md:text-2xl font-semibold mb-1">
                  {item.value}
                </h2>
                <div className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-[90%] h-[0.5px] bg-gray-300 my-2 md:my-3 md:mb-4 mx-auto"></div>
                <p className="subheading text-[#001730]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>

        </div>


      </section>

      {/* OUR VALUE Section */}
      <section className="relative w-full py-8 md:py-10">
        {/* Top Section - White Background */}
        <div className="bg-white py-8 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className=" mx-auto text-center relative">
            {/* Title */}
            <h2 className="heading text-[#001730] text-2xl mb-4 relative">
              OUR VALUE
            </h2>
            <div className="w-[20%]  h-[0.5px] bg-gray-300 my-2 md:my-3 md:mb-4 mx-auto"></div>
            {/* Subtitle */}
            <p className="subheading text-gray-600 max-w-4xl mx-auto">
              Our core values are the foundation of everything we do, from client interactions to property curation.
            </p>
          </div>
        </div>

        {/* Bottom Section - City Skyline Background with Value Boxes */}
        <div className="relative w-full min-h-[400px] md:min-h-[500px] py-8 md:py-16 px-4 sm:px-6 lg:px-8">
          {/* City Skyline Background Image */}
          <Image
            src="/Image (1).png"
            alt="City Skyline"
            fill
            className="object-cover opacity-30"
            priority
          />

          {/* Light overlay to make text readable */}
          <div className="absolute inset-0 "></div>

          {/* Value Proposition Boxes */}
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-16">
              {/* Left Box */}
              <div className="bg-black/10 backdrop-blur-sm  rounded-md p-4 md:p-8 shadow-lg border">
                <p className="text-gray-800 text-xs md:text-base leading-relaxed">
                  We hold ourselves to the highest standards in every aspect of our business, from property selection to client services.
                </p>
              </div>

              {/* Middle Box */}
              <div className="bg-black/10 backdrop-blur-sm rounded-md p-4 md:p-8 shadow-lg border border-gray-200">
                <p className="text-gray-800 text-xs md:text-base leading-relaxed">
                  We build lasting relationships based on trust, discretion and a deep understanding of our clients' unique needs and aspirations.
                </p>
              </div>

              {/* Right Box */}
              <div className="bg-black/10 backdrop-blur-sm rounded-md p-4 md:p-8 shadow-lg border border-gray-200">
                <p className="text-gray-800 text-xs md:text-base leading-relaxed">
                  Our international network and cultural fluency allow us to serve clients from diverse backgrounds and connect properties with the right buyers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A LEGACY OF EXCELLENCE Section */}
      <section className="w-full flex flex-col items-center py-12 md:py-20 bg-white text-[#001730] px-4 md:px-0">
        {/* Header */}
        <div className="text-center max-w-3xl mb-8 md:mb-16 px-4 md:px-0">
          <h2 className="heading text-2xl tracking-wide">
            A LEGACY OF EXCELLENCE SINCE 1930
          </h2>
          <div className="w-[30%] sm:w-[30%] md:w-[30%] lg:w-[30%] h-[0.5px] bg-gray-300 my-3 mx-auto"></div>
          <p className="subheading text-gray-500 mt-3 leading-relaxed">
            With decades of expertise and a passion for innovation, Al Asmakh Real
            Estate is shaping timeless real estate dreams into reality, crafting
            distinctive spaces that inspire and endure.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative flex flex-col items-center w-full ">
          {/* Vertical Line */}
          {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-[2px] bg-red-500" /> */}

          {/* Timeline Item 1 */}
          <div className="relative flex flex-col  mb-2">
            <div className="bg-white z-10 flex flex-col ">

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 border-2 border-red-500 rounded-md bg-white mb-2">
                  {/* <CircleDot className="text-red-500 w-4 h-4" /> */}
                  <div className="w-3 h-3  rounded-full bg-red-500"></div>
                </div>
                <div className="flex flex-col items-center ">
                  <div className="w-[2px] h-16 bg-red-500"></div>
                  <div className="w-3 h-3 mt-2 rounded-full bg-red-500"></div>

                </div>

              </div>
              <p className="text-sm font-semibold mt-3">
                January 1, 1930
              </p>
              <div className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-[90%] h-[0.5px] bg-gray-300 my-3 mx-auto"></div>
            </div>
          </div>

          {/* Timeline Item 2 */}
          <div className="relative flex flex-col">
            <div className="flex flex-col mx-auto md:ml-80 md:flex-row gap-6 md:gap-16 px-4 md:px-0">
              {/* Image */}
              <div className="w-full max-w-[400px] md:w-[400px] h-[200px] md:h-[250px] relative overflow-hidden mx-auto md:mx-0 shadow-md">
                <Image
                  src="/Image (2).png"
                  alt="Legacy 1970"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text */}
              <div className="text-center md:text-left max-w-md mx-auto md:mx-0">
                <h3 className="text-[#10284C] text-2xl  mb-2">
                  Foundations of a Vision
                </h3>
                <div className="w-[40%] sm:w-[40%] md:w-[40%] lg:w-[40%] h-[0.5px] bg-gray-300 my-3 mx-auto md:mx-0"></div>
                <p className="subheading text-gray-500 leading-relaxed">
                  Founded during Qatar's early development phase, laying the
                  cornerstone for what would become one of the country's most
                  trusted and pioneering real estate companies.
                </p>
              </div>
            </div>

            {/* Dot + Date */}
            <div className="flex flex-col items-center mt-8">
              <div className="w-[2px] h-16 bg-red-500"></div>
              <div className="w-3 h-3 mt-2 rounded-full bg-red-500"></div>
              <p className="text-sm font-semibold mt-3">June 5, 1970</p>
              <div className="w-[9%] sm:w-[9%] md:w-[9%] lg:w-[9%] h-[0.5px] bg-gray-300 my-3 mx-auto"></div>
            </div>
          </div>

          {/* Timeline Item 3: July 1, 1993 */}
          <div className="relative flex flex-col mt-8">

            {/* <div className="flex flex-col items-center">
            <div className="w-[2px] h-16 bg-red-500"></div>
            <div className="w-3 h-3 mt-2 rounded-full bg-red-500"></div>
            <p className="text-sm font-semibold mt-3">July 1, 1993</p>
            <div className="w-[9%] sm:w-[9%] md:w-[9%] lg:w-[9%] h-[0.5px] bg-gray-300 my-3 mx-auto"></div>
          </div> */}

            {/* Content */}
            <div className="max-w-md mx-auto md:mr-80 text-center md:text-right px-4 md:px-0">
              {/* Heading */}
              <h2 className="text-2xl text-[#001730] tracking-wide inline-block relative">
                A New Era of Living
                {/* Line directly below the heading */}
                <span className="block lg:w-[60%] w-[100%] h-[0.5px] bg-gray-300 my-3  lg:ml-auto"></span>
              </h2>

              {/* Paragraph */}
              <p className="subheading text-gray-500 leading-relaxed">
                Amid Qatar's booming oil economy, Al Asmakh Real Estate played a vital role
                in pioneering modern residential developments that set the tone for the
                nation's urban evolution.
              </p>
            </div>

          </div>

          {/* Timeline Item 4: A New Chapter of Growth */}
          <div className="relative flex flex-col mt-8">
            {/* Dot + Date */}
            <div className="flex flex-col items-center">
              <div className="w-[2px] h-16 bg-red-500"></div>
              <div className="w-3 h-3 mt-2 rounded-full bg-red-500"></div>
              <p className="text-sm font-semibold mt-3">2001 - 2003</p>
              <div className="w-[9%] sm:w-[9%] md:w-[9%] lg:w-[9%] h-[0.5px] bg-gray-300 my-3 mx-auto"></div>
            </div>

            {/* Content */}
            <div className="flex flex-col mx-auto md:ml-80 md:flex-row gap-6 md:gap-16 items-start mt-6 md:mt-8 px-4 md:px-0">
              {/* Image */}
              <div className="w-full max-w-[300px] md:w-[300px] h-[120px] md:h-[150px] relative overflow-hidden mx-auto md:mx-0 shadow-md">
                <Image
                  src="/Image (3).png"
                  alt="Legacy 1970"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text */}
              <div className="text-center md:text-left max-w-md mx-auto md:mx-0">
                <h3 className="text-2xl text-[#001B5E] mb-2">
                  A New Chapter of Growth
                </h3>
                <div className="w-[40%] sm:w-[40%] md:w-[40%] lg:w-[40%] h-[1px] bg-gray-200 my-3 mx-auto md:mx-0"></div>
                <p className="subheading text-gray-500 leading-relaxed">
                  Under the leadership of Ibrahim Hassan Al Asmakh, the company underwent a strategic transformation, strengthening its foundation and expanding its influence across Qatar's real estate sector.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Item 5: Expanding Leadership Horizons - 2001 - 2003 */}
          <div className="relative flex flex-col mt-8">
            {/* Dot + Date */}
            <div className="flex flex-col items-center">
              <div className="w-[2px] h-16 bg-red-500"></div>
              <div className="w-3 h-3 mt-2 rounded-full bg-red-500"></div>
              <p className="text-sm font-semibold mt-3">2001 - 2003</p>
              <div className="w-[9%] sm:w-[9%] md:w-[9%] lg:w-[9%] h-[0.5px] bg-gray-300 my-3 mx-auto"></div>
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-16 items-start mt-6 md:mt-8 px-4 md:px-0">
              {/* Text Block - Left */}
              <div className="max-w-md mx-auto md:mx-0 text-center md:text-right">
                {/* Heading */}
                <h2 className="text-2xl text-[#001730] tracking-wide inline-block relative">
                  Expanding Leadership Horizons
                  {/* Line directly below the heading */}
                  <span className="block lg:w-[60%] w-[100%] h-[0.5px] bg-gray-300 my-3  lg:ml-auto"></span>
                </h2>

                {/* Paragraph */}
                <p className="subheading text-gray-500  leading-relaxed">
                  During this period, Ibrahim Hassan Al Asmakh extended his leadership influence beyond real estate, serving as Vice Chairman of the Qatar Tourism Agency, contributing to the nation's growth in both tourism and property development
                </p>
              </div>


              {/* Images - Right (Overlapping) */}
              <div className="relative flex-shrink-0 mx-auto md:mx-0">

                {/* Mobile Layout — stack images */}
                <div className="flex flex-col md:hidden gap-4 w-full items-center">
                  {/* Top Image first */}
                  <div className="relative w-[250px] h-[160px] shadow-lg rounded">
                    <Image
                      src="/Image (2).png"
                      alt="Aerial View Complex"
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  {/* Bottom Image second */}
                  <div className="relative w-[200px] h-[130px] shadow-lg rounded">
                    <Image
                      src="/Image (10).png"
                      alt="Modern Building"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </div>

                {/* Laptop / Desktop (md and above) — keep original overlapping */}
                <div className="hidden md:block relative">
                  {/* Bottom Image */}
                  <div className="relative w-[250px] h-[150px] mb-4 shadow-lg rounded z-0">
                    <Image
                      src="/Image (10).png"
                      alt="Modern Building"
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  {/* Top Overlapping Image */}
                  <div className="absolute w-[400px] h-[250px] mt-[-50px] ml-40 shadow-lg rounded z-10">
                    <Image
                      src="/Image (11).png"
                      alt="Aerial View Complex"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </div>

              </div>


            </div>

            {/* Dot + Date for 2003 - 2010 */}
            <div className="flex flex-col items-center mt-8">
              <div className="w-[2px] h-16 bg-red-500"></div>
              <div className="w-3 h-3 mt-2 rounded-full bg-red-500"></div>
              <p className="text-sm font-semibold mt-3">2003 - 2010</p>
              <div className="w-[9%] sm:w-[9%] md:w-[9%] lg:w-[9%] h-[0.5px] bg-gray-300 my-3 mx-auto"></div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-16 items-start mt-6 md:mt-8 px-4 md:pl-0 md:pr-0 md:-ml-4">
            {/* Text Block - Left */}
            <div className="max-w-md mx-auto md:mx-0 md:mr-auto text-center md:text-right">
              {/* Heading */}
              <h2 className="text-2xl text-[#001730] tracking-wide inline-block relative">
                Regency Group Holding
                {/* Line directly below the heading */}
                <span className="block lg:w-[60%] w-[100%] h-[1px] bg-gray-300 my-3  lg:ml-auto"></span>
              </h2>

              {/* Paragraph */}
              <p className="subheading text-gray-500  leading-relaxed">
                Al Asmakh Real Estate became part of Regency Group Holding, enhancing its financial strength, operational efficiency, and capacity to deliver large-scale developments across Qatar.
              </p>
            </div>


            {/* Images - Right (Overlapping) */}
            <div className="relative flex-shrink-0 mx-auto md:mx-0 md:ml-auto">
              {/* Bottom Image - Smaller (goes behind) */}
              <div className="relative w-[150px] h-[100px] md:w-[200px] md:h-[150px] mb-4  rounded z-0">
                <Image
                  src="/Image (9).png"
                  alt="Modern Building"
                  fill
                  className="object-cover rounded"
                />
              </div>



            </div>

          </div>
          <div className="flex flex-col items-center">
            <div className="w-[2px] h-16 bg-red-500"></div>
            <div className="w-3 h-3 mt-2 rounded-full bg-red-500"></div>
            <p className="text-sm font-semibold mt-3">2010  - Present
            </p>
            <div className="w-[9%] sm:w-[9%] md:w-[9%] lg:w-[9%] h-[1px] bg-gray-200 my-3 mx-auto"></div>
          </div>
          <div className="relative w-[110px] h-[110px] md:w-[150px] md:h-[150px] mb-4 mx-auto rounded z-0">
            <Image
              src="/Frame 74.png"
              alt="Modern Building"
              fill
              className="object-fill"
            />
          </div>
          <div className="text-center max-w-3xl mb-8 md:mb-16 px-4 md:px-0">
            <h2 className="text-2xl text-[#001730] tracking-wide">
              Defining the Future of Luxury Living
            </h2>
            <div className="w-[30%] sm:w-[30%] md:w-[30%] lg:w-[30%] h-[0.5px] bg-gray-300 my-3 mx-auto"></div>
            <p className="subheading text-gray-500 mt-3 leading-relaxed">
              Guided by the Qatar National Vision 2030, the company continues to expand its portfolio of premium developments, shaping modern lifestyles through architectural innovation and world-class quality.
            </p>
          </div>
        </div>
      </section>
      <section className="relative w-full h-auto lg:h-screen flex items-center py-6 lg:py-0">
        {/* Background Image */}
        <Image
          src="/WhatsApp Image 2025-11-07 at 10.45.55 PM.jpeg"
          alt="Background"
          fill
          className="object-cover"
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col lg:flex-row w-full h-full px-4 lg:px-14 items-center justify-between py-6 lg:py-0">
          {/* Left Side Title - Overlaid on background */}
          <div className="text-white lg:w-1/2 flex flex-col mt-6 lg:mt-40 mb-4 lg:mb-0 h-full">
            <h2 className="text-base lg:text-2xl text-center lg:text-left mb-2 lg:mb-3">
              How Can We Help You Today?
            </h2>
            <div className="h-[0.5px] w-[50%] bg-gray-300 mx-auto lg:mx-0 mb-3 lg:mb-4"></div>
          </div>

          {/* Right Side - Form Panel and Map */}
          <div className="lg:w-1/2 max-w-2xl w-full flex flex-col">
            {/* Form Panel - Translucent */}
            <div className="bg-blue-50/10 backdrop-blur-sm p-4 lg:p-6 lg:px-16 rounded-md shadow-xl relative overflow-visible">
              {/* Form Header */}
              <h3 className="text-[#001730] lg:px-10 text-xs lg:text-sm xl:text-base text-center font-medium mb-2 lg:mb-3">
                Fill out the form below and our experts will get back to you within 24 hour
              </h3>
              <div className="h-[0.5px] w-40 lg:w-60 bg-gray-300 mb-3 lg:mb-4 mx-auto"></div>


              <form className="space-y-3 lg:space-y-4">
                {/* First Row: Name and Email */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                  <div>
                    <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Name</label>
                    <input
                      type="text"
                      placeholder="John Carter"
                      className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="example@email.com"
                      className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730]"
                    />
                  </div>
                </div>

                {/* Second Row: Phone and Property Type */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                  <div>
                    <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Phone</label>
                    <input
                      type="text"
                      placeholder="(123) 456 - 789"
                      className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Property Type</label>
                    <select
                      className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm text-gray-500 focus:outline-none focus:border-[#001730]"
                    >
                      <option>Choose a Type</option>
                      <option>Apartment</option>
                      <option>Villa</option>
                      <option>Commercial</option>
                    </select>
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-[#001730] text-xs lg:text-sm mb-1.5 lg:mb-2">Message</label>
                  <textarea
                    placeholder="Tell us more about your requirement like budget ,area & others .."
                    rows={3}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730] resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-[#001730] text-white text-[12px] px-6 lg:px-8 py-2 lg:py-2.5 rounded-md flex items-center justify-center lg:justify-end gap-2 hover:bg-[#0d2142] transition w-full lg:w-auto"
                >
                  <span className="text-[12px]">Submit</span>
                  <FaArrowRight size={12} className="lg:w-[12px] lg:h-[12px] ml-2 lg:ml-20" />
                </button>
              </form>
            </div>

            {/* Map Section - Below the blur card */}
            <div className="mt-3 mb-4 lg:mb-0 lg:mt-6 w-full h-[15vh] lg:h-[20vh] rounded-md overflow-hidden bg-gray-200 border border-gray-300 relative">
              <Image
                src="/675.png"
                alt="Map"
                fill
                className="object-cover rounded-md"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs