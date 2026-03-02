/**
 * useAllCashAccounts - Convenience hook for flat array of cash accounts
 * Returns all cash accounts (equivalent to old store's accounts array)
 * Uses fetchAllPages auto-pagination to load ALL records
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchCashAccounts } from '../api/cashbook-api';
import { cashbookKeys } from './use-cashbook';

export function useAllCashAccounts() {
  const query = useQuery({
    queryKey: [...cashbookKeys.all, 'all-accounts'],
    queryFn: () => fetchAllPages((p) => fetchCashAccounts(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  return {
    accounts: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
