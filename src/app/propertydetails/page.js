'use client'

import { Suspense } from 'react'
import Header from '../../components/Header'
import Propertydetails from '../../components/Propertydetails'
import Footer from '../../components/Footer'

// Force dynamic rendering - this page uses search params and cannot be statically generated
export const dynamic = 'force-dynamic'
export const dynamicParams = true

function PropertyDetailsContent() {
  return (
    <main className="min-h-screen relative">
      <Header />
      <Propertydetails></Propertydetails>
      <Footer />
    </main>
  )
}

export default function ListingRentPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen relative">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property details...</p>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <PropertyDetailsContent />
    </Suspense>
  )
}

