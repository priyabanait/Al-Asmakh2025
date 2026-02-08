"use client";
import { useState, useEffect } from "react";
import { ArrowDown, X, Sofa, Ruler, Gem, MapPin, Building, ListChecks, Search, Mic, Bed, DollarSign, User, Briefcase, Bath } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LocationAutocomplete from "./LocationAutocomplete";
import { searchProperties, convertModalFiltersToSearchParams } from "../utils/searchApi";
import { searchPropertiesWithElasticsearch, checkElasticsearchHealth } from "../utils/elasticsearchApi";
import { fetchAgents } from "../utils/propertyapi";
import { fetchProjects } from "../utils/projectapi";

export default function MoreFiltersModal({ isOpen, onClose, onShowResults, hideNewFilters = false, priceType: propPriceType = "rent", projectId }) {
  const [openSections, setOpenSections] = useState({
    location: false,
    propertyType: false,
    size: false,
    agent: false,
    project: false,
    bedrooms: false,
    bathrooms: false,
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
  const [selectedBathrooms, setSelectedBathrooms] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [agentSearch, setAgentSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [sevenPlusChecked, setSevenPlusChecked] = useState(false);
  const [minPrice, setMinPrice] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [priceType, setPriceType] = useState(propPriceType); // Use prop value
  const [isSearching, setIsSearching] = useState(false);
  const [useElasticsearch, setUseElasticsearch] = useState(false);
  
  // Dynamic agents and projects from backend
  const [agentOptions, setAgentOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [allAgents, setAllAgents] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Update priceType when prop changes
  useEffect(() => {
    setPriceType(propPriceType);
  }, [propPriceType]);

  // Check Elasticsearch availability on mount
  useEffect(() => {
    const checkElasticsearch = async () => {
      const isAvailable = await checkElasticsearchHealth();
      setUseElasticsearch(isAvailable);
    };
    checkElasticsearch();
  }, []);

  // Fetch agents and projects from backend on mount
  useEffect(() => {
    const loadAgentsAndProjects = async () => {
      // Fetch agents
      setAgentsLoading(true);
      try {
        const agentsResult = await fetchAgents({ page: 1, limit: 8, status: "active" });
        const agentsList = agentsResult.agents || [];
        setAllAgents(agentsList);
        // Show first 8 agents initially
        setAgentOptions(agentsList.slice(0, 8).map(agent => agent.name));
      } catch (error) {
        console.error("Error fetching agents:", error);
        setAgentOptions([]);
      } finally {
        setAgentsLoading(false);
      }

      // Fetch projects
      setProjectsLoading(true);
      try {
        const projectsResult = await fetchProjects({ page: 1, limit: 8, status: "active" });
        const projectsList = projectsResult.projects || [];
        setAllProjects(projectsList);
        // Show first 8 projects initially
        setProjectOptions(projectsList.slice(0, 8).map(project => project.nameEn || project.name || project.title));
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjectOptions([]);
      } finally {
        setProjectsLoading(false);
      }
    };

    if (isOpen) {
      loadAgentsAndProjects();
    }
  }, [isOpen]);

  // Filter agents and projects based on search
  useEffect(() => {
    if (agentSearch.trim()) {
      const filtered = allAgents
        .filter(agent => agent.name.toLowerCase().includes(agentSearch.toLowerCase()))
        .slice(0, 50) // Limit to 50 results
        .map(agent => agent.name);
      setAgentOptions(filtered);
    } else {
      // Show first 8 when no search
      setAgentOptions(allAgents.slice(0, 8).map(agent => agent.name));
    }
  }, [agentSearch, allAgents]);

  useEffect(() => {
    if (projectSearch.trim()) {
      const filtered = allProjects
        .filter(project => {
          const name = project.nameEn || project.name || project.title || "";
          return name.toLowerCase().includes(projectSearch.toLowerCase());
        })
        .slice(0, 50) // Limit to 50 results
        .map(project => project.nameEn || project.name || project.title);
      setProjectOptions(filtered);
    } else {
      // Show first 8 when no search
      setProjectOptions(allProjects.slice(0, 8).map(project => project.nameEn || project.name || project.title));
    }
  }, [projectSearch, allProjects]);

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


  const bedroomOptions = ["Studio", "1", "2", "3", "4", "5", "6", "7+"];

  const bathroomOptions = ["1", "2", "3", "4", "5+"];

  const sizeOptions = [
    "0 - 500 sqft",
    "500 - 1,000 sqft",
    "1,000 - 2,000 sqft",
    "2,000 - 3,000 sqft",
    "3,000 - 5,000 sqft",
    "5,000+ sqft",
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

  const handleShowResults = async () => {
    try {
      setIsSearching(true);

      // Collect all filter state
      const filterState = {
        locationSearch,
        selectedBedrooms,
        selectedBathrooms,
        selectedSize,
        selectedAgent,
        selectedProject,
        minPrice,
        maxPrice,
        selectedAmenities,
        selectedPropertyType,
        priceType,
      };

      // Convert to search params
      const searchParams = convertModalFiltersToSearchParams(filterState);

      // Add priceType, pagination, status, and projectId if provided
      searchParams.priceType = priceType || propPriceType || "rent";
      searchParams.status = "published";
      searchParams.page = 1;
      searchParams.limit = 50;
      if (projectId) {
        searchParams.projectId = projectId;
      }

      // Call search API - Try Elasticsearch first if available
      let results;
      
      if (useElasticsearch) {
        try {
          results = await searchPropertiesWithElasticsearch(searchParams);
          // If Elasticsearch returns error, fallback to regular search
          if (results.error) {
            console.warn('Elasticsearch error, falling back to regular search:', results.error);
            results = await searchProperties(searchParams);
          }
        } catch (esError) {
          console.warn('Elasticsearch unavailable, falling back to regular search:', esError.message);
          results = await searchProperties(searchParams);
        }
      } else {
        // Use regular search API
        results = await searchProperties(searchParams);
      }

      // Pass results to parent component
      if (onShowResults) {
        onShowResults(results);
      }

      onClose();
    } catch (error) {
      console.error("Search error:", error);
      alert("Search failed: " + (error.message || "Please try again"));
    } finally {
      setIsSearching(false);
    }
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
                  Filters
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
                      {/* Location Autocomplete */}
                      <div className="mb-4">
                        <LocationAutocomplete
                          value={locationSearch}
                          onChange={(value) => setLocationSearch(value)}
                          onSelect={(value) => {
                            setLocationSearch(value);
                          }}
                          placeholder="Search location..."
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
                            onClick={() => setSelectedPropertyType(
                              selectedPropertyType === type ? null : type
                            )}
                            className={`px-4 py-2 rounded-[5px] text-sm font-medium transition ${selectedPropertyType === type
                              ? "bg-[#001730] text-white"
                              : "bg-gray-100 text-[#001730] hover:bg-gray-200"
                              }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 3. Size Section - Hidden on home page */}
                {!hideNewFilters && (
                  <div className="mb-6">
                    <button
                      onClick={() => toggleSection("size")}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Ruler size={18} className="text-[#001730]" />
                        <span className="font-medium text-[#001730]">Size</span>
                      </div>
                      <ArrowDown
                        size={16}
                        className={`text-gray-600 transition-transform ${openSections.size ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {openSections.size && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 overflow-hidden"
                      >
                        <div className="p-3 bg-white border border-gray-200 rounded-[5px]">
                          <div className="flex flex-wrap gap-2 justify-start items-center">
                            {sizeOptions.map((option, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedSize(selectedSize === option ? "" : option)}
                                className={`px-4 py-2 rounded-[5px] text-sm font-medium transition ${selectedSize === option
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
                )}

                {/* 4. Agent Section - Hidden on home page */}
                {!hideNewFilters && (
                  <div className="mb-6">
                    <button
                      onClick={() => toggleSection("agent")}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <User size={18} className="text-[#001730]" />
                        <span className="font-medium text-[#001730]">Agent</span>
                      </div>
                      <ArrowDown
                        size={16}
                        className={`text-gray-600 transition-transform ${openSections.agent ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {openSections.agent && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 overflow-hidden"
                      >
                        <div className="p-3 bg-white border border-gray-200 rounded-[5px]">
                          {/* Search Input Box */}
                          <div className="flex items-center px-3 sm:px-4 bg-white rounded-[3px] border border-gray-300 py-2 mb-4">
                            <div className="p-1 sm:p-1.5 bg-[#001730] rounded-[3px] flex items-center justify-center h-[24px] w-[24px] sm:h-[28px] sm:w-[28px]">
                              <Search className="text-white h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </div>
                            <input
                              type="text"
                              placeholder="Search agent..."
                              value={agentSearch}
                              onChange={(e) => setAgentSearch(e.target.value)}
                              className="flex-1 ml-2 sm:ml-3 outline-none text-xs sm:text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            {agentsLoading ? (
                              <div className="px-4 py-2 text-sm text-gray-500">Loading agents...</div>
                            ) : agentOptions.length === 0 ? (
                              <div className="px-4 py-2 text-sm text-gray-500">No agents found</div>
                            ) : (
                              agentOptions.map((agent, index) => (
                                <button
                                  key={index}
                                  onClick={() => setSelectedAgent(selectedAgent === agent ? "" : agent)}
                                  className={`px-4 py-2 rounded-[5px] text-sm font-medium transition text-left ${selectedAgent === agent
                                    ? "bg-[#001730] text-white"
                                    : "bg-gray-100 text-[#001730] hover:bg-gray-200"
                                    }`}
                                >
                                  {agent}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* 5. Project Section - Hidden on home page */}
                {!hideNewFilters && (
                  <div className="mb-6">
                    <button
                      onClick={() => toggleSection("project")}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Briefcase size={18} className="text-[#001730]" />
                        <span className="font-medium text-[#001730]">Project</span>
                      </div>
                      <ArrowDown
                        size={16}
                        className={`text-gray-600 transition-transform ${openSections.project ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {openSections.project && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 overflow-hidden"
                      >
                        <div className="p-3 bg-white border border-gray-200 rounded-[5px]">
                          {/* Search Input Box */}
                          <div className="flex items-center px-3 sm:px-4 bg-white rounded-[3px] border border-gray-300 py-2 mb-4">
                            <div className="p-1 sm:p-1.5 bg-[#001730] rounded-[3px] flex items-center justify-center h-[24px] w-[24px] sm:h-[28px] sm:w-[28px]">
                              <Search className="text-white h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </div>
                            <input
                              type="text"
                              placeholder="Search project..."
                              value={projectSearch}
                              onChange={(e) => setProjectSearch(e.target.value)}
                              className="flex-1 ml-2 sm:ml-3 outline-none text-xs sm:text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            {projectsLoading ? (
                              <div className="px-4 py-2 text-sm text-gray-500">Loading projects...</div>
                            ) : projectOptions.length === 0 ? (
                              <div className="px-4 py-2 text-sm text-gray-500">No projects found</div>
                            ) : (
                              projectOptions.map((project, index) => (
                                <button
                                  key={index}
                                  onClick={() => setSelectedProject(selectedProject === project ? "" : project)}
                                  className={`px-4 py-2 rounded-[5px] text-sm font-medium transition text-left ${selectedProject === project
                                    ? "bg-[#001730] text-white"
                                    : "bg-gray-100 text-[#001730] hover:bg-gray-200"
                                    }`}
                                >
                                  {project}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}



                {/* 6. Bedrooms Section */}
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

                {/* 7. Bathroom Section - Hidden on home page */}
                {!hideNewFilters && (
                  <div className="mb-6">
                    <button
                      onClick={() => toggleSection("bathrooms")}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Bath size={18} className="text-[#001730]" />
                        <span className="font-medium text-[#001730]">Bathroom</span>
                      </div>
                      <ArrowDown
                        size={16}
                        className={`text-gray-600 transition-transform ${openSections.bathrooms ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {openSections.bathrooms && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 overflow-hidden"
                      >
                        <div className="p-3 bg-white border border-gray-200 rounded-[5px]">
                          <div className="flex flex-wrap gap-2 justify-start items-center">
                            {bathroomOptions.map((option, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  if (selectedBathrooms.includes(option)) {
                                    setSelectedBathrooms(selectedBathrooms.filter(b => b !== option));
                                  } else {
                                    setSelectedBathrooms([...selectedBathrooms, option]);
                                  }
                                }}
                                className={`px-4 py-2 rounded-[5px] text-sm font-medium transition ${selectedBathrooms.includes(option)
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
                )}

                {/* 8. Price Range Section */}
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

                {/* 9. Amenities Section */}
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
                              checked={selectedAmenities.includes(amenity)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAmenities([...selectedAmenities, amenity]);
                                } else {
                                  setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                                }
                              }}
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
                    disabled={isSearching}
                    className={`w-full bg-[#001730] hover:bg-[#002d52] text-white font-medium py-3 px-6 rounded-md transition ${isSearching ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    {isSearching ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Searching...
                      </span>
                    ) : (
                      "Show Results"
                    )}
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

