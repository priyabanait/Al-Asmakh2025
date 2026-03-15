'use client'

import Header from '../../../components/Header'
import Blogs from '../../../components/Blogs'
import Footer from '../../../components/Footer'

export default function BuyPage() {
  return (
    <main className="min-h-screen relative">
      <Header />
      <Blogs />
      <Footer />
    </main>
  )
}

// Note: For Next.js App Router, you can export generateMetadata from a separate file
// or create a layout.js file in the same directory. Since this is a client component,
// metadata should be handled in a parent layout or a separate metadata file.
// See example-seo-page.js for a server component example.