'use client'

import Header from '../../../components/Header'
import BecomeAnAgent from '../../../components/BecomeAnAgent'
import Footer from '../../../components/Footer'

export default function BecomeAPartnerPage() {
    return (
        <main className="min-h-screen relative">
            <Header />
            <BecomeAnAgent mode="partner" />
            <Footer />
        </main>
    )
}

