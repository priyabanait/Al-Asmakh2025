import { useQuery } from '@tanstack/react-query';
import { fetchProperties } from '../utils/propertyapi';
import { useMemo } from 'react';

// Query keys factory for properties
export const propertyKeys = {
  all: ['properties'],
  lists: () => [...propertyKeys.all, 'list'],
  list: (params) => [...propertyKeys.lists(), params],
  details: () => [...propertyKeys.all, 'detail'],
  detail: (id) => [...propertyKeys.details(), id],
};

/**
 * Get properties list with React Query caching
 * React Query checks cache → IF data exists & fresh → return instantly (0ms)
 * IF stale → call API → API checks Redis → Redis hit → return in <10ms
 * IF Redis miss → query database → Store in Redis → Return response
 * React Query updates cache → UI updates automatically
 * 
 * @param {Object} params - Query parameters (priceType, page, limit, status, type, category, etc.)
 * @param {Object} options - React Query options
 */
export function useProperties(params = {}, options = {}) {
  // Memoize query key to prevent recreation on every render
  const queryKey = useMemo(() => propertyKeys.list(params), [
    params?.priceType,
    params?.page,
    params?.limit,
    params?.status,
    params?.type,
    params?.category,
    params?.locationLevel1,
    params?.locationLevel2,
    params?.locationLevel3,
    params?.bedrooms,
    params?.bathrooms,
    params?.minPrice,
    params?.maxPrice,
    params?.projectId,
  ]);

  return useQuery({
    queryKey,
    queryFn: () => fetchProperties(params),
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
