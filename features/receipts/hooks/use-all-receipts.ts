/**
 * useAllReceipts - Convenience hook for components needing all receipts as flat array
 */

import * as React from 'react';
import { useReceipts } from './use-receipts';
import type { Receipt } from '@/lib/types/prisma-extended';

export function useAllReceipts() {
  const query = useReceipts({});
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Finder hook for looking up receipts by systemId
 */
export function useReceiptFinder() {
  const { data: receipts = [] } = useAllReceipts();
  
  const findById = React.useCallback((systemId: string): Receipt | undefined => {
    return receipts.find(r => r.systemId === systemId);
  }, [receipts]);
  
  return { findById };
}
