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
  const [initialPriceType, setInitialPriceType] = useState(null) // "rent" or "sale" or null

  useEffect(() => {
    // Get query parameter from URL and decode it (for full-text search)
    const queryParam = searchParams.get('query')
    const query = queryParam ? decodeURIComponent(queryParam).trim() : ''
    console.log('[SearchPage] Query from URL:', query)
    setInitialQuery(query)

    // Build filters object from all other query params
    const filters = {}

    // Helper to append values, supporting repeated keys (arrays)
    const appendFilter = (key, value) => {
      if (filters[key] === undefined) {
        filters[key] = value
      } else if (Array.isArray(filters[key])) {
        filters[key].push(value)
      } else {
        filters[key] = [filters[key], value]
      }
    }

    // Iterate over all URL params and translate where needed
    for (const [key, value] of searchParams.entries()) {
      if (!value) continue

      // Skip the main text query here; it's handled separately as initialQuery
      if (key === 'query') continue

      // Backwards compatibility for older param names
      if (key === 'location') {
        appendFilter('locationLevel1', value)
        continue
      }

      if (key === 'propertyType') {
        const typeMap = {
          "Apartment": "apartment",
          "Villa": "villa",
          "Townhouse": "townhouse",
          "Penthouse": "luxury",
          "Studio": "studio",
        }
        appendFilter('type', typeMap[value] || value.toLowerCase())
        continue
      }

      // For all other keys (including those coming directly from MoreFiltersModal
      // such as locationSearch, type, bedrooms, bathrooms, amenities, sizeRange, etc.),
      // pass them through as-is so they reach the search API unchanged.
      appendFilter(key, value)
    }

    // Determine desired priceType for this search page (optional)
    // Priority:
    // 1) Explicit priceType query param (e.g., ?priceType=sale)
    // 2) Heuristic based on the main query text (e.g., "sale" → sale)
    // 3) Otherwise leave undefined and let backend infer from q
    const urlPriceType = searchParams.get('priceType')
    const normalizedQuery = (query || '').toLowerCase()
    let derivedPriceType = null

    if (urlPriceType) {
      derivedPriceType = urlPriceType.toLowerCase() === 'lease' ? 'rent' : urlPriceType.toLowerCase()
    } else if (normalizedQuery === 'sale' || normalizedQuery.includes('for sale')) {
      derivedPriceType = 'sale'
    }

    setInitialPriceType(derivedPriceType)

    setInitialFilters(filters)
  }, [searchParams])

  return (
    <Rent 
      priceType={initialPriceType}
      initialSearchQuery={initialQuery}
      initialFilters={initialFilters}
      // In search mode we want ONLY the search API / Elasticsearch,
      // and never the generic fetchProperties fallback.
      searchModeOnly={true}
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

