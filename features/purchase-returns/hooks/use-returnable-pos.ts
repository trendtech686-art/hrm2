/**
 * useReturnablePurchaseOrders - Fetches POs that can be returned (have received goods)
 * 
 * Server-side filtered: replaces useAllPurchaseOrders + useAllInventoryReceipts in select mode
 */

import { useQuery } from '@tanstack/react-query';
import { purchaseOrderKeys } from '../../purchase-orders/hooks/use-purchase-orders';

export interface ReturnablePO {
  systemId: string;
  id: string;
  supplierName: string;
  receiptCount: number;
  totalReceived: number;
}

export function useReturnablePurchaseOrders(enabled = true) {
  const query = useQuery({
    queryKey: [...purchaseOrderKeys.all, 'returnable'],
    queryFn: async (): Promise<ReturnablePO[]> => {
      const res = await fetch('/api/purchase-orders/returnable', { credentials: 'include' });
      if (!res.ok) throw new Error('Không thể tải danh sách đơn có thể trả hàng');
      const json = await res.json();
      return json.data ?? json;
    },
    staleTime: 60_000,
    gcTime: 5 * 60 * 1000,
    enabled,
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
  };
}
