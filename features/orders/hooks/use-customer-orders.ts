/**
 * Hook to fetch ALL orders for a specific customer
 * 
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 * Uses fetchAllPages to fetch all pages automatically.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import type { Order } from '@/lib/types/prisma-extended';

interface UseCustomerOrdersOptions {
  customerSystemId?: string;
  enabled?: boolean;
}

/**
 * Fetch all orders for a specific customer via auto-pagination.
 * Much more efficient than loading all orders and filtering client-side.
 */
export function useCustomerOrders(options: UseCustomerOrdersOptions = {}) {
  const { customerSystemId, enabled = true } = options;

  const query = useQuery<Order[]>({
    queryKey: ['orders', 'customer', customerSystemId],
    queryFn: async () => {
      if (!customerSystemId) return [];
      return fetchAllPages<Order>(async (p) => {
        const params = new URLSearchParams({
          customerSystemId,
          page: String(p.page),
          limit: String(p.limit),
        });
        const response = await fetch(`/api/orders?${params}`);
        if (!response.ok) throw new Error('Failed to fetch customer orders');
        return response.json();
      });
    },
    enabled: enabled && !!customerSystemId,
    staleTime: 30 * 1000,
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
