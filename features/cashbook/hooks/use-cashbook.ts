/**
 * Cashbook React Query Hooks
 * Provides data fetching and mutations for cash accounts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCashAccounts,
  fetchCashAccountById,
  createCashAccount,
  updateCashAccount,
  deleteCashAccount,
  setDefaultCashAccount,
  fetchAccountBalance,
  fetchActiveCashAccounts,
  type CashAccountFilters,
  type CashAccountCreateInput,
  type CashAccountUpdateInput,
} from '../api/cashbook-api';

// Query keys factory
export const cashbookKeys = {
  all: ['cashbook'] as const,
  lists: () => [...cashbookKeys.all, 'list'] as const,
  list: (filters: CashAccountFilters) => [...cashbookKeys.lists(), filters] as const,
  active: () => [...cashbookKeys.all, 'active'] as const,
  details: () => [...cashbookKeys.all, 'detail'] as const,
  detail: (id: string) => [...cashbookKeys.details(), id] as const,
  balance: (id: string) => [...cashbookKeys.all, 'balance', id] as const,
};

/**
 * Hook to fetch cash accounts with filters
 */
export function useCashAccounts(filters: CashAccountFilters = {}) {
  return useQuery({
    queryKey: cashbookKeys.list(filters),
    queryFn: () => fetchCashAccounts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes - accounts don't change often
  });
}

/**
 * Hook to fetch active cash accounts (for dropdowns)
 */
export function useActiveCashAccounts() {
  return useQuery({
    queryKey: cashbookKeys.active(),
    queryFn: fetchActiveCashAccounts,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch single cash account
 */
export function useCashAccountById(systemId: string | undefined) {
  return useQuery({
    queryKey: cashbookKeys.detail(systemId!),
    queryFn: () => fetchCashAccountById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch account balance
 */
export function useCashAccountBalance(systemId: string | undefined) {
  return useQuery({
    queryKey: cashbookKeys.balance(systemId!),
    queryFn: () => fetchAccountBalance(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 30, // 30 seconds - balance changes frequently
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing cash account mutations
 */
export function useCashAccountMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateCashbook = () => {
    queryClient.invalidateQueries({ queryKey: cashbookKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: CashAccountCreateInput) => createCashAccount(data),
    onSuccess: () => {
      invalidateCashbook();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: CashAccountUpdateInput }) =>
      updateCashAccount(systemId, data),
    onSuccess: () => {
      invalidateCashbook();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteCashAccount(systemId),
    onSuccess: () => {
      invalidateCashbook();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const setDefault = useMutation({
    mutationFn: (systemId: string) => setDefaultCashAccount(systemId),
    onSuccess: () => {
      invalidateCashbook();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    create,
    update,
    remove,
    setDefault,
    isLoading:
      create.isPending ||
      update.isPending ||
      remove.isPending ||
      setDefault.isPending,
  };
}

/**
 * Hook to get cash accounts by type
 */
export function useCashAccountsByType(type: 'cash' | 'bank') {
  return useCashAccounts({ type, isActive: true });
}

// Alias for backward compatibility
export { useActiveCashAccounts as useCashbookAccounts };
