'use client'

import Header from '../../components/Header'
import Propertydetails from '../../components/Propertydetails'
import Footer from '../../components/Footer'

export default function ListingRentPage() {
  return (
    <main className="min-h-screen relative">
      <Header />
    <Propertydetails></Propertydetails>
      <Footer />
    </main>
  )
}

