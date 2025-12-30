'use client'

import Image from 'next/image'
import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { FaArrowRight } from 'react-icons/fa6'
import Link from 'next/link'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ShareButton from '../../../components/ShareButton'
import { useParams } from 'next/navigation'

// Hardcoded area data
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

  const toggle = (i) => setOpen(open === i ? null : i)

  // Get area data or default to West Bay
  const area = areaData[areaSlug] || areaData['west-bay']

  return (
    <main className="min-h-screen relative">
      {/* 🔹 HERO SECTION - Full Height with Header Overlay */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src={"/images_pages/listings.png"}
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
        <div className="max-w-[3200px] mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ================= LEFT SECTION ================= */}
          <div className="lg:col-span-7">
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              {area.description}
            </p>
            <p className="text-gray-600 leading-relaxed mt-4 text-sm md:text-base">
              {area.description2}
            </p>

            {/* 🔹 ACCORDION */}
            <div className="mt-10 divide-y border-t">
              {['Lifestyle', 'About the Area'].map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  className="w-full flex justify-between items-center py-4 text-left"
                >
                  <span className="uppercase tracking-wide text-sm font-medium text-gray-800">
                    {item}
                  </span>
                  <span className="text-xl">{open === i ? '−' : '+'}</span>
                </button>
              ))}
            </div>
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

              <h2 className="text-lg font-semibold text-gray-900 mb-6 relative z-10">
                Exclusive properties in {area.name}
              </h2>

              {/* 🔹 PROPERTY LIST */}
              <div className="space-y-4 relative z-10">
                {area.properties.map((property) => (
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
      <Footer />
    </main>
  )
}

