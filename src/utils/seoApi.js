import { getMarketingApiUrl } from '@/config/api';

/**
 * Fetch SEO metadata from the backend API
 * Supports caching with Next.js revalidation
 * 
 * @param {string} pageKey - The page identifier (e.g., "home", "services", "about")
 * @param {string} componentKey - Optional component/section identifier (e.g., "services-header")
 * @param {string} language - Language code ("en" or "ar"), defaults to "en"
 * @param {object} options - Additional fetch options
 * @returns {Promise<object|null>} SEO metadata object or null if not found
 * 
 * @example
 * const seo = await fetchSEO("home", null, "en");
 * const seo = await fetchSEO("services", "services-header", "ar");
 */
export async function fetchSEO(pageKey, componentKey = null, language = 'en', options = {}) {
  if (!pageKey) {
    console.warn('fetchSEO: pageKey is required');
    return null;
  }

  // Validate language
  if (!['en', 'ar'].includes(language)) {
    console.warn(`fetchSEO: Invalid language "${language}", defaulting to "en"`);
    language = 'en';
  }

  try {
    // Build query parameters
    const params = new URLSearchParams({
      pageKey: pageKey.toLowerCase().trim(),
      lang: language,
    });

    if (componentKey) {
      params.append('componentKey', componentKey.toLowerCase().trim());
    }

    // Build API URL - SEO endpoints are on auth-service (marketing API)
    const apiUrl = `${getMarketingApiUrl(`/api/seo?${params.toString()}`)}`;

    // Fetch with caching support for Next.js
    // Revalidate every hour (3600 seconds)
    const fetchOptions = {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    const response = await fetch(apiUrl, fetchOptions);

    if (!response.ok) {
      if (response.status === 404) {
        // No SEO data found - return null (not an error)
        return null;
      }
      throw new Error(`Failed to fetch SEO data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && data.seo) {
      return {
        metaTitle: data.seo.metaTitle || '',
        metaDescription: data.seo.metaDescription || '',
        metaImage: data.seo.metaImage || '',
        metaKeywords: data.seo.metaKeywords || '',
        ogTitle: data.seo.ogTitle || data.seo.metaTitle || '',
        ogDescription: data.seo.ogDescription || data.seo.metaDescription || '',
        ogImage: data.seo.ogImage || data.seo.metaImage || '',
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    // Return null instead of throwing to allow pages to render with default metadata
    return null;
  }
}

/**
 * Get default SEO metadata (fallback when API data is not available)
 * 
 * @param {string} pageKey - The page identifier
 * @returns {object} Default SEO metadata
 */
export function getDefaultSEO(pageKey) {
  const defaults = {
    home: {
      metaTitle: 'Al Asmakh Real Estate | Leading Real Estate Solutions in Qatar',
      metaDescription: 'Discover premium properties and tailored real estate solutions in Qatar. Rent, buy, or invest with Al Asmakh Real Estate.',
      metaImage: '',
    },
    services: {
      metaTitle: 'Our Services | Al Asmakh Real Estate',
      metaDescription: 'Explore our comprehensive real estate services including property management, sales, and development.',
      metaImage: '',
    },
    about: {
      metaTitle: 'About Us | Al Asmakh Real Estate',
      metaDescription: 'Learn about Al Asmakh Real Estate, a leading real estate company in Qatar.',
      metaImage: '',
    },
    contact: {
      metaTitle: 'Contact Us | Al Asmakh Real Estate',
      metaDescription: 'Get in touch with Al Asmakh Real Estate. Find our offices and contact information.',
      metaImage: '',
    },
  };

  return defaults[pageKey] || {
    metaTitle: 'Al Asmakh Real Estate',
    metaDescription: 'Leading real estate solutions in Qatar',
    metaImage: '',
  };
}

/**
 * Generate Next.js metadata object from SEO data
 * 
 * @param {object} seoData - SEO data from fetchSEO or getDefaultSEO
 * @param {string} baseUrl - Base URL for absolute image URLs (optional)
 * @returns {object} Next.js metadata object
 */
export function generateMetadataFromSEO(seoData, baseUrl = '') {
  if (!seoData) {
    return {};
  }

  const metadata = {
    title: seoData.metaTitle || 'Al Asmakh Real Estate',
    description: seoData.metaDescription || '',
  };

  // Add keywords if available
  if (seoData.metaKeywords) {
    metadata.keywords = seoData.metaKeywords.split(',').map(k => k.trim()).filter(k => k);
  }

  // Add Open Graph metadata
  if (seoData.ogTitle || seoData.ogImage || seoData.ogDescription) {
    metadata.openGraph = {
      title: seoData.ogTitle || seoData.metaTitle || '',
      description: seoData.ogDescription || seoData.metaDescription || '',
      type: 'website',
    };

    // Add image if available
    if (seoData.ogImage) {
      const imageUrl = seoData.ogImage.startsWith('http') 
        ? seoData.ogImage 
        : `${baseUrl}${seoData.ogImage}`;
      metadata.openGraph.images = [imageUrl];
    } else if (seoData.metaImage) {
      const imageUrl = seoData.metaImage.startsWith('http') 
        ? seoData.metaImage 
        : `${baseUrl}${seoData.metaImage}`;
      metadata.openGraph.images = [imageUrl];
    }
  }

  // Add Twitter card metadata
  if (seoData.ogTitle || seoData.ogImage) {
    metadata.twitter = {
      card: 'summary_large_image',
      title: seoData.ogTitle || seoData.metaTitle || '',
      description: seoData.ogDescription || seoData.metaDescription || '',
    };
    if (seoData.ogImage || seoData.metaImage) {
      const imageUrl = (seoData.ogImage || seoData.metaImage).startsWith('http') 
        ? (seoData.ogImage || seoData.metaImage) 
        : `${baseUrl}${seoData.ogImage || seoData.metaImage}`;
      metadata.twitter.images = [imageUrl];
    }
  }

  return metadata;
}
