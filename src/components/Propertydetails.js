import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { FaArrowRight, FaArrowLeft, FaChevronUp, FaChevronDown, FaBath } from "react-icons/fa6";
import { FaBed, FaRulerCombined, FaCar, FaCouch, FaBuilding } from "react-icons/fa";
import Link from "next/link";

export default function PropertyDetails() {
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
  const [activeTab, setActiveTab] = useState("overview");

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

      <div className="w-full  bg-[#F5F7FA] p-4 sm:p-6 mt-20">
        {/* Back Button */}
        <div className="bg-gray-200 text-sm flex items-center w-32 sm:w-40 p-2 sm:p-3 mb-4 rounded-[5px] cursor-pointer">
          <button className="flex items-center gap-2 text-[#001730] font-semibold">
            <ArrowLeft size={18} className="mr-4 sm:mr-10" />
            <span className="ml-2 sm:ml-8">Back</span>
          </button>
        </div>

        {/* Title + Price + Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#001730] text-white p-4 sm:p-6 rounded-[5px] shadow-md flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl font-bold">Luxury Penthouse in West Bay</h1>
            <div className="w-[50%] h-[0.2px] px-10  mt-2 3xl:mt-3 bg-gray-400 my-2 "></div>
            <div className="flex items-center text-gray-200 text-xs sm:text-sm mt-2">
              <MapPin size={16} className="mr-1" /> West Bay, Doha, Qatar
            </div>
          </div>

          <div className="bg-[#001730] text-white p-4 sm:p-6 rounded-[5px] shadow-md flex flex-col justify-center">
            <p className="text-xs sm:text-sm opacity-80 mb-1">Per Month</p>
            <h2 className="text-xl sm:text-2xl font-bold">QAR 24,000</h2>
          </div>

          <div className="bg-[#001730] p-4 sm:p-6 rounded-[5px] shadow-md flex items-center justify-center">
            <div className="flex gap-2 sm:gap-4 w-full">
              <button className="w-1/2 bg-gray-400 text-[#001730] rounded-[5px] font-semibold py-2 text-xs sm:text-base shadow">
                For Rent
              </button>

              <button className="w-1/2 bg-gray-400 text-[#001730] rounded-[5px] font-semibold py-2 text-xs sm:text-base shadow">
                Featured
              </button>
            </div>
          </div>

        </div>
        <div className="bg-white shadow-md p-4 sm:p-6">

          {/* Thumbnail Images */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div key={n} className="min-w-[100px] sm:min-w-[120px] lg:min-w-[150px] h-[60px] sm:h-[75px] lg:h-[90px] rounded-[5px] overflow-hidden shadow">
                <Image src={`/Image (6).png`} alt="thumb" width={150} height={90} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>

          {/* Main Images */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[420px] rounded-[5px] overflow-hidden shadow-lg">
              <Image src="/Image (7).png" alt="main" width={800} height={800} className="object-cover w-full h-full" />
            </div>

            <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[420px] rounded-[5px] overflow-hidden shadow-lg">
              <Image src="/Image (8).png" alt="main" width={800} height={800} className="object-cover w-full h-full" />
            </div>
          </div>

          {/* Slider Arrows */}
          <div className="flex justify-center items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
            <button className="bg-white p-2 sm:p-3 rounded-[5px] shadow-md border border-gray-500">
              <FaArrowLeft size={18} className="sm:w-[22px] sm:h-[22px] text-[#001730]" />
            </button>
            <div className="text-[#001730] tracking-widest text-sm sm:text-lg">- - - - -</div>
            <button className="bg-white p-2 sm:p-3 rounded-[5px] shadow-md border border-gray-500">
              <FaArrowRight size={18} className="sm:w-[22px] sm:h-[22px] text-[#001730]" />
            </button>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-100 p-4 sm:p-6">

        {/* MAIN CONTENT */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* LEFT SIDE */}
          <div className="col-span-1">
            {/* TOP SPECS */}
            <div className="bg-gray-100 p-3 sm:p-4 shadow-lg rounded-[5px] mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                {[
                  { icon: "bed", label: "03" },
                  { icon: "bath", label: "02" },
                  { icon: "area", label: "450" },
                  { icon: "car", label: "02" },
                  { icon: "furnished", label: "Furnished" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 sm:gap-3 bg-white px-2 sm:px-4 py-2 sm:py-3 rounded-[5px] shadow-sm"
                  >
                    {item.icon === "bed" && (
                      <FaBed className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                    )}
                    {item.icon === "bath" && (
                      <FaBath className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                    )}
                    {item.icon === "area" && (
                      <FaRulerCombined className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                    )}
                    {item.icon === "car" && (
                      <FaCar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                    )}
                    {item.icon === "furnished" && (
                      <FaCouch className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                    )}
                    <p className="font-semibold text-[#001730] text-xs sm:text-base">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}


            {/* Description box */}
            <div className="bg-white p-4 sm:p-6 rounded-[5px] shadow">
              <div className="flex gap-2 sm:gap-4 mb-4">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-[5px] shadow text-xs sm:text-base font-semibold transition-all ${activeTab === "overview"
                    ? "bg-white text-[#001730]"
                    : "bg-gray-200 text-gray-500"
                    }`}
                >
                  Overview
                  {activeTab === "overview" ? (
                    <FaChevronDown size={14} />
                  ) : (
                    <FaChevronUp size={14} />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("virtual")}
                  className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-[5px] shadow text-xs sm:text-base font-semibold transition-all ${activeTab === "virtual"
                    ? "bg-white text-[#001730]"
                    : "bg-gray-200 text-gray-500"
                    }`}
                >
                  360 Virtual Tour
                  {activeTab === "virtual" ? (
                    <FaChevronDown size={14} />
                  ) : (
                    <FaChevronUp size={14} />
                  )}
                </button>
              </div>
              <h2 className="text-lg sm:text-xl mx-4 sm:mx-10  text-[#001730] mb-3">
                Description
              </h2>

              <p className="text-gray-600 text-sm sm:text-base mx-4 sm:mx-10 leading-relaxed mb-4">
                West Bay Plaza represents the pinnacle of commercial real estate
                development in Doha’s prestigious financial district. This
                state-of-the-art complex combines premium office spaces with
                high-end retail outlets, creating a dynamic business environment
                in the heart of Qatar’s economic center.
              </p>

              <p className="text-gray-600 text-sm sm:text-base mx-4 sm:mx-10 leading-relaxed mb-4">
                The development features cutting-edge architecture with sustainable
                design principles, smart building technology, and world-class
                amenities. Located strategically in West Bay, the plaza offers
                unparalleled connectivity to major business hubs, government
                offices, and luxury hotels.
              </p>

              <p className="text-gray-600 text-sm sm:text-base mx-4 sm:mx-10 leading-relaxed mb-4">
                With 80 premium units ranging from compact offices to expansive
                commercial spaces, West Bay Plaza caters to businesses of all sizes.
                The project is designed to achieve LEED Gold certification,
                emphasizing our commitment to environmental sustainability and
                energy efficiency.
              </p>
              <div className="w-[90%] h-[0.2px] px-10 mx-4 sm:mx-10  mt-2 3xl:mt-3 bg-gray-400 mb-3 md:mb-4 3xl:mb-5"></div>
              {/* Bottom stats */}
              <div className="grid grid-cols-3 mx-4 sm:mx-10 pt-4 mt-4">
                {[
                  { title: "Total Area", value: "8080", icon: "area" },
                  { title: "Floors", value: "25", icon: "floors" },
                  { title: "Parking Spaces", value: "02", icon: "parking" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex flex-col pl-2 sm:pl-4 ${i !== 2 ? "border-r border-gray-400" : ""
                      }`}
                  >
                    {/* TITLE + ICON SIDE BY SIDE */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {item.icon === "area" && (
                        <FaRulerCombined className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      )}
                      {item.icon === "floors" && (
                        <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      )}
                      {item.icon === "parking" && (
                        <FaCar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      )}
                      <p className="text-gray-500 text-xs sm:text-sm">{item.title}</p>
                    </div>

                    {/* VALUE BELOW */}
                    <h3 className="text-[#001730] text-base sm:text-xl font-semibold mt-1">
                      {item.value}
                    </h3>
                  </div>
                ))}
              </div>

            </div>

            {/* Map Box */}
            <div className="mt-4 sm:mt-6 bg-white rounded-[5px] shadow p-0 h-[250px] sm:h-[300px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1161406535!2d72.74109735859375!3d19.082197839287853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63f497d4a63%3A0xdeb6b3fbbf7c9f1!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>


            {/* Bottom info strip */}
            <div className="bg-gray-100 p-3 sm:p-4 mt-4 shadow-lg rounded-[5px]">
              <div className=" grid grid-cols-3 gap-3 sm:gap-4">

                {/* Box 1 */}
                <div className="bg-white p-3 sm:p-4 rounded-[5px] shadow text-xs sm:text-sm">
                  <p className="break-words whitespace-normal">
                    <span className="font-semibold text-[#001730]">Property ID:</span>{" "}
                    PH-2024-001
                  </p>
                </div>

                {/* Box 2 */}
                <div className="bg-white p-3 sm:p-4 rounded-[5px] shadow text-xs sm:text-sm">
                  <p>
                    <span className="font-semibold text-[#001730]">Property Type:</span>{" "}
                    Penthouse
                  </p>
                </div>

                {/* Box 3 */}
                <div className="bg-white p-3 sm:p-4 rounded-[5px] shadow text-xs sm:text-sm">
                  <p className="break-words whitespace-normal">
                    <span className="font-semibold text-[#001730]">Year Built:</span>{" "}
                    2023
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE - AGENT CARDS */}
          <div className="col-span-1 flex flex-col gap-4 sm:gap-6">

            {/* Agent Card Component */}
            {[
              {
                name: "Sarah Johnson",
                role: "Luxury Property Specialist",
                specialties: "West Bay, Commercial, Penthouse",
                languages: "English, Spanish, Arabic",
                image: "/div.png",
                logo: "/Frame 74.png",
              },
              {
                name: "Mohammed Al-Thani",
                role: "Luxury Property Specialist",
                specialties: "West Bay, Commercial, Penthouse",
                languages: "English, Spanish, Arabic",
                image: "/div (2).png",
                logo: "/Frame 74.png",
              },
            ].map((agent, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[5px] shadow overflow-hidden flex flex-col lg:flex-row h-auto"
              >
                {/* LEFT IMAGE */}
                <div className="w-full lg:w-1/2 relative flex-shrink-0 h-80 lg:h-full min-h-[320px]">
                  <Image
                    src={agent.image}
                    width={300}
                    height={300}
                    alt="agent"
                    className="h-full w-full object-cover"
                  />

                  <Image
                    src={agent.logo}
                    width={50}
                    height={50}
                    alt="logo"
                    className="absolute top-2 left-2 sm:top-3 sm:left-3 w-8 h-8 sm:w-[50px] sm:h-[50px]"
                  />
                </div>

                {/* RIGHT DETAILS */}
                <div className="w-full lg:w-1/2 p-4 sm:p-6 flex flex-col justify-between">
                  <div>
                    <div className="shadow-md bg-white text-center p-4 sm:p-8 rounded-[5px]">
                      <h3 className="text-base sm:text-lg font-semibold text-center text-[#001730] mb-1">
                        {agent.name}
                      </h3>
                      <div className="w-[30%] h-[0.2px] px-10 mt-2 3xl:mt-3 bg-gray-400 my-2 mx-auto"></div>
                      <p className="text-gray-500 text-xs sm:text-sm mb-4">{agent.role}</p>

                    </div>
                    <div className="relative mt-4 ">
                      <p className=" absolute top-[-9px] text-xs text-gray-400 ml-2">Specialties:</p>
                      <p className="bg-white p-3 sm:p-4 shadow-md  rounded-[5px] text-xs sm:text-sm text-gray-700">
                        {agent.specialties}
                      </p>
                    </div>

                    <div className="relative mt-4 ">
                      <p className="absolute top-[-9px] text-xs text-gray-400 ml-2 ">Languages:</p>
                      <p className="bg-white p-3 sm:p-4 shadow-md rounded-[5px] text-xs sm:text-sm text-gray-700">
                        {agent.languages}
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex flex-row gap-2">
                      <button className="flex-1 bg-[#001730] text-white py-2 sm:py-2.5 rounded-[5px] flex justify-between items-center px-3 sm:px-4 text-[12px] hover:opacity-90 transition">
                        Call Agent
                        <FaArrowRight size={12} className="sm:w-[14px] sm:h-[14px]" />
                      </button>
                      <button className="flex-1 bg-[#001730] text-white py-2 sm:py-2.5 rounded-[5px] flex justify-between items-center px-3 sm:px-4 text-[12px] hover:opacity-90 transition">
                        Send email
                        <FaArrowRight size={12} className="sm:w-[14px] sm:h-[14px]" />
                      </button>
                    </div>
                    <button className="w-full bg-[#001730] text-white py-2 sm:py-2.5 rounded-[5px] flex justify-between items-center px-3 sm:px-4 text-[12px] hover:opacity-90 transition">
                      Schedule Viewing
                      <FaArrowRight size={12} className="sm:w-[14px] sm:h-[14px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative w-full h-screen py-6 lg:py-8 px-4 md:px-8 lg:px-16 xl:px-18 2xl:px-20 3xl:px-24 4xl:px-32 5xl:px-40 overflow-hidden">
        <div className="max-w-[1500px] mx-auto">
          <h2
            id="my-heading"
            className="text-2xl text-[#001730] uppercase mb-2  lg:mb-2 text-center"
          >
            Related Listings
          </h2>
          <div className="flex-1 h-[0.5px] bg-gray-300 my-2 lg:my-2
          mx-auto w-[60%] md:w-[40%] lg:w-[20%] "></div>
          <p
            id="desc"
            className="
    text-gray-500 
    mx-auto text-center px-2 md:px-4 lg:px-0

    max-w-xs md:max-w-xl lg:max-w-2xl 
    xl:max-w-3xl 2xl:max-w-4xl 
    3xl:max-w-5xl 
    4xl:max-w-6xl 
    5xl:max-w-7xl 

    mb-6 md:mb-8 lg:mb-12 xl:mb-12 2xl:mb-14 3xl:mb-16 4xl:mb-20 5xl:mb-24
 
  " style={{ fontSize: "clamp(13px, 0.8vw, 17px)" }}
          >
            Discover similar properties that might interest you in the same area or with comparable features

          </p>

          <div
            ref={scrollRef}
            className="flex gap-3 md:gap-4 lg:gap-6 xl:gap-6 2xl:gap-7 3xl:gap-8 4xl:gap-10 5xl:gap-12 overflow-x-auto no-scrollbar scroll-smooth pb-4 lg:pb-6 "
          >
            {properties.map((property, index) => (
              <div
                key={index}
                className={`
          w-[250px]  lg:w-[350px]
          p-4
          bg-[#E9E9E9] border border-gray-200 
          rounded-[5px] overflow-hidden shadow-md 
          hover:shadow-xl transition-shadow duration-300 
          flex-shrink-0
          ${index === 0 || index === properties.length - 1
                    ? 'scale-95'
                    : 'scale-100'
                  }
        `}
              >
                {/* Image Section */}
                <div className="relative w-full h-[180px]  xl:h-[200px] ">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-fill rounded-[5px]"
                  />
                </div>

                {/* Property Info */}
                <div className="py-2">
                  <h3 className="font-semibold text-[#001730] text-sm lg:text-lg mb-1 leading-snug line-clamp-2">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center text-[#001730] text-sm mb-3">
                    <MapPin size={12} className="mr-2" />
                    <span
                      className="line-clamp-1 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl"
                      style={{ fontSize: "clamp(13px, 0.8vw, 17px)" }}
                    >
                      {property.location}
                    </span>
                  </div>


                  {/* Bed/Bath/Area Info */}
                  <div className="grid grid-cols-3 gap-2 lg:gap-3 text-[#001730] text-xs lg:text-sm mb-3 lg:mb-4">

                    <div className="flex items-center justify-center gap-1 bg-[#F5F5F5] shadow p-1.5 lg:p-2 rounded-[5px]">
                      <Image
                        src="/Icon (1).png"
                        alt="Beds"
                        width={14}
                        height={14}
                        className="lg:w-[18px] lg:h-[18px]"
                      />
                      <span>{property.beds}</span>
                    </div>

                    <div className="flex items-center justify-center gap-1 bg-[#F5F5F5] shadow p-1.5 lg:p-2 rounded-[5px]">
                      <Image
                        src="/Icon.png"
                        alt="Baths"
                        width={14}
                        height={14}
                        className="lg:w-[18px] lg:h-[18px]"
                      />
                      <span>{property.baths}</span>
                    </div>

                    <div className="flex items-center justify-center gap-1 bg-[#F5F5F5] shadow p-1.5 lg:p-2 rounded-[5px]">
                      <Image
                        src="/Icon (2).png"
                        alt="Area"
                        width={14}
                        height={14}
                        className="lg:w-[18px] lg:h-[18px]"
                      />
                      <span>{property.area}</span>
                    </div>

                  </div>


                  <div
                    className="w-[100%]  h-[0.5px] bg-gray-300  my-3 "
                  ></div>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-base md:text-base lg:text-base xl:text-lg 2xl:text-lg 3xl:text-xl 4xl:text-2xl 5xl:text-3xl font-semibold text-[#001730]">
                      {property.price}
                    </p>

                    <button className="bg-[#001730] text-white text-[12px] px-3 md:px-4 lg:px-5 xl:px-5 2xl:px-6 3xl:px-7 4xl:px-8 5xl:px-10 py-1.5  lg:py-2  rounded-[5px] flex items-center justify-between shadow-lg transition-all duration-300 hover:bg-[#002d52]">
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
        </div>

        <div className="flex justify-center  ">
          <button className="bg-[#001730] text-white text-[12px] px-4 md:px-4 lg:px-5 xl:px-5 2xl:px-6 3xl:px-7 4xl:px-8 5xl:px-10 py-1.5 md:py-1.5 lg:py-2 xl:py-2 2xl:py-3 3xl:py-3 4xl:py-4 5xl:py-5 rounded-[5px] flex items-center justify-center gap-2 transition hover:bg-[#1b3a70]">
            <span>View All</span>
            <FaArrowRight
              size={12}
              className="w-3 h-3  lg:w-[12px] lg:h-[12px] ml-20"
            />
          </button>
        </div>

        {/* Scroll Button */}
        {showScrollButton && (
          <button
            onClick={scrollRight}
            className="absolute right-2 md:right-3 lg:right-4 xl:right-5 2xl:right-6 3xl:right-8 4xl:right-10 5xl:right-12 top-1/2 transform -translate-y-1/2 
                     bg-white border border-gray-300 rounded-[5px] p-2 md:p-2.5 lg:p-3 xl:p-3.5 2xl:p-4 3xl:p-5 4xl:p-6 5xl:p-7 px-4 md:px-5 lg:px-6 xl:px-7 2xl:px-8 3xl:px-10 4xl:px-12 5xl:px-14
                     shadow-md z-10 hover:shadow-lg transition"
          >
            <FaArrowRight className="text-[#001730] w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10 4xl:w-12 4xl:h-12 5xl:w-14 5xl:h-14" />
          </button>
        )}
      </div>

    </div>
  );
}
