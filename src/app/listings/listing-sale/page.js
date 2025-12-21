'use client'

import Header from '../../../components/Header'
import ListingSale from '../../../components/ListingSale'
import Footer from '../../../components/Footer'

export default function ListingSalePage() {
  return (
    <main className="min-h-screen relative">
      <Header />
      <ListingSale />
      <Footer />
    </main>
  )
}

