"use client";
import { useState } from "react";
import { ArrowDown, X, Sofa, Ruler, Gem, MapPin, Building, ListChecks } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MoreFiltersModal({ isOpen, onClose, onShowResults }) {
  const [openSections, setOpenSections] = useState({
    furnishing: false,
    propertySize: false,
    amenities: false,
    location: false,
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

  const locations = [
    "West Bay",
    "The Pearl",
    "Lusail City",
    "Al Sadd",
    "Al Dafna",
    "Doha",
    "Pearl Island",
  ];

  const propertyTypes = [
    "Apartment",
    "Villa",
    "Penthouse",
    "Townhouse",
    "Commercial",
    "Office",
  ];

  const bedOptions = ["1", "2", "3", "4", "5", "6+"];

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
                {/* Furnishing Section */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection("furnishing")}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Sofa size={18} className="text-[#001730]" />
                      <span className="font-medium text-[#001730]">Furnishing</span>
                    </div>
                    <ArrowDown
                      size={16}
                      className={`text-gray-600 transition-transform ${openSections.furnishing ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {openSections.furnishing && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 p-3 bg-white border border-gray-200 rounded-md">
                        {furnishingOptions.map((option, index) => (
                          <button
                            key={index}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${index === 0
                              ? "bg-[#001730] text-white"
                              : "bg-gray-100 text-[#001730] hover:bg-gray-200"
                              }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Property Size Section */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection("propertySize")}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Ruler size={18} className="text-[#001730]" />
                      <span className="font-medium text-[#001730]">Property Size (Sqm)</span>
                    </div>
                    <ArrowDown
                      size={16}
                      className={`text-gray-600 transition-transform ${openSections.propertySize ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {openSections.propertySize && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md">
                        <input
                          type="number"
                          placeholder="Min. Area"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001730] text-sm"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                          type="number"
                          placeholder="Max. Area"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001730] text-sm"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Amenities Section */}
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

                {/* Location Section */}
                <div className="mb-8">
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
                      className="mt-2 overflow-hidden"
                    >
                      <div className="p-4 pb-8 ">
                        <div className="flex flex-wrap gap-3 mb-4">
                          {/* Location Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() => toggleFilterBarDropdown("location")}
                              className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-6 py-2 text-sm text-[#001730] hover:bg-gray-50 transition"
                            >
                              <MapPin size={16} />
                              <span>Location</span>
                              <ArrowDown
                                size={14}
                                className={`transition-transform ${openFilterBarDropdowns.location ? "rotate-180" : ""}`}
                              />
                            </button>
                            {openFilterBarDropdowns.location && (
                              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                                {locations.map((location, index) => (
                                  <button
                                    key={index}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-[#001730]"
                                    onClick={() => toggleFilterBarDropdown("location")}
                                  >
                                    {location}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Property Type Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() => toggleFilterBarDropdown("propertyType")}
                              className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-6 py-2 text-sm text-[#001730] hover:bg-gray-50 transition"
                            >
                              <Building size={16} />
                              <span>Property type</span>
                              <ArrowDown
                                size={14}
                                className={`transition-transform ${openFilterBarDropdowns.propertyType ? "rotate-180" : ""}`}
                              />
                            </button>
                            {openFilterBarDropdowns.propertyType && (
                              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                                {propertyTypes.map((type, index) => (
                                  <button
                                    key={index}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-[#001730]"
                                    onClick={() => toggleFilterBarDropdown("propertyType")}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Furnishings Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() => toggleFilterBarDropdown("furnishings")}
                              className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-6 py-2 text-sm text-[#001730] hover:bg-gray-50 transition"
                            >
                              <Sofa size={16} />
                              <span>Furnishings</span>
                              <ArrowDown
                                size={14}
                                className={`transition-transform ${openFilterBarDropdowns.furnishings ? "rotate-180" : ""}`}
                              />
                            </button>
                            {openFilterBarDropdowns.furnishings && (
                              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                                {furnishingOptions.map((option, index) => (
                                  <button
                                    key={index}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-[#001730]"
                                    onClick={() => toggleFilterBarDropdown("furnishings")}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
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

