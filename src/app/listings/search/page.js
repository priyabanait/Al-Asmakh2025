'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '../../../components/Header'
import Rent from '../../../components/RentMap'
import Footer from '../../../components/Footer'

function SearchContent() {
  const searchParams = useSearchParams()
  const [initialQuery, setInitialQuery] = useState('')
  const [initialFilters, setInitialFilters] = useState({})

  useEffect(() => {
    // Get query parameter from URL and decode it
    const query = searchParams.get('query') ? decodeURIComponent(searchParams.get('query')).trim() : ''
    console.log('[SearchPage] Query from URL:', query)
    setInitialQuery(query)

    // Get filter parameters from URL if any
    const filters = {}
    
    // Location filter
    const location = searchParams.get('location')
    if (location) {
      filters.locationLevel1 = location
    }

    // Property type filter
    const propertyType = searchParams.get('propertyType')
    if (propertyType) {
      const typeMap = {
        "Apartment": "apartment",
        "Villa": "villa",
        "Townhouse": "townhouse",
        "Penthouse": "luxury",
        "Studio": "studio",
      }
      filters.type = typeMap[propertyType] || propertyType.toLowerCase()
    }

    // Bedrooms filter
    const bedrooms = searchParams.get('bedrooms')
    if (bedrooms) {
      filters.bedrooms = bedrooms
    }

    // Bathrooms filter
    const bathrooms = searchParams.get('bathrooms')
    if (bathrooms) {
      filters.bathrooms = bathrooms
    }

    // Price range filters
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    if (minPrice) {
      filters.minPrice = minPrice
    }
    if (maxPrice) {
      filters.maxPrice = maxPrice
    }

    // Price type (rent/sale)
    const priceType = searchParams.get('priceType')
    if (priceType) {
      filters.priceType = priceType
    }

    setInitialFilters(filters)
  }, [searchParams])

  return (
    <Rent 
      priceType="rent" 
      initialSearchQuery={initialQuery}
      initialFilters={initialFilters}
    />
  )
}

export default function SearchPage() {
  return (
    <main className="min-h-screen relative">
      <Header />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading search results...</p>
          </div>
        </div>
      }>
        <SearchContent />
      </Suspense>
      <Footer />
    </main>
  )
}

