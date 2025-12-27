/**
 * useAllInventoryReceipts - Convenience hook for components needing all inventory receipts
 */

import { useCallback } from 'react';
import { useInventoryReceipts } from './use-inventory-receipts';
import type { InventoryReceipt } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

/**
 * Returns all inventory receipts as a flat array
 */
export function useAllInventoryReceipts() {
  const query = useInventoryReceipts({ limit: 1000 });
  
  return {
    data: query.data?.data || [],
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
