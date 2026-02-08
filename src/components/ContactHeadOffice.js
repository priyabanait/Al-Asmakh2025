"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import DreamPropertySection from "./DreamPropertySection";
import { motion, AnimatePresence } from "framer-motion";
export default function ContactHeadOffice() {
  const [currentOfficeIndex, setCurrentOfficeIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollIntervalRef = useRef(null);
  const [currentSlides, setCurrentSlide] = useState(0);

  // Office data array
  const offices = [
    {
      title: "Head Office",
      subtitle: "Main Office",
      address: "Floor 28, Tower 1, West Bay, Doha",
      phone: "+974 4444 4444",
      email: "headquarters@alasmakhrealestate.com",
      timing: "Sun - Thu : 8:00am - 6:00pm",
    },
    {
      title: "The Preal Office",
      subtitle: "Main Office",
      address: "Floor 28, Tower 1, West Bay, Doha",
      phone: "+974 4444 4444",
      email: "headquarters@alasmakhrealestate.com",
      timing: "Sun - Thu : 8:00am - 6:00pm",
    },
    {
      title: "Ain Khalid Gate",
      subtitle: "Main Office",
      address: "Floor 28, Tower 1, West Bay, Doha",
      phone: "+974 4444 4444",
      email: "headquarters@alasmakhrealestate.com",
      timing: "Sun - Thu : 8:00am - 6:00pm",
    },
    {
      title: "Al Sadd Office",
      subtitle: "Main Office",
      address: "Floor 28, Tower 1, West Bay, Doha",
      phone: "+974 4444 4444",
      email: "headquarters@alasmakhrealestate.com",
      timing: "Sun - Thu : 8:00am - 6:00pm",
    },
    {
      title: "Al Thumama Office",
      subtitle: "Main Office",
      address: "Floor 28, Tower 1, West Bay, Doha",
      phone: "+974 4444 4444",
      email: "headquarters@alasmakhrealestate.com",
      timing: "Sun - Thu : 8:00am - 6:00pm",
    },
  ];

  // Auto-scroll functionality for mobile
  useEffect(() => {
    if (isPaused) {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
      return;
    }

    autoScrollIntervalRef.current = setInterval(() => {
      setCurrentOfficeIndex((prevIndex) => {
        if (prevIndex >= offices.length - 1) {
          return 0; // Loop back to start
        }
        return prevIndex + 1;
      });
    }, 3000); // Auto-scroll every 3 seconds

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isPaused, offices.length]);

  // Auto Slide for offices (desktop only)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        // Continue through all offices, then loop back to start
        return prev >= offices.length - 1 ? 0 : prev + 1;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [offices.length]);

  // Get visible offices for current slide (desktop) - show 3 offices with wrapping
  const visibleOffices = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentSlides + i) % offices.length;
    visibleOffices.push(offices[index]);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full min-h-screen lg:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/WhatsApp Image 2025-11-08 at 10.47.12 PM.jpeg"
          alt="City Skyline"
          fill
          className="object-cover"
          priority
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 " />

        {/* Content (Centered Box) */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-8">
          <div className="glass-effect rounded-md px-6 md:px-10 py-8 md:py-20 shadow-lg max-w-[900px] mx-auto text-center">
            <h1 className="text-[26px] text-white  mb-2">
              CONTACT OUR HEAD OFFICE
            </h1>
            <div className="w-[40%] mt-5  lg:w-[40%] h-[0.5px]  bg-gray-300 mb-3 md:mb-4 mx-auto"></div>
            <p className="subheading text-white/80 font-medium">
              Get in touch with our head office team for corporate inquiries, partnerships, and general information.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto">
          {/* Mobile Version - Two Cards Stacked (Email and Phone) */}
          <div className="block lg:hidden space-y-4 mb-8">
            {/* Card 1: Email Contact */}
            <div className="bg-[#001730] rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-start gap-4">
                {/* Icon Image */}
                <div className="flex-shrink-0 relative">
                  <Image
                    src="/rep_img/ConatctIcons/mail.png"
                    alt="Mail Icon"
                    width={32}
                    height={32}
                    className="w-[32px] h-[32px] object-contain"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-sm font-light mb-3 items-end text-right text-white">Send us an email anytime</h3>
                  <div className="h-[1px] bg-gray-600 mb-4"></div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className="text-xs font-light text-white">Sales@aredc.qa</span>
                    <span className="text-xs font-light text-white">Info@aredc.qa</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Phone Contact */}
            <div className="bg-[#001730] rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-start gap-4">
                {/* Icon Image */}
                <div className="flex-shrink-0 relative">
                  <Image
                    src="/rep_img/ConatctIcons/call.png"
                    alt="Phone Icon"
                    width={32}
                    height={32}
                    className="w-[32px] h-[32px] object-contain"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-sm font-light mb-3 text-white items-end text-right">Call us during business hours</h3>
                  <div className="h-[1px] bg-gray-600 mb-4"></div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className="text-xs font-light text-white">+974 4444 5555</span>
                    <span className="text-xs font-light text-white">+974 4444 5556</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Head Office Address */}
            <div className="bg-[#001730] rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-start gap-4">
                {/* Icon Image */}
                <div className="flex-shrink-0 relative">
                  <Image
                    src="/rep_img/ConatctIcons/location.png"
                    alt="Location Icon"
                    width={32}
                    height={32}
                    className="w-[32px] h-[32px] object-contain"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-sm font-light mb-3 text-white items-end text-right">Visit our head office</h3>
                  <div className="h-[1px] bg-gray-600 mb-4"></div>
                  <div className="flex flex-col items-end gap-1 text-right">
                    <span className="text-xs font-light text-white">Tower 1, Floor 15</span>
                    <span className="text-xs font-light text-white">West Bay Business District</span>
                    <span className="text-xs font-light text-white">Doha, Qatar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Office Hours */}
            <div className="bg-[#001730] rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-start gap-4">
                {/* Icon Image */}
                <div className="flex-shrink-0 relative">
                  <Image
                    src="/rep_img/ConatctIcons/timer.png"
                    alt="Timer Icon"
                    width={32}
                    height={32}
                    className="w-[32px] h-[32px] object-contain"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-sm font-light mb-3 text-white items-end text-right">Our Office Hours</h3>
                  <div className="h-[1px] bg-gray-600 mb-4"></div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-light text-white">Friday</span>
                      <span className="text-xs font-light text-white/70">7:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-light text-white">Sunday - Thursday</span>
                      <span className="text-xs font-light text-white/70">8:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-light text-white">Saturday</span>
                      <span className="text-xs font-light text-white/70">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Version - Four Cards Grid */}
          <div className="hidden lg:grid grid-cols-4 gap-2 mb-8">
            {/* Card 1: Email Contact */}
            {/* Card 1: Email Contact */}
            <div className="bg-[#001730] rounded-lg p-6 text-center text-white shadow-lg">
              <div className="flex justify-center mb-4">
                <Image
                  src="/rep_img/ConatctIcons/mail.png"
                  alt="Mail Icon"
                  width={62}
                  height={62}
                  className="w-[62px] h-[62px] object-contain"
                />
              </div>
              <h3 className="text-sm font-light mb-4 text-gray-400">Send us an email anytime</h3>
              <div className="w-[90%] h-[1px] bg-gray-600 mb-3 md:mb-4 mx-auto"></div>
              <div className="flex items-center justify-center gap-10">
                <span className="text-xs font-light">Sales@aredc.go</span>
                <div className="h-4 w-[1px] bg-white"></div>
                <span className="text-xs font-light">info@ared.qa</span>
              </div>
            </div>

            {/* Card 2: Phone Contact */}
            <div className="bg-[#001730] rounded-lg p-6 text-center text-white shadow-lg">
              <div className="flex justify-center mb-4">
                <Image
                  src="/rep_img/ConatctIcons/call.png"
                  alt="Phone Icon"
                  width={62}
                  height={62}
                  className="w-[62px] h-[62px] object-contain"
                />
              </div>
              <h3 className="text-sm font-light mb-4 text-gray-400">Call us during business hours</h3>
              <div className="w-[90%] h-[1px] bg-gray-600 mb-3 md:mb-4 mx-auto"></div>
              <div className="flex items-center justify-center gap-6">
                <span className="text-xs font-light">+974 4444 5555</span>
                <div className="h-4 w-[1px] bg-white"></div>
                <span className="text-xs font-light">+974 4444 5556</span>
              </div>
            </div>

            {/* Card 3: Head Office Address */}
            <div className="bg-[#001730] rounded-lg p-6 text-white shadow-lg">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <Image
                  src="/rep_img/ConatctIcons/location.png"
                  alt="Location Icon"
                  width={62}
                  height={62}
                  className="w-[62px] h-[62px] object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-sm font-light mb-4 text-gray-400 text-center">
                Visit our head office
              </h3>

              {/* Divider */}
              <div className="w-[90%] h-[1px] bg-gray-600 mb-3 md:mb-4 mx-auto"></div>

              {/* Address aligned to start */}
              <div className="text-xs font-light text-center leading-relaxed pl-4">
                <p>Tower 1, Floor 15
                  West Bay Business District
                  Doha, Qatar</p>
              </div>
            </div>

            {/* Card 4: Office Hours */}
            <div className="bg-[#001730] rounded-lg p-4 text-center text-white shadow-lg">
              {/* Clock Icon */}
              <div className="flex justify-center mb-4">
                <Image
                  src="/rep_img/ConatctIcons/timer.png"
                  alt="Timer Icon"
                  width={62}
                  height={62}
                  className="w-[62px] h-[62px] object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-sm font-light mb-6 text-gray-400">Our Office Hours</h3>
              <div className="w-[90%] h-[1px] bg-gray-600 mb-3 md:mb-4 mx-auto"></div>
              {/* Horizontal Days */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="flex flex-col items-center">
                  <div className="font-light text-xs">Friday</div>
                  <div className="text-white/70 text-xs font-light">7:00 AM - 4:00 PM</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="font-light text-xs">Sunday - Thursday</div>
                  <div className="text-white/70 text-xs font-light">8:00 AM - 5:00 PM</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="font-light text-xs">Saturday</div>
                  <div className="text-white/70 text-xs font-light">Closed</div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="lg:hidden
    bg-[#FFE0E0] rounded-lg p-6 shadow-md
    text-center md:text-left   /* laptop left if you want OR keep center */
    flex flex-col md:block     /* center on mobile */
    items-center md:items-start
  "
          >
            <p className="text-sm md:text-base font-light text-center md:text-left leading-relaxed">
              <span className="text-[#FF0000] ">Emergency Contact</span><br></br>
              <span className="text-[#FF0000] ">
                For urgent property-related emergencies outside business hours{" "}</span>
              <span className="text-[#FF0000]  ml-0 md:ml-4 block md:inline">
                +974 5555 0000
              </span>
              <span className="text-[#FF0000]  ml-0 md:ml-4 block md:inline">
                24/7 Emergency Line
              </span>
            </p>
          </div>

          {/* Emergency Contact Banner */}
          <div className=" hidden md:block bg-[#FFE0E0] rounded-lg p-6 text-center shadow-md">
            <p className="text-sm md:text-base font-light">
              <span className="text-[#FF0000] ">Emergency Contact</span>
              {" - "}
              <span className="text-[#FF0000] ">
                For urgent property-related emergencies outside business hours{" "}</span>
              <span className="text-[#FF0000]  ml-4">+974 5555 0000</span>
              {" "}
              <span className="text-[#FF0000]  ml-4">24/7 Emergency Line</span>
            </p>
          </div>
        </div>
      </section>

      {/* LET'S CONNECT Form Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 min-h-screen overflow-hidden">
        {/* Background Image */}
        <Image
          src="/Abstract Design.png"
          alt="City Skyline Background"
          fill
          className="object-fill"
          priority
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Geometric Pattern Background (Bottom Right) */}
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-20 pointer-events-none z-0">
          <div className="grid grid-cols-4 gap-2 p-8">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-400 rounded-sm"
                style={{
                  height: `${Math.random() * 40 + 20}px`,
                  opacity: Math.random() * 0.5 + 0.3,
                }}
              />
            ))}
          </div>
        </div>

        <div className="md:mx-10 mx-auto relative z-10">
          {/* Form Container */}
          <div className="glass-effect bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-8 md:p-12 border border-white/10">
            {/* Title */}
            <h1 className="text-sm sm:text-2xl  text-center text-uppercase lg:mx-0 text-uppercase   md:text-[23px] lg:text-[23px] mb-2 md:mb-3 lg:mb-4 ">
              LET'S CONNECT
            </h1>
            <div className="w-[40%] h-[0.5px] mt-2 bg-gray-300 mb-3 md:mb-4 mx-auto"></div>

            {/* Introduction Paragraph */}
            <p className="subheading text-gray-600 text-center mb-8 mx-auto">
              We're excited to connect with you and learn more about your real estate goals. Use the form below to get in touch with us.. Whether you're a prospective client, partner, or simply curious about our services, we're here to answer your questions and provide the assistance you need.
            </p>

            {/* Contact Form */}
            <form className="space-y-6 ">
              {/* First Row: First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter First Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001730] text-gray-800 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001730] text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Second Row: Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001730] text-gray-800 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001730] text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Third Row: Inquiry Type & How Did You Hear About Us */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001730] text-gray-800 bg-white appearance-none cursor-pointer">
                    <option value="">Select Inquiry Type</option>
                    <option value="general">General Inquiry</option>
                    <option value="property">Property Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How Did You Hear About Us?
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001730] text-gray-800 bg-white appearance-none cursor-pointer">
                    <option value="">Select</option>
                    <option value="google">Google</option>
                    <option value="social">Social Media</option>
                    <option value="referral">Referral</option>
                    <option value="advertisement">Advertisement</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows="6"
                  placeholder="Enter your Message here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001730] text-gray-800 placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* Form Footer: Terms & Submit Button */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-4 h-4 text-[#001730] border-gray-300 rounded focus:ring-[#001730] cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                    I agree with Terms of Use and Privacy Policy
                  </label>
                </div>
                <button
                  type="submit"
                  className="bg-[#001730] text-white text-[12px] px-8 py-3 rounded-md   transition-colors flex items-center justify-between
    shadow-lg w-full max-w-[260px]"
                >
                  <span>Submit</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Discover Our Office Locations Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="md:mx-10 mx-auto text-center lg:text-left">
          {/* Section Header */}
          <div className="mb-12">
            <h1 className="text-xl lg:text-2xl   mb-2  lg:mb-4 ">
              Discover Our Office Locations
            </h1>
            <p className="subheading text-gray-600">
              We are here to serve you across multiple locations. Whether you're looking to meet our team, discuss real estate opportunities, or simply drop by for a chat, we have offices conveniently located to serve your needs. Explore the areas below to find Our office nearest to you.
            </p>
          </div>

          {/* Mobile Carousel - Only visible on mobile */}
          <div className="block lg:hidden relative" style={{ overflow: "hidden", width: "100%" }}>
            <div
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              style={{
                height: "auto",
                minHeight: "300px",
                overflow: "hidden",
                width: "100%",
                position: "relative",
              }}
            >
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(calc(-${currentOfficeIndex * 100}%))`,
                  willChange: "transform",
                }}
              >
                {offices.map((office, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0"
                    style={{
                      width: "100%",
                      padding: "0 8px",
                    }}
                  >
                    <div
                      style={{
                        backgroundImage: 'url(/images/office_location.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'left center',
                        backgroundRepeat: 'no-repeat',
                      }}
                      className="relative bg-[#EEEEEE] rounded-md p-3 shadow-md overflow-hidden"
                    >
                      <div className="relative text-left z-10">
                        <h3 className="text-xl lg:text-2xl text-[#001730] mb-1">{office.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{office.subtitle}</p>

                        <div className="space-y-3 text-sm text-gray-700">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="text-[0.7rem] break-all">{office.address}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Phone className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="text-[0.7rem] break-all">{office.phone}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Mail className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="text-[0.7rem] break-all">{office.email}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="text-[0.7rem] break-all">{office.timing}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {Array.from({ length: offices.length }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsPaused(true);
                    setCurrentOfficeIndex(index);
                    setTimeout(() => setIsPaused(false), 3000);
                  }}
                  className={`w-5 h-5 flex items-center justify-center transition-all duration-300 ${currentOfficeIndex === index
                    ? "border-2 border-[#10284C] rounded-[2px] bg-white"
                    : "bg-transparent"
                    }`}
                >
                  <span
                    className={`block ${currentOfficeIndex === index
                      ? "w-2 h-2 bg-[#10284C] rounded-[2px]"
                      : "w-2 h-2 bg-gray-400 rounded-[2px]"
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Grid - Hidden on mobile */}
          <div className="hidden lg:block">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlides}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {visibleOffices.map((office, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundImage: 'url(/images/office_location.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'left center',
                        backgroundRepeat: 'no-repeat',
                      }}
                      className="bg-[#EEEEEE] rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex overflow-hidden relative"
                    >
                      {/* Left Section - Office Information */}
                      <div className="flex-1 p-6 relative z-10">
                        <h3 className="text-xl lg:text-2xl text-[#001730] mb-1">
                          {office.title}
                        </h3>
                        <p className="text-gray-700 text-sm mb-2">{office.subtitle}</p>

                        {/* Separator Line */}
                        <div className="h-[0.5px] w-60 bg-gray-300 mb-2" />

                        {/* Contact Details */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <MapPin className="w-4 h-4 text-gray-700" />
                            {office.address}
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <Phone className="w-4 h-4 text-gray-700" />
                            {office.phone}
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <Mail className="w-4 h-4 text-gray-700" />
                            {office.email}
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <Clock className="w-4 h-4 text-gray-700" />
                            {office.timing}
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Patterned Strip */}
                      <div className="w-20 relative overflow-hidden z-10">
                        <Image
                          src="/images/BG_Form.png"
                          alt="Pattern"
                          fill
                          className="object-fill opacity-50"
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Animated Dots Navigation */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {offices.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="relative flex items-center justify-center"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={false}
                    animate={{
                      scale: index === currentSlides ? 1.2 : 1,
                      opacity: index === currentSlides ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <motion.span
                    className={`
                      block rounded-full
                      ${index === currentSlides
                        ? "bg-[#001730]"
                        : "bg-gray-400"
                      }
                    `}
                    animate={{
                      width: index === currentSlides ? "32px" : "8px",
                      height: index === currentSlides ? "8px" : "8px",
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <DreamPropertySection />
    </div>
  );
}

