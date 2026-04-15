import { useQuery } from '@tanstack/react-query';
import type { StockOrderItem, StockOrderType } from '../components/stock-orders-dialog';
import type { SystemId } from '@/lib/id-types';

interface UseStockOrdersOptions {
  productSystemId: SystemId;
  branchSystemId: string;
  type: StockOrderType;
  enabled?: boolean;
  page?: number;
  limit?: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StockOrdersResponse {
  items: StockOrderItem[];
  totalQuantity: number;
  orderQuantity?: number;
  warrantyQuantity?: number;
  pagination?: PaginationInfo;
}

/**
 * Hook to fetch stock orders (committed, in-transit, in-delivery) for a product at a branch.
 * 
 * ⚡ OPTIMIZED: Uses dedicated server-side filtered API with pagination instead of fetching ALL orders 
 * and filtering client-side. The API handles branch + status + product filtering in SQL.
 */
export function useStockOrders({
  productSystemId,
  branchSystemId,
  type,
  enabled = true,
  page = 1,
  limit = 10,
}: UseStockOrdersOptions) {
  const { data, isLoading } = useQuery({
    queryKey: ['products', productSystemId, 'stock-orders', type, branchSystemId, page, limit],
    queryFn: async (): Promise<StockOrdersResponse> => {
      const params = new URLSearchParams({
        type,
        branchSystemId,
        page: String(page),
        limit: String(limit),
      });
      const response = await fetch(`/api/products/${productSystemId}/stock-orders?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock orders');
      }
      return response.json();
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: enabled && !!productSystemId && !!branchSystemId,
  });

  return {
    items: data?.items ?? [],
    isLoading,
    totalQuantity: data?.totalQuantity ?? 0,
    orderQuantity: data?.orderQuantity ?? 0,
    warrantyQuantity: data?.warrantyQuantity ?? 0,
    pagination: data?.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 },
  };
}
