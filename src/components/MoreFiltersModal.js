"use client";
import { useState } from "react";
import { ArrowDown, X, Sofa, Ruler, Gem, MapPin, Building, ListChecks, Search, Mic, Bed, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MoreFiltersModal({ isOpen, onClose, onShowResults }) {
  const [openSections, setOpenSections] = useState({
    location: false,
    propertyType: false,
    bedrooms: false,
    priceRange: false,
    amenities: false,
  });

  const [openFilterBarDropdowns, setOpenFilterBarDropdowns] = useState({
    location: false,
    propertyType: false,
    furnishings: false,
    beds: false,
    bathrooms: false,
    price: false,
    amenities: false,
    propertySize: false,
    agent: false,
    project: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFilterBarDropdown = (dropdown) => {
    setOpenFilterBarDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const [locationSearch, setLocationSearch] = useState("");
  const [selectedBedrooms, setSelectedBedrooms] = useState([]);
  const [sevenPlusChecked, setSevenPlusChecked] = useState(false);
  const [minPrice, setMinPrice] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(10000000);

  // const locations = [
  //   "West Bay",
  //   "The Pearl",
  //   "Lusail City",
  //   "Al Sadd",
  //   "Al Dafna",
  //   "Doha",
  //   "Pearl Island",
  // ];

  const propertyTypes = [
    "Apartment",
    "Villa",
    "Penthouse",
    "Townhouse",
    "Commercial",
    "Office",
  ];

  const bedOptions = ["1", "2", "3", "4", "5", "6+"];

  const bedroomOptions = ["Studio", "1", "2", "3", "4", "5", "6", "7+"];

  const bathroomOptions = ["1", "2", "3", "4", "5+"];

  const priceRanges = [
    "0 - 500,000 QAR",
    "500,000 - 1,000,000 QAR",
    "1,000,000 - 2,000,000 QAR",
    "2,000,000 - 5,000,000 QAR",
    "5,000,000+ QAR",
  ];

  const furnishingOptions = [
    "All furnishings",
    "Furnished",
    "Unfurnished",
    "Partly furnished",
  ];

  const amenities = [
    "Central A/C",
    "Maids Room",
    "Balcony",
    "Shared Pool",
    "Shared Spa",
    "Shared Gym",
    "Concierge Service",
    "Covered Parking",
    "View of Water",
    "View of Landmark",
    "Pets Allowed",
    "Study",
  ];

  const handleShowResults = () => {
    if (onShowResults) {
      onShowResults();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col mt-4">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-[#001730]">
                  More Filters
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="overflow-y-auto flex-1 p-4 sm:p-6 pb-8">
                {/* 1. Location Section */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection("location")}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-[#001730]" />
                      <span className="font-medium text-[#001730]">Location</span>
                    </div>
                    <ArrowDown
                      size={16}
                      className={`text-gray-600 transition-transform ${openSections.location ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {openSections.location && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden"
                    >
                      {/* Search Input Box */}
                      <div className="flex items-center px-3 sm:px-4 md:px-5 lg:px-6 bg-white rounded-[3px] border border-gray-300 py-2 sm:py-2.5 md:py-3 lg:py-4 mb-4">
                        <div className="p-1 sm:p-1.5 bg-[#001730] rounded-[3px] flex items-center justify-center h-[24px] w-[24px] sm:h-[28px] sm:w-[28px]">
                          <Search className="text-white h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search location..."
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          className="flex-1 ml-2 sm:ml-3 md:ml-4 outline-none text-xs sm:text-sm md:text-[10px] lg:text-sm xl:text-base 2xl:text-lg"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 2. Property Type Section */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection("propertyType")}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Building size={18} className="text-[#001730]" />
                      <span className="font-medium text-[#001730]">Property Type</span>
                    </div>
                    <ArrowDown
                      size={16}
                      className={`text-gray-600 transition-transform ${openSections.propertyType ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {openSections.propertyType && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 p-3 bg-white border border-gray-200 rounded-[5px]">
                        {propertyTypes.map((type, index) => (
                          <button
                            key={index}
                            className="px-4 py-2 rounded-[5px] text-sm font-medium transition bg-gray-100 text-[#001730] hover:bg-gray-200"
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 3. Bedrooms Section */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection("bedrooms")}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Bed size={18} className="text-[#001730]" />
                      <span className="font-medium text-[#001730]">Bedrooms</span>
                    </div>
                    <ArrowDown
                      size={16}
                      className={`text-gray-600 transition-transform ${openSections.bedrooms ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {openSections.bedrooms && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="p-3 bg-white border border-gray-200 rounded-[5px]">
                        {/* Studio and 1-7 as buttons */}
                        <div className="flex flex-wrap gap-2 justify-start items-center">
                          {bedroomOptions.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                if (selectedBedrooms.includes(option)) {
                                  setSelectedBedrooms(selectedBedrooms.filter(b => b !== option));
                                } else {
                                  setSelectedBedrooms([...selectedBedrooms, option]);
                                }
                              }}
                              className={`px-4 py-2 rounded-[5px] text-sm font-medium transition ${selectedBedrooms.includes(option)
                              ? "bg-[#001730] text-white"
                              : "bg-gray-100 text-[#001730] hover:bg-gray-200"
                              }`}
                          >
                            {option}
                          </button>
                        ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 4. Price Range Section */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection("priceRange")}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <DollarSign size={18} className="text-[#001730]" />
                      <span className="font-medium text-[#001730]">Price Range</span>
                    </div>
                    <ArrowDown
                      size={16}
                      className={`text-gray-600 transition-transform ${openSections.priceRange ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {openSections.priceRange && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="p-4 bg-white border border-gray-200 rounded-[5px]">
                        {/* Price Display */}
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm font-medium text-[#001730]">
                            Min: {minPrice.toLocaleString()} QAR
                          </div>
                          <div className="text-sm font-medium text-[#001730]">
                            Max: {maxPrice.toLocaleString()} QAR
                          </div>
                        </div>

                        {/* Dual Range Slider */}
                        <div className="relative h-8">
                          {/* Track Background */}
                          <div className="absolute top-3 left-0 right-0 h-2 bg-gray-200 rounded-full"></div>

                          {/* Active Range */}
                          <div
                            className="absolute top-3 h-2 bg-[#001730] rounded-full"
                            style={{
                              left: `${((minPrice - 1000) / (10000000 - 1000)) * 100}%`,
                              width: `${((maxPrice - minPrice) / (10000000 - 1000)) * 100}%`,
                            }}
                          ></div>

                          {/* Min Price Slider */}
                        <input
                            type="range"
                            min="1000"
                            max={maxPrice}
                            step="1000"
                            value={minPrice}
                            onChange={(e) => {
                              const newMin = parseInt(e.target.value);
                              if (newMin < maxPrice) {
                                setMinPrice(newMin);
                              } else if (newMin >= maxPrice) {
                                setMinPrice(Math.max(1000, maxPrice - 1000));
                              }
                            }}
                            className="absolute top-0 w-full h-8 bg-transparent appearance-none cursor-pointer"
                            style={{
                              zIndex: 1,
                            }}
                          />

                          {/* Max Price Slider */}
                        <input
                            type="range"
                            min={minPrice}
                            max="10000000"
                            step="1000"
                            value={maxPrice}
                            onChange={(e) => {
                              const newMax = parseInt(e.target.value);
                              if (newMax > minPrice) {
                                setMaxPrice(newMax);
                              } else if (newMax <= minPrice) {
                                setMaxPrice(Math.min(10000000, minPrice + 1000));
                              }
                            }}
                            className="absolute top-0 w-full h-8 bg-transparent appearance-none cursor-pointer"
                            style={{
                              zIndex: 2,
                            }}
                          />
                        </div>

                        {/* Slider Styles */}
                        <style dangerouslySetInnerHTML={{
                          __html: `
                            input[type="range"]::-webkit-slider-thumb {
                              appearance: none;
                              width: 20px;
                              height: 20px;
                              border-radius: 50%;
                              background: #001730;
                              cursor: pointer;
                              border: 2px solid white;
                              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                            }
                            input[type="range"]::-moz-range-thumb {
                              width: 20px;
                              height: 20px;
                              border-radius: 50%;
                              background: #001730;
                              cursor: pointer;
                              border: 2px solid white;
                              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                            }
                            input[type="range"]::-webkit-slider-runnable-track {
                              height: 2px;
                            }
                            input[type="range"]::-moz-range-track {
                              height: 2px;
                            }
                          `
                        }} />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 5. Amenities Section */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection("amenities")}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Gem size={18} className="text-[#001730]" />
                      <span className="font-medium text-[#001730]">Amenities</span>
                    </div>
                    <ArrowDown
                      size={16}
                      className={`text-gray-600 transition-transform ${openSections.amenities ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {openSections.amenities && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-white border border-gray-200 rounded-md">
                        {amenities.map((amenity, index) => (
                          <label
                            key={index}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-[#001730] border-gray-300 rounded focus:ring-[#001730]"
                            />
                            <span className="text-sm text-gray-700">{amenity}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer with Filter Bar */}
              <div className="border-t border-gray-200">
                {/* Results Button */}
                <div className="p-4 sm:p-6">
                  <button
                    onClick={handleShowResults}
                    className="w-full bg-[#001730] hover:bg-[#002d52] text-white font-medium py-3 px-6 rounded-md transition"
                  >
                    Show 8,859 results
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

