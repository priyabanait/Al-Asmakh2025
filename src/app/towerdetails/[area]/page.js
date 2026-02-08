'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'
import { FaArrowRight, FaChevronUp, FaChevronDown } from 'react-icons/fa6'
import { FaHome, FaBuilding, FaRegSquare, FaDollarSign } from 'react-icons/fa'
import Link from 'next/link'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ShareButton from '../../../components/ShareButton'
import { useParams } from 'next/navigation'
import { getApiUrl } from '@/config/api'

// Slug to name mapping for finding areas
const slugToNameMap = {
  'west-bay': 'West Bay',
  'lusail-city': 'Lusail City',
  'pearl-island': 'Pearl Island',
  'the-pearl-island': 'Pearl Island',
  'the-pearl': 'Pearl Island',
  'doha': 'Doha',
  'al-sadd': 'Al Sadd',
  'al-dafna': 'Al Dafna',
  'ain-khaled': 'Ain Khaled',
  'ain-khalid': 'Ain Khaled'
}

// Hardcoded area data (fallback)
const areaData = {
  'west-bay': {
    name: 'West Bay',
    title: 'Welcome to West Bay',
    image: '/images/west-bay.jpg',
    description: `West Bay District or famously known as West Bay is considered as the downtown of Doha
      where you can find the tallest skyscrapers, luxurious four and five-star hotels,
      schools, residential towers, oil and gas companies, private and public governmental
      sectors that are located at the west coast of Doha. It also encompasses the city's east
      coast districts, namely, Al Qassar, Al Dafna, West Bay Lagoon, and Onaiza.`,
    description2: `As of 2018, the Qatar Metro Rail, which is a major urban development project funded by
      the government of Qatar officially opened a train station that connected the districts
      from each line (Gold, Red, Green, and Yellow) within Doha to Lusail City.`,
    properties: [
      {
        id: 1,
        image: '/images/property.jpg',
        location: 'West Bay – Doha',
        title: 'Fully Furnished Junior Studio in West Bay | Bills Included',
        price: '7,500',
        bedrooms: '1',
        bathrooms: '1',
        area: '500 sqft'
      },
      {
        id: 2,
        image: '/images/property.jpg',
        location: 'West Bay – Doha',
        title: 'Luxury 2 Bedroom Apartment with Sea View',
        price: '12,000',
        bedrooms: '2',
        bathrooms: '2',
        area: '1,200 sqft'
      },
      {
        id: 3,
        image: '/images/property.jpg',
        location: 'West Bay – Doha',
        title: 'Modern 3 Bedroom Penthouse',
        price: '18,000',
        bedrooms: '3',
        bathrooms: '3',
        area: '2,000 sqft'
      }
    ]
  },
  'lusail-city': {
    name: 'Lusail City',
    title: 'Welcome to Lusail City',
    image: '/images/lusail.jpg',
    description: `Lusail City is a planned city in Qatar, located on the coast, in the northern part of the municipality of Al Daayen. Lusail is located about 23 km north of the city centre of Doha, just north of the West Bay Lagoon, on over 38 km² of land.`,
    description2: `The city is being developed by Qatari Diar, a real estate investment company owned by the Qatar Investment Authority. Lusail is designed to accommodate 450,000 people and will include commercial, residential, entertainment, and hospitality districts.`,
    properties: [
      {
        id: 4,
        image: '/images/property.jpg',
        location: 'Lusail City – Doha',
        title: 'Spacious 4 Bedroom Villa with Private Pool',
        price: '25,000',
        bedrooms: '4',
        bathrooms: '4',
        area: '3,500 sqft'
      },
      {
        id: 5,
        image: '/images/property.jpg',
        location: 'Lusail City – Doha',
        title: 'Luxury Apartment in Lusail Marina',
        price: '15,000',
        bedrooms: '2',
        bathrooms: '2',
        area: '1,500 sqft'
      },
      {
        id: 6,
        image: '/images/property.jpg',
        location: 'Lusail City – Doha',
        title: 'Modern Studio in Lusail Downtown',
        price: '8,500',
        bedrooms: '1',
        bathrooms: '1',
        area: '600 sqft'
      }
    ]
  },
  'pearl-island': {
    name: 'Pearl Island',
    title: 'Welcome to The Pearl Island',
    image: '/images/pearl.jpg',
    description: `The Pearl-Qatar is an artificial island spanning nearly four million square meters. It is the first land in Qatar to be available for freehold ownership by foreign nationals.`,
    description2: `The Pearl Island features luxury residential towers, villas, and townhouses, along with world-class retail, dining, and entertainment options. It's one of the most prestigious addresses in Doha.`,
    properties: [
      {
        id: 7,
        image: '/images/property.jpg',
        location: 'Pearl Island – Doha',
        title: 'Beachfront Villa on The Pearl',
        price: '35,000',
        bedrooms: '5',
        bathrooms: '5',
        area: '4,500 sqft'
      },
      {
        id: 8,
        image: '/images/property.jpg',
        location: 'Pearl Island – Doha',
        title: 'Luxury Apartment with Marina View',
        price: '20,000',
        bedrooms: '3',
        bathrooms: '3',
        area: '2,200 sqft'
      },
      {
        id: 9,
        image: '/images/property.jpg',
        location: 'Pearl Island – Doha',
        title: 'Penthouse with Panoramic Views',
        price: '45,000',
        bedrooms: '4',
        bathrooms: '4',
        area: '3,800 sqft'
      }
    ]
  },
  'doha': {
    name: 'Doha',
    title: 'Welcome to Doha',
    image: '/div.property-thumbnail-wrapper.png',
    description: `Doha is the capital and most populous city of Qatar. Located on the coast of the Persian Gulf, Doha is Qatar's fastest-growing city, with over 80% of the nation's population living in Doha or its surrounding suburbs.`,
    description2: `Doha is the economic center of Qatar and one of the principal financial centers in the Middle East. The city is home to many international organizations and has a rapidly growing skyline.`,
    properties: [
      {
        id: 10,
        image: '/images/property.jpg',
        location: 'Doha',
        title: 'Modern Apartment in Downtown Doha',
        price: '10,000',
        bedrooms: '2',
        bathrooms: '2',
        area: '1,000 sqft'
      },
      {
        id: 11,
        image: '/images/property.jpg',
        location: 'Doha',
        title: 'Luxury Villa in Doha',
        price: '22,000',
        bedrooms: '4',
        bathrooms: '4',
        area: '3,200 sqft'
      },
      {
        id: 12,
        image: '/images/property.jpg',
        location: 'Doha',
        title: 'Studio Apartment in City Center',
        price: '6,500',
        bedrooms: '1',
        bathrooms: '1',
        area: '450 sqft'
      }
    ]
  },
  'al-sadd': {
    name: 'Al Sadd',
    title: 'Welcome to Al Sadd',
    image: '/div.property-thumbnail-wrapper.png',
    description: `Al Sadd is a district in Doha, Qatar. It is one of the oldest districts in Doha and is known for its commercial and residential mix. The area features traditional markets, modern shopping centers, and residential buildings.`,
    description2: `Al Sadd is well-connected to other parts of Doha and offers a mix of traditional Qatari culture and modern amenities. It's a popular area for both locals and expatriates.`,
    properties: [
      {
        id: 13,
        image: '/images/property.jpg',
        location: 'Al Sadd – Doha',
        title: 'Family Villa in Al Sadd',
        price: '15,000',
        bedrooms: '4',
        bathrooms: '3',
        area: '2,800 sqft'
      },
      {
        id: 14,
        image: '/images/property.jpg',
        location: 'Al Sadd – Doha',
        title: 'Modern 2 Bedroom Apartment',
        price: '9,500',
        bedrooms: '2',
        bathrooms: '2',
        area: '1,100 sqft'
      },
      {
        id: 15,
        image: '/images/property.jpg',
        location: 'Al Sadd – Doha',
        title: 'Spacious 3 Bedroom Flat',
        price: '12,000',
        bedrooms: '3',
        bathrooms: '2',
        area: '1,600 sqft'
      }
    ]
  },
  'al-dafna': {
    name: 'Al Dafna',
    title: 'Welcome to Al Dafna',
    image: '/div.property-thumbnail-wrapper.png',
    description: `Al Dafna is a district in West Bay, Doha. It is known for its modern architecture, luxury hotels, and commercial buildings. The area is part of the West Bay business district and features some of Doha's most iconic skyscrapers.`,
    description2: `Al Dafna is home to many embassies, corporate headquarters, and luxury residential towers. It offers stunning views of the Persian Gulf and is one of the most prestigious areas in Doha.`,
    properties: [
      {
        id: 16,
        image: '/images/property.jpg',
        location: 'Al Dafna – Doha',
        title: 'Luxury Penthouse with Sea View',
        price: '30,000',
        bedrooms: '4',
        bathrooms: '4',
        area: '3,600 sqft'
      },
      {
        id: 17,
        image: '/images/property.jpg',
        location: 'Al Dafna – Doha',
        title: 'Executive Apartment in Business District',
        price: '18,000',
        bedrooms: '3',
        bathrooms: '3',
        area: '2,400 sqft'
      },
      {
        id: 18,
        image: '/images/property.jpg',
        location: 'Al Dafna – Doha',
        title: 'Modern Studio in Al Dafna',
        price: '11,000',
        bedrooms: '1',
        bathrooms: '1',
        area: '700 sqft'
      }
    ]
  }
}

