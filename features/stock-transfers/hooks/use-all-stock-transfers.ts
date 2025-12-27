/**
 * useAllStockTransfers - Convenience hook for flat array of stock transfers
 * Returns all stock transfers data without pagination
 */

import * as React from 'react';
import { useStockTransfers } from './use-stock-transfers';
import { asBusinessId, type BusinessId } from '@/lib/id-types';

export function useAllStockTransfers() {
  const { data, ...rest } = useStockTransfers({ limit: 30 });
  return {
    data: data?.data ?? [],
    ...rest,
  };
}

/**
 * Hook to generate next transfer ID and check for duplicates
 * Replaces legacy getNextId() and isBusinessIdExists() from store
 */
export function useStockTransferIdHelper() {
  const { data: transfers } = useAllStockTransfers();
  
  const getNextId = React.useCallback((): BusinessId => {
    const today = new Date();
    const prefix = `CK${today.getFullYear().toString().slice(-2)}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    
    // Find highest number for today's prefix
    const todayTransfers = transfers.filter(t => t.id.startsWith(prefix));
    const maxNum = todayTransfers.reduce((max, t) => {
      const numPart = parseInt(t.id.slice(prefix.length), 10);
      return isNaN(numPart) ? max : Math.max(max, numPart);
    }, 0);
    
    return asBusinessId(`${prefix}${String(maxNum + 1).padStart(3, '0')}`);
  }, [transfers]);
  
  const isBusinessIdExists = React.useCallback((id: string): boolean => {
    return transfers.some(t => t.id === id);
  }, [transfers]);
  
  return { getNextId, isBusinessIdExists };
}
