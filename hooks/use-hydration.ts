/**
 * useHydration - Utility hooks for Server Component -> React Query hydration
 * 
 * Pattern: Server Components fetch data, pass as initialData to Client Components,
 * which then use React Query with the initialData option for instant display
 * while React Query handles background revalidation.
 * 
 * Benefits:
 * - Instant content display (no loading spinners on initial load)
 * - SEO-friendly (content rendered server-side)
 * - Background revalidation keeps data fresh
 * - Seamless transitions on client-side navigation
 * 
 * @example Server Component (app/(authenticated)/customers/page.tsx)
 * ```tsx
 * import { getCustomerStats } from '@/lib/data/customers';
 * import CustomersPage from '@/features/customers/page';
 * 
 * export default async function Page() {
 *   const stats = await getCustomerStats();
 *   return <CustomersPage initialStats={stats} />;
 * }
 * ```
 * 
 * @example Client Component (features/customers/page.tsx)
 * ```tsx
 * 'use client'
 * import { useCustomerStats } from './hooks/use-customers';
 * 
 * export function CustomersPage({ initialStats }) {
 *   const { data: stats } = useCustomerStats(initialStats);
 *   // stats available immediately, no loading state needed!
 * }
 * ```
 */

import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

/**
 * Hook to pre-populate React Query cache with server data
 * 
 * Use this when you have initial data but don't want to pass it
 * directly to useQuery's initialData option.
 * 
 * @example
 * ```tsx
 * function MyComponent({ serverData }) {
 *   useHydrateQueryCache(['my-key'], serverData);
 *   const { data } = useQuery({ queryKey: ['my-key'], queryFn: fetchData });
 *   // data will immediately have serverData value
 * }
 * ```
 */
export function useHydrateQueryCache<T>(
  queryKey: QueryKey,
  data: T | undefined,
  _options?: {
    staleTime?: number;
    cacheTime?: number;
  }
) {
  const queryClient = useQueryClient();
  const hydratedRef = useRef(false);

  useEffect(() => {
    // Only hydrate once and only if we have data
    if (data && !hydratedRef.current) {
      queryClient.setQueryData(queryKey, data);
      hydratedRef.current = true;
    }
  }, [queryClient, queryKey, data]);
}

/**
 * Hook to check if the app is currently hydrating from server data
 * Useful for avoiding hydration mismatches
 */
export function useIsHydrating() {
  const queryClient = useQueryClient();
  return queryClient.isFetching() === 0 && !queryClient.getQueryState(['__hydrating']);
}

/**
 * Type helper for components that receive server data
 */
export interface WithInitialData<T> {
  initialData?: T;
}

/**
 * Type helper for stats components
 */
export interface WithInitialStats<T> {
  initialStats?: T;
}

/**
 * Recommended stale times based on data type
 */
export const STALE_TIMES = {
  /** Data that changes frequently (orders, inventory) */
  REALTIME: 0,
  /** Data with server-provided initial value */
  WITH_INITIAL_DATA: 60_000, // 1 minute
  /** Static reference data (categories, units) */
  REFERENCE_DATA: 10 * 60_000, // 10 minutes
  /** User preferences and settings */
  SETTINGS: 30 * 60_000, // 30 minutes
} as const;

/**
 * Recommended gc times (cache retention)
 */
export const GC_TIMES = {
  SHORT: 5 * 60_000, // 5 minutes
  MEDIUM: 10 * 60_000, // 10 minutes  
  LONG: 30 * 60_000, // 30 minutes
} as const;
