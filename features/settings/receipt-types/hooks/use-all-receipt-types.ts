/**
 * useAllReceiptTypes - Convenience hook for flat array of receipt types
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchReceiptTypes } from '../api/receipt-types-api';
import { receiptTypeKeys } from './use-receipt-types';

export function useAllReceiptTypes() {
  const query = useQuery({
    queryKey: [...receiptTypeKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchReceiptTypes(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
