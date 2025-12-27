/**
 * useAllInventoryChecks - Convenience hook for flat array of inventory checks
 * Returns all inventory checks (equivalent to old store's data array)
 */

import { useCallback } from 'react';
import { useInventoryChecks } from './use-inventory-checks';
import type { InventoryCheck } from '../types';

export function useAllInventoryChecks() {
  const { data, ...rest } = useInventoryChecks({});
  return {
    data: data?.data || [],
    ...rest,
  };
}

export function useInventoryCheckFinder() {
  const { data: inventoryChecks = [] } = useAllInventoryChecks();
  
  const findById = useCallback((systemId: string): InventoryCheck | null => {
    return inventoryChecks.find(ic => ic.systemId === systemId) ?? null;
  }, [inventoryChecks]);
  
  return { findById };
}
