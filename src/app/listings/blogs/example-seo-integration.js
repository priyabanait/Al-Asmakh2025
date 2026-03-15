/**
 * EXAMPLE: Server Component with SEO Metadata Integration
 * 
 * This is an example of how to use the SEO API in a Next.js server component.
 * Copy this pattern to any page that needs dynamic SEO metadata.
 * 
 * To use this:
 * 1. Convert your page to a server component (remove 'use client')
 * 2. Import fetchSEO and generateMetadataFromSEO
 * 3. Export generateMetadata function
 * 4. Use the SEO data in your component
 */

import { fetchSEO, getDefaultSEO, generateMetadataFromSEO } from '@/utils/seoApi';
import Header from '../../../components/Header';
import Blogs from '../../../components/Blogs';
import Footer from '../../../components/Footer';

/**
 * Generate metadata for this page
 * This function runs on the server and is used by Next.js for SEO
 */
export async function generateMetadata({ params, searchParams }) {
  // Determine language from URL, search params, or default to 'en'
  // You can integrate with your i18n system here
  const language = searchParams?.lang || 'en';
  
  // Fetch SEO data for this page
  const seoData = await fetchSEO('listings-blogs', null, language);
  
  // Fallback to default if no SEO data found
  const finalSeoData = seoData || getDefaultSEO('listings-blogs');
  
  // Generate Next.js metadata object
  const metadata = generateMetadataFromSEO(finalSeoData, process.env.NEXT_PUBLIC_BASE_URL || '');
  
  return metadata;
}

/**
 * Page component
 * This is a server component - it can fetch data directly
 */
export default async function BlogsPage({ params, searchParams }) {
  // Determine language
  const language = searchParams?.lang || 'en';
  
  // You can also fetch SEO data here if needed for the page content
  const seoData = await fetchSEO('listings-blogs', null, language);
  
  return (
    <main className="min-h-screen relative">
      <Header />
      <Blogs />
      <Footer />
    </main>
  );
}
