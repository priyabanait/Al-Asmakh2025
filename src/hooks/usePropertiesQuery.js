import { useQuery } from '@tanstack/react-query';
import { fetchProperties } from '@/utils/propertyapi';

/**
 * React Query hook for /api/v1/properties
 * - Handles both homepage (limit=4) and listing (limit=50) use-cases
 * - Uses QueryProvider defaults (staleTime, gcTime, retries, etc.)
 */
export const usePropertiesQuery = (params = {}) => {
  const {
    page = 1,
    limit = 50,
    priceType = 'rent',
    status = 'published',
    ...rest
  } = params;

  return useQuery({
    queryKey: ['properties', { page, limit, priceType, status, ...rest }],
    queryFn: () =>
      fetchProperties({
        page,
        limit,
        priceType,
        status,
        ...rest,
      }),
    // Keep previous page data while fetching the next page for smoother UX
    keepPreviousData: true,
  });
};

