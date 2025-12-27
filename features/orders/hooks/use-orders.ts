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

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchOrders, fetchOrder, fetchOrderStats, type OrdersParams } from '../api/orders-api';

// Query keys - exported for invalidation
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: OrdersParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  stats: () => [...orderKeys.all, 'stats'] as const,
};

/**
 * Hook for fetching paginated orders list
 * 
 * @example
 * ```tsx
 * function OrdersPage() {
 *   const [page, setPage] = useState(1);
 *   const { data, isLoading, error } = useOrders({ page, limit: 50 });
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
export function useOrders(params: OrdersParams = {}) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => fetchOrders(params),
    staleTime: 30_000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    placeholderData: keepPreviousData, // Keep old data while fetching new page
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
export function useOrder(id: string | null | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(id!),
    queryFn: () => fetchOrder(id!),
    enabled: !!id, // Only fetch if id is provided
    staleTime: 60_000, // 1 minute for detail view
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching order statistics (dashboard)
 */
export function useOrderStats() {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: fetchOrderStats,
    staleTime: 60_000, // 1 minute
    gcTime: 5 * 60 * 1000,
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

// Re-export from use-all-orders for backward compatibility
export { useAllOrders, useOrderFinder } from './use-all-orders';
