'use client'

import Header from '../../../components/Header'
import ListingRent from '../../../components/ListingRent'
import Footer from '../../../components/Footer'

export default function ListingRentPage() {
  return (
    <main className="min-h-screen relative">
      <Header />
      <ListingRent></ListingRent>
      <Footer />
    </main>
  )
}