export default function TowerDetailsPage() {
  const params = useParams()
  const areaSlug = params.area
  const [open, setOpen] = useState(null)
  const [area, setArea] = useState(null)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview") // overview, nearby, 360view
  const [nearbyAreas, setNearbyAreas] = useState([])

  const toggle = (i) => setOpen(open === i ? null : i)

  // OPTIMIZED: Single API call to fetch area + all properties
  useEffect(() => {
    const fetchAreaData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get area name from slug
        const areaName = slugToNameMap[areaSlug] || areaSlug.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')

        // Step 1: Get area ID from areas list (single call)
        const areasListUrl = getApiUrl('api/v1/areas/list')
        const areasResponse = await fetch(areasListUrl)
        
        if (!areasResponse.ok) {
          throw new Error('Failed to fetch areas list')
        }

        const areasData = await areasResponse.json()
        const foundArea = areasData.areas?.find(a => 
          a.area_name?.toLowerCase() === areaName.toLowerCase() ||
          a.area_name?.toLowerCase().includes(areaName.toLowerCase()) ||
          areaName.toLowerCase().includes(a.area_name?.toLowerCase())
        )

        if (!foundArea) {
          const fallbackArea = areaData[areaSlug] || areaData['west-bay']
          setArea(fallbackArea)
          setProperties(fallbackArea.properties || [])
          setLoading(false)
          return
        }

        // Step 2: OPTIMIZED - Single call to get area details + all properties
        const areaDetailsUrl = getApiUrl(`api/v1/areas/${foundArea.area_id}/full-details?page=1&limit=50`)
        const detailsResponse = await fetch(areaDetailsUrl)
        
        if (!detailsResponse.ok) {
          throw new Error('Failed to fetch area details')
        }

        const detailsData = await detailsResponse.json()
        const areaInfo = detailsData.area || {}
        
        // Map area data
        const mappedArea = {
          id: areaInfo.id || foundArea.area_id,
          name: areaInfo.nameEn || foundArea.area_name,
          title: `Welcome to ${areaInfo.nameEn || foundArea.area_name}`,
          image: areaInfo.imageUrl || areaInfo.imageUrlEn || foundArea.area_image || '/images_pages/listings.png',
          description: areaInfo.descriptionEn || '',
          description2: areaInfo.descriptionAr || '',
          areaId: foundArea.area_id,
          totalProperties: detailsData.listingsCount || detailsData.properties?.length || 0,
          status: areaInfo.status || 'active',
          locationLevel1: areaInfo.locationLevel1 || foundArea.area_name,
          locationLevel2: areaInfo.locationLevel2,
          locationLevel3: areaInfo.locationLevel3,
          latitude: areaInfo.latitude || areaInfo.lat,
          longitude: areaInfo.longitude || areaInfo.lng || areaInfo.lon,
          virtualTourUrl: areaInfo.virtualTourUrl || null,
          amenities: areaInfo.amenities || []
        }

        // Map properties
        const mappedProperties = (detailsData.properties || []).map((item, index) => {
          const prop = item.property || item
          const locationParts = [
            prop.locationLevel2,
            prop.locationLevel3,
            prop.locationLevel4
          ].filter(Boolean)
          const location = locationParts.length > 0 
            ? locationParts.join(' – ') 
            : foundArea.area_name || 'Doha'
          
          return {
            id: prop.id || prop.propertyId || index + 1,
            image: prop.coverPicture || prop.gallery?.[0] || prop.imageUrl || '/div.property-thumbnail-wrapper.png',
            location: location,
            title: prop.titleEn || prop.title || 'Property',
            price: prop.priceAmount ? prop.priceAmount.toLocaleString() : '0',
            bedrooms: prop.bedrooms?.toString() || '0',
            bathrooms: prop.bathrooms?.toString() || '0',
            area: prop.area ? `${prop.area} sqft` : (prop.areaSqft ? `${prop.areaSqft} sqft` : 'N/A')
          }
        })

        setArea(mappedArea)
        setProperties(mappedProperties.length > 0 ? mappedProperties : (areaData[areaSlug]?.properties || []))

        // Step 3: Fetch nearby areas (other areas in the same location)
        const allAreas = areasData.areas || []
        const nearby = allAreas
          .filter(a => a.area_id !== foundArea.area_id && a.area_name)
          .slice(0, 6)
          .map(a => ({
            id: a.area_id,
            name: a.area_name,
            image: a.area_image || '/images_pages/listings.png',
            description: a.descriptionEn || ''
          }))
        setNearbyAreas(nearby)
      } catch (err) {
        console.error('Error fetching area data:', err)
        setError(err.message)
        // Fallback to hardcoded data
        const fallbackArea = areaData[areaSlug] || areaData['west-bay']
        setArea(fallbackArea)
        setProperties(fallbackArea.properties || [])
      } finally {
        setLoading(false)
      }
    }

    if (areaSlug) {
      fetchAreaData()
    }
  }, [areaSlug])

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
    <main className="min-h-screen relative">
      {/* 🔹 HERO SECTION - Full Height with Header Overlay */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
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

        {/* Centered Transparent Box with Title */}
        <div className="relative z-20 flex items-center justify-center w-full">
          <div className="bg-white/20 backdrop-blur-md rounded-lg px-8 py-6 border border-white/30 shadow-lg">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#001730]   text-center">
              {area.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        {/* 🔹 CONTENT GRID */}
        <div className="max-w-[2800px] mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ================= LEFT SECTION ================= */}
          <div className="lg:col-span-7">
            {/* TOP SPECS */}
            {area && (
              <div className="bg-gray-100 p-3 sm:p-4 shadow-lg rounded-[5px] mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                  {[
                    { icon: "name", label: area.name || 'N/A' },
                    { icon: "status", label: area.status || 'Active' },
                    { icon: "properties", label: area.totalProperties ? `${area.totalProperties} Properties` : 'N/A' },
                    { icon: "location", label: area.locationLevel1 || 'N/A' },
                    { icon: "area", label: area.locationLevel2 || 'N/A' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="
                        flex items-center gap-2 sm:gap-3
                        bg-white
                        px-2 sm:px-3
                        h-12 sm:h-14
                        rounded-[5px]
                        shadow-sm
                      "
                    >
                      {/* ICONS */}
                      {item.icon === "name" && <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />}
                      {item.icon === "status" && <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />}
                      {item.icon === "properties" && <FaHome className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />}
                      {item.icon === "location" && <FaRegSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />}
                      {item.icon === "area" && <FaRegSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />}

                      {/* TEXT */}
                      <p
                        className="
                          font-semibold text-[#001730]
                          text-xs sm:text-sm
                          whitespace-nowrap
                          truncate
                          w-full
                        "
                        title={item.label}
                      >
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                <button
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
                </button>
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
                              href={`/towerdetails/${nearbyArea.name.toLowerCase().replace(/\s+/g, '-')}`}
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
                      <h3 className="text-[#001730] text-base sm:text-xl font-semibold mt-1">
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

            {/* Bottom info strip */}
            {area && (
              <div className="bg-gray-100 p-3 sm:p-4 mt-4 shadow-lg rounded-[5px]">
                <div className="grid grid-cols-[1.5fr_2fr_0.8fr] gap-3 sm:gap-4">
                  {/* Box 1 */}
                  <div className="bg-white p-3 sm:p-4 rounded-[5px] shadow text-xs sm:text-sm">
                    <p className="flex flex-col sm:flex-row sm:items-center">
                      <span className="font-semibold text-[#001730]">Area ID:</span>
                      <span className="mt-1 sm:mt-0 sm:ml-1">{area.id || area.areaId || "N/A"}</span>
                    </p>
                  </div>

                  {/* Box 2 */}
                  <div className="bg-white p-3 sm:p-4 rounded-[5px] shadow text-xs sm:text-sm">
                    <p className="flex flex-col sm:flex-row sm:items-center">
                      <span className="font-semibold text-[#001730]">Area Name:</span>
                      <span className="mt-1 sm:mt-0 sm:ml-1">{area.name || "N/A"}</span>
                    </p>
                  </div>

                  {/* Box 3 */}
                  <div className="bg-white p-3 sm:p-4 rounded-[5px] shadow text-xs sm:text-sm">
                    <p className="flex flex-col sm:flex-row sm:items-center">
                      <span className="font-semibold text-[#001730]">Status:</span>
                      <span className="mt-1 sm:mt-0 sm:ml-1">{area.status || "Active"}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT SECTION ================= */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 relative">
              {/* Background Image - Behind Properties */}
              <div className="absolute inset-0 -z-10 opacity-5 lg:opacity-10">
                <Image
                  src={area.image || "/div.property-thumbnail-wrapper.png"}
                  alt={area.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <h2
                className="text-[#001730] uppercase mb-2 lg:mb-2 text-center whitespace-nowrap relative z-10"
                style={{
                  fontSize: "clamp(16px, 4vw, 24px)"
                }}
              >
                Exclusive properties in {area.name}
              </h2>
              <div className="flex-1 h-[0.5px] bg-gray-300 my-2 lg:my-2 mx-auto w-[60%] md:w-[40%] lg:w-[20%] mb-5 relative z-10"></div>

              {/* 🔹 PROPERTY LIST */}
              <div className="space-y-4 relative z-10">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-[#E9E9E9] rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="flex p-4 rounded-md">
                      {/* Image Section - Left */}
                      <div className="relative w-[220px] h-[192px] flex-shrink-0">
                        <Image
                          src={property.image || "/div.property-thumbnail-wrapper.png"}
                          alt={property.title}
                          fill
                          className="object-cover rounded-md"
                        />
                        {/* Share Button Overlay */}
                        <div className="absolute bottom-2 right-2 z-10">
                          <ShareButton
                            propertyTitle={property.title}
                            propertyLocation={property.location}
                            propertyUrl={typeof window !== 'undefined' ? window.location.href : ''}
                          />
                        </div>
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
                            <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4 rounded-md justify-center">
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
                            <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4 rounded-md justify-center">
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
                            <div className="flex items-center gap-1 bg-gray-50 shadow p-2 px-4 rounded-md justify-center">
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
                          <div className="w-[100%] h-[0.5px] bg-gray-300 my-3"></div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-lg font-bold text-[#001730] m-0">
                            {property.price} QAR
                          </p>
                          <button className="bg-[#001730] text-white text-[12px] font-medium px-4 py-2 rounded-md flex items-center justify-between shadow-lg transition-all duration-300 hover:bg-[#002d52]">
                            <Link
                              href={`/propertydetails?id=${property.id}`}
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Areas Section */}
      {nearbyAreas.length > 0 && (
        <section className="w-full bg-white py-12">
          <div className="max-w-[2800px] mx-auto px-4">
            <h2
              className="text-[#001730] uppercase mb-2 lg:mb-2 text-center whitespace-nowrap"
              style={{
                fontSize: "clamp(16px, 4vw, 24px)"
              }}
            >
              Nearby Areas
            </h2>
            <div className="flex-1 h-[0.5px] bg-gray-300 my-2 lg:my-2 mx-auto w-[60%] md:w-[40%] lg:w-[20%] mb-8"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyAreas.map((nearbyArea) => (
                <Link
                  key={nearbyArea.id}
                  href={`/towerdetails/${nearbyArea.name.toLowerCase().replace(/\s+/g, '-')}`}
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
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}

