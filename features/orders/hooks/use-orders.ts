/**
 * useOrders - React Query hook for orders list
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import this file directly: import { useOrders } from '@/features/orders/hooks/use-orders'
 * - NEVER import from '@/features/orders' or '@/features/orders/store'
 * 
 * This hook is ISOLATED - it only depends on:
 * - @tanstack/react-query
 * - Local API functions
 * - Local types
 */

import * as React from 'react';
import { useCallback } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchOrders, fetchOrder, fetchOrderStats, type OrdersParams, type PaginatedResponse, type OrderStatsResponse } from '../api/orders-api';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import type { Order } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

// Query keys - exported for invalidation
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: OrdersParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  stats: () => [...orderKeys.all, 'stats'] as const,
  customer: (customerSystemId: string) => ['orders', 'customer', customerSystemId] as const,
  unpaid: (customerSystemId: string) => ['orders', 'unpaid', customerSystemId] as const,
};

/**
 * Hook for fetching order statistics with optional initial data from Server Component
 */
export function useOrderStats(initialData?: OrderStatsResponse) {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: fetchOrderStats,
    initialData,
    staleTime: initialData ? 60_000 : 0,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching paginated orders list
 * Supports initialData from Server Component for instant hydration
 * 
 * @example
 * ```tsx
 * function OrdersPage({ initialData }) {
 *   const [page, setPage] = useState(1);
 *   const { data, isLoading, error } = useOrders({ page, limit: 50 }, initialData);
 *   
 *   if (isLoading) return <Skeleton />;
 *   if (error) return <ErrorMessage error={error} />;
 *   
 *   return (
 *     <DataTable 
 *       data={data.data} 
 *       pagination={data.pagination}
 *       onPageChange={setPage}
 *     />
 *   );
 * }
 * ```
 */
export function useOrders(
  params: OrdersParams & { enabled?: boolean } = {},
  initialData?: PaginatedResponse<Order>
) {
  const { enabled = true, ...fetchParams } = params;
  return useQuery({
    queryKey: orderKeys.list(fetchParams),
    queryFn: () => fetchOrders(fetchParams),
    initialData,
    staleTime: initialData ? 60_000 : 30_000,
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    placeholderData: keepPreviousData, // Keep old data while fetching new page
    enabled,
  });
}

/**
 * Hook for fetching single order by ID
 * 
 * @example
 * ```tsx
 * function OrderDetail({ orderId }: { orderId: string }) {
 *   const { data: order, isLoading } = useOrder(orderId);
 *   // ...
 * }
 * ```
 */
export function useOrder(id: string | null | undefined, initialData?: Order) {
  return useQuery({
    queryKey: orderKeys.detail(id!),
    queryFn: () => fetchOrder(id!),
    initialData,
    enabled: !!id, // Only fetch if id is provided
    staleTime: initialData ? 60_000 : 30_000,
    gcTime: 10 * 60 * 1000, // 10 minutes
    // ✅ Always refetch on mount to ensure fresh data
    refetchOnMount: 'always',
  });
}

/**
 * Hook for searching orders with debounce
 * 
 * @example
 * ```tsx
 * function OrderSearch() {
 *   const [search, setSearch] = useState('');
 *   const debouncedSearch = useDebounce(search, 300);
 *   const { data } = useOrderSearch(debouncedSearch);
 *   // ...
 * }
 * ```
 */
export function useOrderSearch(search: string, limit = 20) {
  return useQuery({
    queryKey: orderKeys.list({ search, limit }),
    queryFn: () => fetchOrders({ search, limit }),
    enabled: search.length >= 2, // Only search with 2+ chars
    staleTime: 30_000,
  });
}

/**
 * Cache-only finder: subscribes to the orders query cache but NEVER triggers a fetch.
 * Requires another component to have already loaded the orders list.
 *
 * @example
 * ```tsx
 * const { findById, findByBusinessId } = useOrderFinder();
 * const order = findById(systemId);
 * ```
 */
export function useOrderFinder() {
  const { data } = useQuery({
    queryKey: [...orderKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchOrders(p)),
    enabled: false, // Cache-only: never triggers a fetch
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  const findById = useCallback(
    (systemId: SystemId | string | undefined): Order | undefined => {
      if (!systemId) return undefined;
      return data?.find(o => o.systemId === systemId);
    },
    [data]
  );

  const findByBusinessId = useCallback(
    (businessId: string | undefined): Order | undefined => {
      if (!businessId) return undefined;
      return data?.find(o => o.id === businessId);
    },
    [data]
  );

  return { findById, findByBusinessId };
}
