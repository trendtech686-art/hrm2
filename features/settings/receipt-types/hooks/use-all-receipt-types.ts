/**
 * useAllReceiptTypes - Convenience hook for flat array of receipt types
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchReceiptTypes } from '../api/receipt-types-api';
import { receiptTypeKeys } from './use-receipt-types';

const EMPTY_TYPES: never[] = [];

export function useAllReceiptTypes(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...receiptTypeKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchReceiptTypes(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
  const data = useMemo(() => query.data ?? EMPTY_TYPES, [query.data]);
  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
