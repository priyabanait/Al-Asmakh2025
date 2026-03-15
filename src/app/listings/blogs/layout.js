/**
 * Layout with SEO Metadata Integration
 * 
 * This layout demonstrates how to add SEO metadata to client component pages
 * using Next.js generateMetadata in a layout file.
 * 
 * The metadata will be applied to all pages in the /listings/blogs route.
 */

import { fetchSEO, getDefaultSEO, generateMetadataFromSEO } from '@/utils/seoApi';

export async function generateMetadata() {
  // You can get language from headers, cookies, or default to 'en'
  // For now, defaulting to 'en' - integrate with your i18n system
  const language = 'en';
  
  // Fetch SEO data for blogs page
  const seoData = await fetchSEO('listings-blogs', null, language);
  
  // Fallback to default if no SEO data found
  const finalSeoData = seoData || getDefaultSEO('listings-blogs');
  
  // Generate Next.js metadata object
  const metadata = generateMetadataFromSEO(
    finalSeoData, 
    process.env.NEXT_PUBLIC_BASE_URL || 'https://www.alasmakhrealestate.com'
  );
  
  return metadata;
}

export default function BlogsLayout({ children }) {
  return <>{children}</>;
}
