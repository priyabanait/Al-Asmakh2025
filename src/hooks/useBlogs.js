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
    limit = 20,
    publishStatus,
    contentType,
    category,
    search,
    featured,
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  // Only add publishStatus if explicitly provided
  if (publishStatus) queryParams.append('publishStatus', publishStatus);
  if (contentType) queryParams.append('contentType', contentType);
  if (category) queryParams.append('category', category);
  if (search) queryParams.append('search', search);
  if (featured) queryParams.append('featured', featured);

  // Use the exact API endpoint: https://api.alasmakhrealestate.com/marketing?page=1&limit=20
  const apiUrl = `${getMarketingApiUrl('marketing')}?${queryParams.toString()}`;
  
  console.log('[useBlogs] Fetching blogs from:', apiUrl);
  
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  console.log('[useBlogs] API Response:', {
    success: data.success,
    contentsCount: data.contents?.length || data.length || 0,
    hasPagination: !!data.pagination,
    dataKeys: Object.keys(data),
  });

  // Map marketing content to blog structure
  let blogArticles = [];

  // Handle different response structures
  if (data.success && data.contents && Array.isArray(data.contents)) {
    // Response structure: { success: true, contents: [...], pagination: {...} }
    blogArticles = data.contents
      .filter(content => {
        // Filter for Blog or Article content types
        const isBlogOrArticle = content.contentType === 'Blog' || 
                                content.contentType === 'Article' ||
                                content.contentType === 'blog' ||
                                content.contentType === 'article';
        
        // If publishStatus filter is provided, apply it; otherwise include all
        if (publishStatus) {
          return isBlogOrArticle && 
                 (content.publishStatus === publishStatus || 
                  content.publishStatus === 'Published' || 
                  content.publishStatus === 'Active');
        }
        
        // Default: include Published or Active blogs/articles
        return isBlogOrArticle && 
               (content.publishStatus === 'Published' || 
                content.publishStatus === 'Active' ||
                !content.publishStatus); // Include if no publishStatus
      })
      .map(content => ({
        id: content._id || content.id,
        slug: content.slug,
        title: content.title || content.titleEn || 'Untitled',
        description: content.description || 
                    content.body?.substring(0, 150) || 
                    content.bodyEn?.substring(0, 150) || 
                    content.bodyAr?.substring(0, 150) || 
                    'No description available',
        image: content.imageUrl || 
               content.image || 
               content.coverImage || 
               '/Image.png',
        body: content.body || content.bodyEn || content.bodyAr || '',
        createdAt: content.createdAt || content.created_at || content.createdAt,
        contentType: content.contentType || 'Blog',
        category: content.category || '',
      }));
  } else if (Array.isArray(data)) {
    // Response structure: [...contents]
    blogArticles = data
      .filter(content => {
        const isBlogOrArticle = content.contentType === 'Blog' || 
                                content.contentType === 'Article' ||
                                content.contentType === 'blog' ||
                                content.contentType === 'article';
        
        if (publishStatus) {
          return isBlogOrArticle && 
                 (content.publishStatus === publishStatus || 
                  content.publishStatus === 'Published' || 
                  content.publishStatus === 'Active');
        }
        
        return isBlogOrArticle && 
               (content.publishStatus === 'Published' || 
                content.publishStatus === 'Active' ||
                !content.publishStatus);
      })
      .map(content => ({
        id: content._id || content.id,
        slug: content.slug,
        title: content.title || content.titleEn || 'Untitled',
        description: content.description || 
                    content.body?.substring(0, 150) || 
                    content.bodyEn?.substring(0, 150) || 
                    content.bodyAr?.substring(0, 150) || 
                    'No description available',
        image: content.imageUrl || 
               content.image || 
               content.coverImage || 
               '/Image.png',
        body: content.body || content.bodyEn || content.bodyAr || '',
        createdAt: content.createdAt || content.created_at || content.createdAt,
        contentType: content.contentType || 'Blog',
        category: content.category || '',
      }));
  } else if (data.contents && Array.isArray(data.contents)) {
    // Response structure: { contents: [...], pagination: {...} }
    blogArticles = data.contents
      .filter(content => {
        const isBlogOrArticle = content.contentType === 'Blog' || 
                                content.contentType === 'Article' ||
                                content.contentType === 'blog' ||
                                content.contentType === 'article';
        
        if (publishStatus) {
          return isBlogOrArticle && 
                 (content.publishStatus === publishStatus || 
                  content.publishStatus === 'Published' || 
                  content.publishStatus === 'Active');
        }
        
        return isBlogOrArticle && 
               (content.publishStatus === 'Published' || 
                content.publishStatus === 'Active' ||
                !content.publishStatus);
      })
      .map(content => ({
        id: content._id || content.id,
        slug: content.slug,
        title: content.title || content.titleEn || 'Untitled',
        description: content.description || 
                    content.body?.substring(0, 150) || 
                    content.bodyEn?.substring(0, 150) || 
                    content.bodyAr?.substring(0, 150) || 
                    'No description available',
        image: content.imageUrl || 
               content.image || 
               content.coverImage || 
               '/Image.png',
        body: content.body || content.bodyEn || content.bodyAr || '',
        createdAt: content.createdAt || content.created_at || content.createdAt,
        contentType: content.contentType || 'Blog',
        category: content.category || '',
      }));
  }

  console.log('[useBlogs] Processed blogs:', blogArticles.length);
  
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
 * Fetch a single blog by ID
 * @param {string} id - Blog ID
 * @returns {Promise<Object>} Blog object
 */
const fetchBlogById = async (id) => {
  if (!id) {
    throw new Error('Blog ID is required');
  }

  const apiUrl = `${getMarketingApiUrl('marketing')}/${id}`;
  console.log('[useBlog] Fetching blog from:', apiUrl);

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch blog: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  console.log('[useBlog] API Response:', {
    success: data.success,
    hasContent: !!data.content,
    dataKeys: Object.keys(data),
  });

  // Map marketing content to blog structure - handle different response structures
  let content = null;
  
  if (data.success && data.content) {
    content = data.content;
  } else if (data.content) {
    content = data.content;
  } else if (data._id || data.id) {
    // Direct content object
    content = data;
  }

  if (content) {
    return {
      id: content._id || content.id,
      slug: content.slug,
      title: content.title || content.titleEn || 'Untitled',
      description: content.description || 
                  content.body?.substring(0, 150) || 
                  content.bodyEn?.substring(0, 150) || 
                  content.bodyAr?.substring(0, 150) || 
                  'No description available',
      image: content.imageUrl || 
             content.image || 
             content.coverImage || 
             '/Image.png',
      body: content.body || content.bodyEn || content.bodyAr || '',
      createdAt: content.createdAt || content.created_at || content.createdAt,
      contentType: content.contentType || 'Blog',
      category: content.category || '',
    };
  }

  throw new Error('Blog not found');
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

/**
 * Get a single blog by ID with React Query caching
 * @param {string} id - Blog ID
 * @param {Object} options - React Query options
 */
export function useBlog(id, options = {}) {
  const queryKey = useMemo(() => blogKeys.detail(id), [id]);

  return useQuery({
    queryKey,
    queryFn: () => fetchBlogById(id),
    enabled: !!id, // Only fetch if ID exists
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}
