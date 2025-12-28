'use client'

import Header from '../../../components/Header'
import Services from '../../../components/Services-lease'
import Footer from '../../../components/Footer'

export default function LuxuryPage() {
  return (
    <main className="min-h-screen relative">
      <Header />
      <Services
        offeringType="lease"
        backgroundImage="/images_pages/services lease.png"
        stats={[
          { value: "34", label: "Total Projects" },
          { value: "16", label: "Completed" },
          { value: "02", label: "Ongoing" },
          { value: "05", label: "Upcoming" },
        ]}
        filterButtons={["LUXURY", "COMMERCIAL", "INDUSTRIAL"]}
        category="luxury"
        luxury="true"
      />
      <Footer />
    </main>
  )
}

