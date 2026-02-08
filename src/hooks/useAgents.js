import { useQuery } from '@tanstack/react-query';
import { fetchAgents } from '../utils/propertyapi';
import { useMemo } from 'react';

// Query keys factory for agents
export const agentKeys = {
  all: ['agents'],
  lists: () => [...agentKeys.all, 'list'],
  list: (params) => [...agentKeys.lists(), params],
  details: () => [...agentKeys.all, 'detail'],
  detail: (id) => [...agentKeys.details(), id],
};

/**
 * Get agents list with React Query caching
 * React Query checks cache → IF data exists & fresh → return instantly (0ms)
 * IF stale → call API → API checks Redis → Redis hit → return in <10ms
 * IF Redis miss → query database → Store in Redis → Return response
 * React Query updates cache → UI updates automatically
 * 
 * @param {Object} params - Query parameters (page, limit, status)
 * @param {Object} options - React Query options
 */
export function useAgents(params = {}, options = {}) {
  // Memoize query key to prevent recreation on every render
  const queryKey = useMemo(() => agentKeys.list(params), [
    params?.page,
    params?.limit,
    params?.status,
  ]);

  return useQuery({
    queryKey,
    queryFn: () => fetchAgents(params),
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
