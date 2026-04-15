/**
 * useAllInventoryReceipts - Convenience hook for components needing all inventory receipts
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchInventoryReceipts } from '../api/inventory-receipts-api';
import { inventoryReceiptKeys } from './use-inventory-receipts';
import type { InventoryReceipt } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

/**
 * Returns all inventory receipts as a flat array
 */
export function useAllInventoryReceipts(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...inventoryReceiptKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchInventoryReceipts(p)),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Hook providing a findById function for inventory receipts
 */
export function useInventoryReceiptFinder() {
  const { data, isLoading } = useAllInventoryReceipts();
  
  const findById = useCallback((systemId: SystemId): InventoryReceipt | undefined => {
    return data.find(r => r.systemId === systemId);
  }, [data]);
  
  return { findById, isLoading };
}

/**
 * Returns inventory receipts filtered by product (receipts containing items for this product)
 * ✅ Server-side filter via API - avoids loading ALL receipts
 */
export function useProductInventoryReceipts(productSystemId?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...inventoryReceiptKeys.all, 'byProduct', productSystemId],
    queryFn: () => fetchAllPages((p) => fetchInventoryReceipts({ ...p, productSystemId })),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!productSystemId && (options?.enabled ?? true),
  });
}
