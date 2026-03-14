'use client'

import Header from '../../../components/Header'
import Services from '../../../components/Services-lease'
import Footer from '../../../components/Footer'

export default function FacilitiesManagementPage() {
  return (
    <main className="min-h-screen relative">
      <Header />
      <Services
        offeringType="lease"
        backgroundImage="/images_pages/services lease.png"
        stats={[
          { value: "150+", label: "Buildings Under Care" },
          { value: "24/7", label: "Operations Support" },
          { value: "98%", label: "Response SLA Met" },
          { value: "500+", label: "Service Team Members" },
        ]}
        filterButtons={["LUXURY", "COMMERCIAL", "INDUSTRIAL"]}
        propertyType="commercial"
        development="true"
      />
      <Footer />
    </main>
  )
}

