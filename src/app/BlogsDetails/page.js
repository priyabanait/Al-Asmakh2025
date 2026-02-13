'use client'

import { Suspense } from 'react'
import Header from '../../components/Header'
import BlogsDetails from '../../components/BlogsDetails.js'
import Footer from '../../components/Footer'

function BlogsDetailsContent() {
  return (
    <main className="min-h-screen relative">
      <Header />
      <BlogsDetails />
      <Footer />
    </main>
  )
}

export default function ContactHeadOfficePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen relative">
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-[#001730] text-lg">Loading...</div>
        </div>
        <Footer />
      </main>
    }>
      <BlogsDetailsContent />
    </Suspense>
  )
}

