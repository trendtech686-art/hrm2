/**
 * useAllCashAccounts - Convenience hook for flat array of cash accounts
 * Returns all cash accounts (equivalent to old store's accounts array)
 * Uses fetchAllPages auto-pagination to load ALL records
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchCashAccounts } from '../api/cashbook-api';
import { cashbookKeys } from './use-cashbook';

const EMPTY_ACCOUNTS: never[] = [];

export function useAllCashAccounts(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...cashbookKeys.all, 'all-accounts'],
    queryFn: () => fetchAllPages((p) => fetchCashAccounts(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: options?.enabled,
  });
  const accounts = useMemo(() => query.data ?? EMPTY_ACCOUNTS, [query.data]);
  return {
    accounts,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
