/**
 * React Query Configuration
 * Centralized configuration for @tanstack/react-query
 */

import { QueryClient, MutationCache, isServer } from '@tanstack/react-query';
import { logError } from '@/lib/logger'

/**
 * Standard staleTime values per MODULE-QUALITY-CRITERIA
 * Use these constants in all useQuery hooks for consistency
 */
export const STALE_TIME = {
  /** List/table queries — 30 seconds */
  LIST: 30_000,
  /** Detail/single-item queries — 60 seconds */
  DETAIL: 60_000,
  /** Settings/config data that rarely changes — 5 minutes */
  SETTINGS: 5 * 60 * 1000,
  /** Reference data (units, receipt types, etc.) — 10 minutes */
  REFERENCE: 10 * 60 * 1000,
  /** Near-static data (admin units, store info) — 30 minutes */
  STATIC: 30 * 60 * 1000,
} as const;

/**
 * Global Query Client Configuration
 * Use makeQueryClient() to create per-component-tree instances (avoids SSR cross-request leaks).
 */
export function makeQueryClient() {
  const qc = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['activity-logs'] })
    },
  }),
  defaultOptions: {
    queries: {
      // Default staleTime: 30s (list standard). Override per-hook for detail/settings.
      staleTime: STALE_TIME.LIST,
      
      // Cache time: 10 minutes
      gcTime: 10 * 60 * 1000,
      
      // Retry failed requests 3 times
      retry: 3,
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus (useful for real-time updates)
      refetchOnWindowFocus: false,
      
      // Refetch on mount if data is stale
      refetchOnMount: true,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations 1 time
      retry: 1,
      
      // Report mutation errors to Sentry in production
      onError: (error) => {
        if (process.env.NODE_ENV === 'production') {
          import('@sentry/nextjs').then(Sentry => Sentry.captureException(error))
        } else {
          logError('Mutation error', error);
        }
      },
    },
  },
})
  return qc
}

/**
 * Singleton pattern for QueryClient (TanStack v5 recommended for Next.js App Router).
 *
 * - Server: always create a NEW QueryClient per request → prevents data leaking between users.
 * - Browser: reuse ONE instance → prevents React from re-creating on Suspense resume.
 *
 * @see https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr
 */
let browserQueryClient: QueryClient | undefined

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  return browserQueryClient
}

/**
 * Query Keys Factory
 * Centralized place to manage all query keys
 */
export const queryKeys = {
  // Employee queries
  employees: {
    all: ['employees'] as const,
    lists: () => [...queryKeys.employees.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.employees.lists(), { filters }] as const,
    details: () => [...queryKeys.employees.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.employees.details(), id] as const,
  },
  
  // Customer queries
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.customers.lists(), { filters }] as const,
    details: () => [...queryKeys.customers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.customers.details(), id] as const,
  },
  
  // Product queries
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.products.lists(), { filters }] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
  
  // Supplier queries
  suppliers: {
    all: ['suppliers'] as const,
    lists: () => [...queryKeys.suppliers.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.suppliers.lists(), { filters }] as const,
    details: () => [...queryKeys.suppliers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.suppliers.details(), id] as const,
  },
  
  // Branch queries
  branches: {
    all: ['branches'] as const,
    lists: () => [...queryKeys.branches.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.branches.lists(), { filters }] as const,
  },
  
  // Add more entities as needed...
} as const;
