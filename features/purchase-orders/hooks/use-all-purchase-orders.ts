/**
 * useAllPurchaseOrders - Convenience hook for components needing all purchase orders as flat array
 * 
 * Replaces legacy usePurchaseOrderStore().data pattern
 */

import * as React from 'react';
import { usePurchaseOrders } from './use-purchase-orders';
import type { PurchaseOrder } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

/**
 * Returns all purchase orders as a flat array
 * Compatible with legacy store pattern: { data: orders }
 */
export function useAllPurchaseOrders() {
  const query = usePurchaseOrders({ limit: 500 });
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Helper hook to find a purchase order by ID from cached data
 * Replaces legacy findById() method
 */
export function usePurchaseOrderFinder() {
  const { data } = useAllPurchaseOrders();
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined): PurchaseOrder | undefined => {
      if (!systemId) return undefined;
      return data.find(po => po.systemId === systemId);
    },
    [data]
  );
  
  return { findById };
}

/**
 * Returns purchase orders filtered by supplier
 */
export function usePurchaseOrdersBySupplier(supplierSystemId: SystemId | string | undefined) {
  const { data, isLoading } = useAllPurchaseOrders();
  
  const filtered = React.useMemo(
    () => supplierSystemId 
      ? data.filter(po => po.supplierSystemId === supplierSystemId)
      : [],
    [data, supplierSystemId]
  );
  
  return { data: filtered, isLoading };
}
