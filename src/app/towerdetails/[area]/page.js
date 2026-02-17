'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { MapPin } from 'lucide-react'
import { FaArrowRight, FaChevronUp, FaChevronDown } from 'react-icons/fa6'
import { FaHome, FaBuilding, FaRegSquare, FaDollarSign, FaUser, FaWifi, FaSwimmingPool, FaDumbbell, FaParking, FaSnowflake, FaDog, FaShieldAlt, FaTv, FaUtensils, FaArrowUp } from 'react-icons/fa'
import Link from 'next/link'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ShareButton from '../../../components/ShareButton'
import { useParams } from 'next/navigation'
import { getApiUrl } from '@/config/api'

export default function TowerDetailsPage() {
  const params = useParams()
  // Route param now represents the area ID directly
  const areaIdFromRoute = params.area
  const [open, setOpen] = useState(null)
  const [area, setArea] = useState(null)
  const [properties, setProperties] = useState([])
  const [agents, setAgents] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview") // overview, nearby, 360view
  const [nearbyAreas, setNearbyAreas] = useState([])
  const [allNearbyAreas, setAllNearbyAreas] = useState([]) // Store all nearby areas
  const [displayedAreasCount, setDisplayedAreasCount] = useState(6) // Initial display count
  const [viewMode, setViewMode] = useState("properties") // "properties" | "agents" | "projects"

  const toggle = (i) => setOpen(open === i ? null : i)

  // Handle Load More for nearby areas
  const handleLoadMoreAreas = () => {
    const nextCount = displayedAreasCount + 6
    const newCount = Math.min(nextCount, allNearbyAreas.length)
    setDisplayedAreasCount(newCount)
    setNearbyAreas(allNearbyAreas.slice(0, newCount))
  }

  // Fetch area details and all properties for this area ID
  useEffect(() => {
    const fetchAreaData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Step 1: Direct call using area ID from route to get area details
        const areaDetailsUrl = getApiUrl(`api/v1/areas/${areaIdFromRoute}/full-details?page=1&limit=50`)
        const detailsResponse = await fetch(areaDetailsUrl)
        
        if (!detailsResponse.ok) {
          throw new Error('Failed to fetch area details')
        }

        const detailsData = await detailsResponse.json()
        const areaInfo = detailsData.area || {}
        
        // Map area data
        const mappedArea = {
          id: areaInfo.id || areaIdFromRoute,
          name: areaInfo.nameEn || areaInfo.name || '',
          title: `Welcome to ${areaInfo.nameEn || areaInfo.name || ''}`,
          image: areaInfo.imageUrl || areaInfo.imageUrlEn || '/images_pages/listings.png',
          description: areaInfo.descriptionEn || '',
          description2: areaInfo.descriptionAr || '',
          areaId: areaInfo.id || areaIdFromRoute,
          totalProperties: detailsData.listingsCount || detailsData.properties?.length || 0,
          status: areaInfo.status || 'active',
          locationLevel1: areaInfo.locationLevel1 || areaInfo.nameEn || '',
          locationLevel2: areaInfo.locationLevel2,
          locationLevel3: areaInfo.locationLevel3,
          latitude: areaInfo.latitude || areaInfo.lat,
          longitude: areaInfo.longitude || areaInfo.lng || areaInfo.lon,
          virtualTourUrl: areaInfo.virtualTourUrl || null,
          amenities: areaInfo.amenities || [],
          nearestPlaces: Array.isArray(areaInfo.nearestPlaces) ? areaInfo.nearestPlaces : []
        }

        // Step 2: Fetch properties for this area WITH agent details
        const areaPropertiesUrl = getApiUrl(`api/v1/areas/${areaIdFromRoute}/properties`)
        const areaPropertiesResponse = await fetch(areaPropertiesUrl)
        if (!areaPropertiesResponse.ok) {
          throw new Error('Failed to fetch properties for this area')
        }
        const areaPropertiesData = await areaPropertiesResponse.json()

        const rawProperties = Array.isArray(areaPropertiesData.properties)
          ? areaPropertiesData.properties
          : []

        // Derive unique agents from properties (for Agents view)
        const agentsMap = new Map()
        rawProperties.forEach((item) => {
          if (item.agent && typeof item.agent === 'object') {
            const agentObj = item.agent
            const agentId = agentObj.id || agentObj._id || agentObj.userId || agentObj.email || agentObj.name
            if (agentId && !agentsMap.has(agentId)) {
              agentsMap.set(agentId, agentObj)
            }
          }
        })

        // Prefer totalProperties/count from this endpoint
        const updatedArea = {
          ...mappedArea,
          totalProperties: areaPropertiesData.count ?? mappedArea.totalProperties
        }

        setArea(updatedArea)
        setProperties(rawProperties)
        setAgents(Array.from(agentsMap.values()))

        // Step 3: Fetch projects for this area
        const areaProjectsUrl = getApiUrl(`api/v1/areas/${areaIdFromRoute}/projects`)
        const areaProjectsResponse = await fetch(areaProjectsUrl)
        if (areaProjectsResponse.ok) {
          const areaProjectsData = await areaProjectsResponse.json()
          setProjects(Array.isArray(areaProjectsData.projects) ? areaProjectsData.projects : [])
        } else {
          setProjects([])
        }

        // Step 4: Fetch nearby areas list (other areas)
        const areasListUrl = getApiUrl('api/v1/areas/list')
        const areasResponse = await fetch(areasListUrl)
        if (areasResponse.ok) {
          const areasData = await areasResponse.json()
          const allAreas = areasData.areas || []
          const nearby = allAreas
            .filter(a => a.area_id !== mappedArea.id && a.area_name)
            .map(a => ({
              id: a.area_id,
              name: a.area_name,
              image: a.area_image || '/images_pages/listings.png',
              description: a.descriptionEn || ''
            }))
          // Store all nearby areas
          setAllNearbyAreas(nearby)
          // Initially display only first 6
          setNearbyAreas(nearby.slice(0, 6))
          setDisplayedAreasCount(6)
        }
      } catch (err) {
        console.error('Error fetching area data:', err)
        setError(err.message)
        setArea(null)
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    if (areaIdFromRoute) {
      fetchAreaData()
    }
  }, [areaIdFromRoute])

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen relative">
        <div className="absolute top-0 left-0 right-0 z-30">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading area details...</div>
        </div>
      </main>
    )
  }

  // Show error or fallback
  if (!area) {
    return (
      <main className="min-h-screen relative">
        <div className="absolute top-0 left-0 right-0 z-30">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Area not found</div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] relative">
      {/* 🔹 HERO SECTION - Full Height with Header Overlay */}
      <section className="relative w-full bg-[#F5F7FA] min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src={area.image || "/images_pages/listings.png"}
          alt={area.name}
          fill
          className="object-cover"
          priority
        />

        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 z-30">
          <Header />
        </div>

        {/* Left-side positioned glass box (same as projects page) */}
        <div className="absolute left-4 md:left-8 lg:left-12 top-[55%] md:top-[56%] lg:top-[57%] transform -translate-y-1/2 z-20 w-[90%] md:w-[60%] lg:w-[60%]">
          <div className="glass-effect text-center rounded-lg shadow-lg p-4 sm:p-6 md:p-10 lg:text-left w-full max-w-5xl mx-auto mt-4 md:mt-6 lg:mt-8">
            {/* Area Name */}
            {loading ? (
              <div className="text-white text-2xl lg:text-3xl font-bold mb-4"></div>
            ) : area ? (
              <>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text4xl font-bold text-[#001730] mb-3 sm:mb-4 px-10 lg:px-0">
                  {area.name || area.title || "Area"}
                </h1>

                <div className="flex items-center gap-2 mb-4 sm:mb-6 px-10 lg:px-0">  <MapPin size={18} className="text-[#001730] flex-shrink-0" /> Kingdom of Qatar</div>
                

              

                {/* Divider */}
                <div className="w-[80%] h-[0.5px] bg-gray-300 my-4 sm:my-6 mx-auto lg:mx-0 lg:mr-40"></div>

                {/* Amenities Section */}
                {area.amenities && area.amenities.length > 0 && (
                  <div className="px-10 lg:px-0 lg:mr-40">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#001730] mb-3 sm:mb-4">
                      Amenities
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                      {area.amenities.map((amenity, idx) => {
                        // Map amenity names to icons
                        const getAmenityIcon = (amenityName) => {
                          const name = amenityName?.toLowerCase() || '';
                          if (name.includes('wifi') || name.includes('internet')) return <FaWifi className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('pool') || name.includes('swimming')) return <FaSwimmingPool className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('gym') || name.includes('fitness')) return <FaDumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('parking')) return <FaParking className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('ac') || name.includes('air conditioning')) return <FaSnowflake className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('pet') || name.includes('dog')) return <FaDog className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('security') || name.includes('guard')) return <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('elevator') || name.includes('lift')) return <FaArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('tv') || name.includes('television')) return <FaTv className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          if (name.includes('kitchen') || name.includes('restaurant')) return <FaUtensils className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                          return <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />;
                        };

                        // Format amenity name (convert "shared-pool" to "Shared Pool")
                        const amenityName = amenity
                          .split('-')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');

                        return (
                          <div
                            key={idx}
                            className="
                              flex items-center gap-2 sm:gap-3
                              bg-white/40
                              px-2 sm:px-3
                              h-10 sm:h-10
                              rounded-[5px]
                              shadow-sm
                              backdrop-blur-md
                            "
                          >
                            {/* Icon */}
                            {getAmenityIcon(amenity)}
                            {/* Text */}
                            <p className="font-semibold text-[#001730] text-xs sm:text-sm whitespace-nowrap truncate w-full" title={amenityName}>
                              {amenityName}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Nearest places gallery */}
                {area.nearestPlaces && area.nearestPlaces.length > 0 && (
                  <div className="px-10 lg:px-0 lg:mr-40 mt-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#001730] mb-3 sm:mb-4">
                      Nearest Places
                    </h3>
                    <div className="flex justify-start gap-4 sm:gap-6">
                      {area.nearestPlaces.slice(0, 4).map((place, index) => (
                        <div
                          key={place.titleEn || place.titleAr || index}
                          className="relative w-28 h-24 sm:w-36 sm:h-28 md:w-48 md:h-32 rounded-2xl overflow-hidden shadow-md"
                        >
                          <Image
                            src={place.pictureUrl || "/images_pages/listings.png"}
                            alt={place.titleEn || place.titleAr || 'Nearby place'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <h1 className="text-2xl lg:text-3xl font-bold text-[#001730]">Area</h1>
            )}
          </div>
        </div>
      </section>

      <section className="w-full bg-[#F5F7FA]">
        {/* Toggle buttons section (same as projects page) */}
        <div className="flex items-center bg-[#F5F7FA] gap-4 mt-5">
          {/* Center line */}
          <div className="flex-1 h-[1px] bg-gray-300 hidden sm:block"></div>

          {/* Properties / Agents / Projects buttons (glass style) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("properties")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-all
                ${
                  viewMode === "properties"
                    ? "border border-white/40 backdrop-blur-md bg-[#e3e2d8]/40 text-[#001730] shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                    : "text-gray-600"
                }`}
            >
              <FaHome size={14} />
              <span>Properties</span>
            </button>

            {/* Divider */}
            <div className="h-4 w-[1px] bg-gray-300 mx-0.5 hidden sm:block"></div>

            <button
              onClick={() => setViewMode("agents")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-all
                ${
                  viewMode === "agents"
                    ? "border border-white/40 backdrop-blur-md bg-[#e3e2d8]/40 text-[#001730] shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                    : "text-gray-600"
                }`}
            >
              <FaUser size={14} />
              <span>Agents</span>
            </button>
            
            <div className="h-4 w-[1px] bg-gray-300 mx-0.5 hidden sm:block"></div>

            <button
              onClick={() => setViewMode("projects")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-all
                ${
                  viewMode === "projects"
                    ? "border border-white/40 backdrop-blur-md bg-[#e3e2d8]/40 text-[#001730] shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                    : "text-gray-600"
                }`}
            >
              <FaBuilding size={14} />
              <span>Projects</span>
            </button>
          </div>
        </div>

        {/* 🔹 CONTENT GRID */}
        <div className="max-w-[2800px] mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ================= LEFT SECTION ================= */}
          <div className="lg:col-span-7">
    

            {/* Description box */}
            <div className="bg-white p-4 sm:p-6 rounded-[5px] shadow mb-4">
              <div className="flex gap-2 sm:gap-4 mb-4">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-[5px] shadow text-xs sm:text-base font-semibold transition-all ${
                    activeTab === "overview"
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
                {/* <button
                  onClick={() => setActiveTab("nearby")}
                  className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-[5px] shadow text-xs sm:text-base font-semibold transition-all ${
                    activeTab === "nearby"
                      ? "bg-white text-[#001730]"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  Nearby
                  {activeTab === "nearby" ? (
                    <FaChevronDown size={14} />
                  ) : (
                    <FaChevronUp size={14} />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("360view")}
                  className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-[5px] shadow text-xs sm:text-base font-semibold transition-all ${
                    activeTab === "360view"
                      ? "bg-white text-[#001730]"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  360 view
                  {activeTab === "360view" ? (
                    <FaChevronDown size={14} />
                  ) : (
                    <FaChevronUp size={14} />
                  )}
                </button> */}
              </div>

              {/* Tab Content */}
              {area ? (
                <>
                  {activeTab === "overview" && (
                    <>
                      {area.description ? (
                        <div className="text-gray-600 text-sm sm:text-base mx-4 sm:mx-10 leading-relaxed mb-4">
                          {(() => {
                            // Function to strip HTML tags and format list items
                            const formatDescription = (text) => {
                              if (!text) return '';
                              
                              // Remove <ul> and </ul> tags
                              let formatted = text.replace(/<\/?ul>/gi, '');
                              
                              // Replace <li> with bullet point and </li> with line break
                              formatted = formatted.replace(/<li>/gi, '• ');
                              formatted = formatted.replace(/<\/li>/gi, '\n');
                              
                              // Remove any remaining HTML tags
                              formatted = formatted.replace(/<[^>]*>/g, '');
                              
                              // Decode HTML entities
                              formatted = formatted
                                .replace(/&nbsp;/g, ' ')
                                .replace(/&amp;/g, '&')
                                .replace(/&lt;/g, '<')
                                .replace(/&gt;/g, '>')
                                .replace(/&quot;/g, '"')
                                .replace(/&#39;/g, "'");
                              
                              // Split by line breaks and filter empty lines
                              const lines = formatted.split('\n').filter(line => line.trim());
                              
                              return lines.map((line, index) => (
                                <p key={index} className="mb-2">
                                  {line.trim()}
                                </p>
                              ));
                            };
                            
                            return formatDescription(area.description);
                          })()}
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm sm:text-base mx-4 sm:mx-10 leading-relaxed mb-4">
                          No description available for this area.
                        </p>
                      )}
                      {area.description2 && (
                        <div className="text-gray-600 text-sm sm:text-base mx-4 sm:mx-10 leading-relaxed mb-4">
                          {(() => {
                            // Function to strip HTML tags and format list items
                            const formatDescription = (text) => {
                              if (!text) return '';
                              
                              // Remove <ul> and </ul> tags
                              let formatted = text.replace(/<\/?ul>/gi, '');
                              
                              // Replace <li> with bullet point and </li> with line break
                              formatted = formatted.replace(/<li>/gi, '• ');
                              formatted = formatted.replace(/<\/li>/gi, '\n');
                              
                              // Remove any remaining HTML tags
                              formatted = formatted.replace(/<[^>]*>/g, '');
                              
                              // Decode HTML entities
                              formatted = formatted
                                .replace(/&nbsp;/g, ' ')
                                .replace(/&amp;/g, '&')
                                .replace(/&lt;/g, '<')
                                .replace(/&gt;/g, '>')
                                .replace(/&quot;/g, '"')
                                .replace(/&#39;/g, "'");
                              
                              // Split by line breaks and filter empty lines
                              const lines = formatted.split('\n').filter(line => line.trim());
                              
                              return lines.map((line, index) => (
                                <p key={index} className="mb-2">
                                  {line.trim()}
                                </p>
                              ));
                            };
                            
                            return formatDescription(area.description2);
                          })()}
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === "nearby" && (
                    <div className="mx-4 sm:mx-10 mb-4">
                      {nearbyAreas.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {nearbyAreas.map((nearbyArea) => (
                            <Link
                              key={nearbyArea.id}
                              href={`/towerdetails/${nearbyArea.id}`}
                              className="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                              <div className="relative h-48">
                                <Image
                                  src={nearbyArea.image}
                                  alt={nearbyArea.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="text-lg font-semibold text-[#001730] mb-2">
                                  {nearbyArea.name}
                                </h3>
                                {nearbyArea.description && (
                                  <p className="text-gray-600 text-sm line-clamp-2">
                                    {nearbyArea.description}
                                  </p>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No nearby areas available</p>
                      )}
                    </div>
                  )}

                  {activeTab === "360view" && (
                    <div className="mx-4 sm:mx-10 mb-4">
                      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-[5px] overflow-hidden bg-gray-100 shadow-lg">
                        {area.virtualTourUrl ? (
                          <iframe
                            src={area.virtualTourUrl}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="fullscreen; vr"
                            allowFullScreen
                            title="360 Virtual Tour"
                          ></iframe>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                            <div className="text-center p-8">
                              <h3 className="text-xl sm:text-2xl font-semibold text-[#001730] mb-2">
                                360° Virtual Tour
                              </h3>
                              <p className="text-gray-600 text-sm sm:text-base">
                                360° virtual tour will be available here
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 mx-4 sm:mx-10">Area details not available</div>
              )}
              <div className="w-[90%] h-[0.2px] px-10 mx-4 sm:mx-10 mt-2 3xl:mt-3 bg-gray-400 mb-3 md:mb-4 3xl:mb-5"></div>
              {/* Bottom stats */}
              {area && (
                <div className="grid grid-cols-3 mx-4 sm:mx-10 pt-4 mt-4">
                  {[
                    { title: "Total Properties", value: area.totalProperties ? `${area.totalProperties} Properties` : "N/A", icon: "properties" },
                    { title: "Area Name", value: area.name || "N/A", icon: "name" },
                    { title: "Status", value: area.status || "N/A", icon: "status" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex flex-col pl-2 sm:pl-4 ${i !== 2 ? "border-r border-gray-400" : ""
                        }`}
                    >
                      {/* TITLE + ICON SIDE BY SIDE */}
                      <div className="flex items-center gap-1 sm:gap-2">
                        {item.icon === "properties" && (
                          <FaHome className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        )}
                        {item.icon === "name" && (
                          <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        )}
                        {item.icon === "status" && (
                          <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        )}
                        <p className="text-gray-500 text-xs sm:text-sm">{item.title}</p>
                      </div>

                      {/* VALUE BELOW */}
                      <h3 className="text-[#001730] text-base sm:text-md font-semibold mt-1">
                        {item.value}
                      </h3>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Map Section with Lat/Long Support */}
            {area && (
              <div className="mt-4 sm:mt-6 bg-white rounded-[5px] shadow p-0 h-[250px] sm:h-[300px] overflow-hidden mb-4">
                <iframe
                  src={(() => {
                    // Priority: Use lat/long if available, then location levels, then area name
                    if (area.latitude && area.longitude) {
                      // Use coordinates for precise location
                      return `https://www.google.com/maps?q=${area.latitude},${area.longitude}&output=embed&hl=en&z=15`;
                    }
                    
                    // Fallback to location string
                    const locationParts = [
                      area.locationLevel1,
                      area.locationLevel2,
                      area.locationLevel3
                    ].filter(Boolean);
                    
                    const locationQuery = locationParts.length > 0 
                      ? encodeURIComponent(locationParts.join(', ') + ', Qatar')
                      : encodeURIComponent((area.name || 'Doha') + ', Qatar');
                    
                    return `https://www.google.com/maps?q=${locationQuery}&output=embed&hl=en`;
                  })()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )}

        
          </div>

          {/* ================= RIGHT SECTION ================= */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 relative">

              {viewMode === "properties" ? (
                <>
                

                  {/* 🔹 PROPERTY LIST (same layout as project page) */}
                  <div className="space-y-3 relative z-10">
                    {error ? (
                      <div className="text-red-500 text-sm">{error}</div>
                    ) : properties.length > 0 ? (
                      properties.slice(0, 4).map((property) => {
                        const prop = property.property || property

                        const locationParts = [
                          prop.locationLevel2,
                          prop.locationLevel3,
                          prop.locationLevel4
                        ].filter(Boolean)
                        const location = locationParts.length > 0
                          ? locationParts.join(' – ')
                          : prop.locationLevel1 || area.name || 'Doha'

                        let areaDisplay = 'N/A'
                        if (prop.area) {
                          if (typeof prop.area === 'number' || typeof prop.area === 'string') {
                            areaDisplay = `${prop.area} sqft`
                          } else if (typeof prop.area === 'object' && (prop.area.value || prop.area.area)) {
                            areaDisplay = `${prop.area.value || prop.area.area} sqft`
                          }
                        } else if (prop.areaSqft) {
                          areaDisplay = `${prop.areaSqft} sqft`
                        }

                        // Image selection logic similar to project page
                        let mainImage = prop.coverPicture || prop.gallery?.[0] || prop.imageUrl || "/div.property-thumbnail-wrapper.png"

                        return (
                          <div
                            key={prop.id || prop.propertyId || property.id}
                            className="bg-[#E9E9E9] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex flex-col sm:flex-row">
                              {/* Image Section */}
                              <div className="relative w-full sm:w-[260px] h-[200px] sm:h-auto flex-shrink-0">
                                <Image
                                  src={mainImage}
                                  alt={prop.titleEn || prop.title || "Property"}
                                  fill
                                  className="object-cover"
                                  unoptimized={mainImage.startsWith('http')}
                                />
                                <div className="absolute bottom-2 right-2 z-10">
                                  <ShareButton
                                    propertyTitle={prop.titleEn || prop.title || "Property"}
                                    propertyLocation={location}
                                    propertyUrl={typeof window !== 'undefined' ? window.location.href : ''}
                                  />
                                </div>
                              </div>

                              {/* Details Section */}
                              <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                                <div>
                                  <h3 className="text-base sm:text-lg font-bold text-[#001730] mb-2 line-clamp-2">
                                    {prop.titleEn || prop.title || "Property"}
                                  </h3>

                                  <div className="flex items-center text-[#001730] text-xs sm:text-sm mb-3">
                                    <MapPin size={12} className="mr-1.5 flex-shrink-0" />
                                    <span className="truncate">{location}</span>
                                  </div>

                                  <div className="grid grid-cols-3 gap-2 text-[#001730] text-xs sm:text-sm mb-4">
                                    {/* Beds */}
                                    <div className="flex items-center justify-center gap-1.5 bg-gray-50 shadow-sm p-2 rounded-md">
                                      <Image
                                        src="/Icon (1).png"
                                        alt="Beds"
                                        width={14}
                                        height={14}
                                        className="w-4 h-4 flex-shrink-0"
                                      />
                                      <span className="font-medium">{prop.bedrooms || '0'}</span>
                                    </div>

                                    {/* Baths */}
                                    <div className="flex items-center justify-center gap-1.5 bg-gray-50 shadow-sm p-2 rounded-md">
                                      <Image
                                        src="/Icon.png"
                                        alt="Baths"
                                        width={14}
                                        height={14}
                                        className="w-4 h-4 flex-shrink-0"
                                      />
                                      <span className="font-medium">{prop.bathrooms || '0'}</span>
                                    </div>

                                    {/* Area */}
                                    <div className="flex items-center justify-center gap-1.5 bg-gray-50 shadow-sm p-2 rounded-md">
                                      <Image
                                        src="/Icon (2).png"
                                        alt="Area"
                                        width={14}
                                        height={14}
                                        className="w-4 h-4 flex-shrink-0"
                                      />
                                      <span className="font-medium truncate text-xs">{areaDisplay}</span>
                                    </div>
                                  </div>

                                  <div className="w-full h-[0.5px] bg-gray-300 my-3"></div>
                                </div>

                                <div className="flex items-center justify-between gap-3 mt-2">
                                  <p className="text-base sm:text-lg font-bold text-[#001730]">
                                    {prop.priceAmount ? prop.priceAmount.toLocaleString() : '0'} QAR
                                  </p>
                                  <Link href={`/propertydetails?id=${prop.id || prop.propertyId}`}>
                                    <button className="bg-[#001730] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2 shadow-lg transition-all duration-300 hover:bg-[#002d52] whitespace-nowrap">
                                      <span>Details</span>
                                      <FaArrowRight size={12} />
                                    </button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-gray-500 text-sm">No properties available in this area</div>
                    )}
                  </div>

                  {/* View All Button */}
                  {properties.length > 4 && (
                    <div className="mt-6 relative z-10">
                      <Link href={`/listings?areaId=${area.id || area.areaId}`}>
                        <button className="bg-[#001730] text-white text-sm font-medium px-6 py-3 rounded-md flex items-center justify-center gap-2 w-full shadow-lg transition-all duration-300 hover:bg-[#002d52]">
                          <span>View All</span>
                          <FaArrowRight size={14} />
                        </button>
                      </Link>
                    </div>
                  )}
                </>
              ) : viewMode === "agents" ? (
                <div className="bg-white/80 p-4 sm:p-6 rounded-md shadow relative z-10">
                  {agents && agents.length > 0 ? (
                    <div className="space-y-4">
                      {agents.map((agent, index) => {
                        const agentName = agent.name || agent.fullName || agent.firstName || `Agent ${index + 1}`
                        const agentEmail = agent.email || ''
                        const agentPhone = agent.phone || agent.mobile || ''
                        const agentImage = agent.profilePicture || agent.image || '/div.property-thumbnail-wrapper.png'

                        return (
                          <div
                            key={agent.id || agent._id || agent.userId || index}
                            className="bg-[#E9E9E9] rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow p-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                  src={agentImage}
                                  alt={agentName}
                                  fill
                                  className="object-cover rounded-full"
                                  unoptimized={agentImage.startsWith('http')}
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-[#001730] mb-1">
                                  {agentName}
                                </h3>
                                {agentEmail && (
                                  <p className="text-sm text-gray-600 mb-1">
                                    {agentEmail}
                                  </p>
                                )}
                                {agentPhone && (
                                  <p className="text-sm text-gray-600">
                                    {agentPhone}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">No agents available for this area.</p>
                  )}
                </div>
              ) : (
                <div className="bg-white/80 p-4 sm:p-6 rounded-md shadow relative z-10">
                  {projects && projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.map((proj) => {
                        const projectId = proj.id || proj._id
                        const title = proj.nameEn || proj.nameAr || proj.name || "Untitled Project"
                        const location = [
                          proj.locationLevel1,
                          proj.locationLevel2,
                          proj.locationLevel3,
                          proj.locationLevel4
                        ].filter(Boolean).join(', ')

                        const year = proj.projectCompletionDate
                          ? new Date(proj.projectCompletionDate).getFullYear().toString()
                          : (proj.projectDate
                              ? new Date(proj.projectDate).getFullYear().toString()
                              : '')

                        const units = proj.listingsCount || proj.propertiesCount || "N/A"

                        const image =
                          proj.coverPicture ||
                          (Array.isArray(proj.gallery) && proj.gallery[0]) ||
                          "/div.property-thumbnail-wrapper.png"

                        return (
                          <div
                            key={projectId}
                            className="bg-[#E9E9E9] rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <div className="flex p-4 rounded-md">
                              {/* Image Section - Left */}
                              <div className="relative w-[260px] h-[192px] flex-shrink-0">
                                <Image
                                  src={image}
                                  alt={title}
                                  fill
                                  className="object-cover rounded-md"
                                  unoptimized={image?.startsWith('http')}
                                />
                                {/* Share Button Overlay */}
                                <div className="absolute bottom-2 right-2 z-10">
                                  <ShareButton
                                    propertyTitle={title}
                                    propertyLocation={location}
                                    propertyUrl={typeof window !== 'undefined' ? window.location.href : ''}
                                  />
                                </div>
                              </div>

                              {/* Details Section - Right */}
                              <div className="flex-1 p-4 flex flex-col justify-between">
                                <div>
                                  <h3 className="text-lg font-bold text-[#001730] mb-1">
                                    {title}
                                  </h3>

                                  <div className="flex items-center text-[#001730] text-sm mb-3">
                                    <MapPin size={12} className="mr-2" />
                                    <span>{location || "Location not specified"}</span>
                                  </div>

                                  <div className="grid grid-cols-3 gap-2 lg:gap-4 text-[#001730] text-sm mb-4">
                                    {/* Year */}
                                    <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4 rounded-md justify-center">
                                      <Image
                                        src="/Time.png"
                                        alt="Year"
                                        width={16}
                                        height={16}
                                        className="w-[18px] h-[18px]"
                                      />
                                      <span className="text-xs lg:text-sm">{year || "N/A"}</span>
                                    </div>

                                    {/* Units */}
                                    <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4 rounded-md justify-center">
                                      <Image
                                        src="/3_Icons Used_Project Dvt 1 (1).png"
                                        alt="Units"
                                        width={16}
                                        height={16}
                                        className="w-[18px] h-[18px]"
                                      />
                                      <span className="text-xs lg:text-sm">{units}</span>
                                    </div>

                                    {/* Status (simple) */}
                                    <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4 rounded-md justify-center">
                                      <span className="text-xs lg:text-sm">
                                        {proj.projectStatus || proj.status || "Active"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="w-[100%] h-[0.5px] bg-gray-300 my-3"></div>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-lg font-bold text-[#001730] m-0">
                                    Price on request
                                  </p>
                                  <button className="bg-[#001730] text-white text-[12px] font-medium px-4 py-2 rounded-md flex items-center justify-between shadow-lg transition-all duration-300 hover:bg-[#002d52]">
                                    <Link
                                      href={`/projects/${projectId}`}
                                      className="flex items-center gap-2 w-full"
                                    >
                                      <span>Details</span>
                                      <FaArrowRight
                                        size={12}
                                        className="w-3 h-3 lg:w-[16px] ml-10"
                                      />
                                    </Link>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">No projects available for this area.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Areas Section */}
      {allNearbyAreas.length > 0 && (
        <section className="w-full bg-white py-12">
          <div className="max-w-[2800px] mx-auto px-4">
            <div className="mb-8 text-center">
              <h2
                className="text-[#001730] uppercase mb-2 lg:mb-2 text-center whitespace-nowrap"
                style={{
                  fontSize: "clamp(16px, 4vw, 24px)"
                }}
              >
                Similar Areas
              </h2>
              <div className="flex-1 h-[0.5px] bg-gray-300 my-2 lg:my-2 mx-auto w-[60%] md:w-[40%] lg:w-[20%]"></div>
              <p className="text-gray-600 text-sm sm:text-base mt-4">
                Discover similar areas that might interest you in the same location or with comparable features.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyAreas.map((nearbyArea) => (
                <Link
                  key={nearbyArea.id}
                  href={`/towerdetails/${nearbyArea.id}`}
                  className="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={nearbyArea.image}
                      alt={nearbyArea.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#001730] mb-2">
                      {nearbyArea.name}
                    </h3>
                    {nearbyArea.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {nearbyArea.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {allNearbyAreas.length > displayedAreasCount && (
              <div className="mt-8 text-center">
                <button 
                  onClick={handleLoadMoreAreas}
                  className="bg-[#001730] text-white text-sm font-medium px-6 py-3 rounded-md flex items-center justify-center gap-2 mx-auto shadow-lg transition-all duration-300 hover:bg-[#002d52]"
                >
                  <span>Load More</span>
                  <FaArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}

