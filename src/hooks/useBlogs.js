import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getMarketingApiUrl } from '../config/api';

// Query keys factory for blogs
export const blogKeys = {
  all: ['blogs'],
  lists: () => [...blogKeys.all, 'list'],
  list: (params) => [...blogKeys.lists(), params],
  details: () => [...blogKeys.all, 'detail'],
  detail: (id) => [...blogKeys.details(), id],
};

/**
 * Fetch blogs and articles from marketing API
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Object containing blogs array
 */
const fetchBlogs = async (params = {}) => {
  const {
    page = 1,
    limit = 50,
    publishStatus = 'Published',
    contentType,
    category,
    search,
    featured,
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    publishStatus,
  });

  if (contentType) queryParams.append('contentType', contentType);
  if (category) queryParams.append('category', category);
  if (search) queryParams.append('search', search);
  if (featured) queryParams.append('featured', featured);

  const response = await fetch(
    `${getMarketingApiUrl('marketing')}?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch blogs and articles');
  }

  const data = await response.json();

  // Map marketing content to blog structure
  let blogArticles = [];

  if (data.success && data.contents && Array.isArray(data.contents)) {
    blogArticles = data.contents
      .filter(content =>
        (content.contentType === 'Blog' || content.contentType === 'Article') &&
        content.publishStatus === 'Published'
      )
      .map(content => ({
        id: content._id || content.id,
        slug: content.slug,
        title: content.title || 'Untitled',
        description: content.body?.substring(0, 150) || content.bodyAr?.substring(0, 150) || 'No description available',
        image: content.imageUrl || '/Image.png',
        body: content.body || content.bodyAr || '',
        createdAt: content.createdAt || content.created_at,
        contentType: content.contentType || 'Blog',
        category: content.category || '',
      }));
  } else if (Array.isArray(data)) {
    blogArticles = data
      .filter(content =>
        (content.contentType === 'Blog' || content.contentType === 'Article') &&
        content.publishStatus === 'Published'
      )
      .map(content => ({
        id: content._id || content.id,
        slug: content.slug,
        title: content.title || 'Untitled',
        description: content.body?.substring(0, 150) || content.bodyAr?.substring(0, 150) || 'No description available',
        image: content.imageUrl || '/Image.png',
        body: content.body || content.bodyAr || '',
        createdAt: content.createdAt || content.created_at,
        contentType: content.contentType || 'Blog',
        category: content.category || '',
      }));
  }

  return {
    blogs: blogArticles,
    pagination: data.pagination || {
      page: parseInt(page),
      limit: parseInt(limit),
      total: blogArticles.length,
      pages: Math.ceil(blogArticles.length / parseInt(limit)),
    },
  };
};

/**
 * Get blogs list with React Query caching
 * React Query checks cache → IF data exists & fresh → return instantly (0ms)
 * IF stale → call API → API checks Redis → Redis hit → return in <10ms
 * IF Redis miss → query database → Store in Redis → Return response
 * React Query updates cache → UI updates automatically
 * 
 * @param {Object} params - Query parameters (page, limit, publishStatus, contentType, category, search, featured)
 * @param {Object} options - React Query options
 */
export function useBlogs(params = {}, options = {}) {
  // Memoize query key to prevent recreation on every render
  const queryKey = useMemo(() => blogKeys.list(params), [
    params?.page,
    params?.limit,
    params?.publishStatus,
    params?.contentType,
    params?.category,
    params?.search,
    params?.featured,
  ]);

  return useQuery({
    queryKey,
    queryFn: () => fetchBlogs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes - data is NOT treated as stale immediately
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache longer
    refetchOnMount: true, // Only if data is stale
    refetchOnWindowFocus: true, // Only if data is stale
    refetchOnReconnect: true, // Only if data is stale
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}
