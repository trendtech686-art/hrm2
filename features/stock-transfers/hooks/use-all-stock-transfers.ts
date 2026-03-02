/**
 * useAllStockTransfers - Convenience hook for flat array of stock transfers
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchStockTransfers } from '../api/stock-transfers-api';
import { stockTransferKeys } from './use-stock-transfers';
import { asBusinessId, type BusinessId } from '@/lib/id-types';

interface UseAllStockTransfersOptions {
  enabled?: boolean;
}

export function useAllStockTransfers(options: UseAllStockTransfersOptions = {}) {
  const { enabled = true } = options;
  const query = useQuery({
    queryKey: [...stockTransferKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchStockTransfers(p)),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled,
  });
  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
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
