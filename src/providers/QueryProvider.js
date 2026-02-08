"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function QueryProvider({ children }) {
  // Create QueryClient with optimized cache configuration for Redis-backed API
  // React Query checks cache → IF data exists & fresh → show instantly (0ms)
  // IF stale → call API → API checks Redis → Redis hit → return in <10ms
  // IF Redis miss → query database → Store in Redis → Return response
  // React Query updates cache → UI updates automatically
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: Data is considered fresh for 5 minutes
            // During this time, React Query won't refetch even if component remounts
            staleTime: 5 * 60 * 1000, // 5 minutes

            // Cache time: Data stays in cache for 10 minutes after last use
            // This allows instant display when navigating back
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

            // Refetch on window focus: Only refetch if data is stale
            refetchOnWindowFocus: true,

            // Refetch on reconnect: Only refetch if data is stale
            refetchOnReconnect: true,

            // Retry failed requests
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Refetch on mount: Only if data is stale
            refetchOnMount: true,
          },
          mutations: {
            // Retry mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
