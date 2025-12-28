'use client'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Rent from '../../../components/RentMap'

export default function ListingSalePage() {
  return (
    <main className="min-h-screen relative">
      <Header />
      <Rent priceType="sale" />

      <Footer />
    </main>
  )
}

