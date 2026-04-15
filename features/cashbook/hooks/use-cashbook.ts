/**
 * Cashbook React Query Hooks
 * Provides data fetching and mutations for cash accounts
 * 
 * ⚠️ Direct import: import { useCashAccounts } from '@/features/cashbook/hooks/use-cashbook'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchCashAccounts,
  fetchActiveCashAccounts,
  type CashAccountFilters,
} from '../api/cashbook-api';
import {
  createCashAccountAction,
  updateCashAccountAction,
  deleteCashAccountAction,
  setDefaultCashAccountAction,
  type CreateCashAccountInput,
  type UpdateCashAccountInput,
} from '@/app/actions/cashbook';
import { invalidateRelated } from '@/lib/query-invalidation-map';

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
    staleTime: 0, // ⚠️ QUAN TRỌNG: 0 để refetch ngay sau invalidate
    gcTime: 1000 * 60 * 60,
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
    placeholderData: keepPreviousData,
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
    invalidateRelated(queryClient, 'cashbook');
  };

  const create = useMutation({
    mutationFn: async (data: CreateCashAccountInput) => {
      const result = await createCashAccountAction(data);
      if (!result.success) throw new Error(result.error || 'Failed to create cash account');
      return result.data!;
    },
    onSuccess: () => {
      invalidateCashbook();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: Partial<UpdateCashAccountInput> }) => {
      const result = await updateCashAccountAction({ systemId, ...data });
      if (!result.success) throw new Error(result.error || 'Failed to update cash account');
      return result.data!;
    },
    onSuccess: () => {
      invalidateCashbook();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteCashAccountAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to delete cash account');
      return result.data;
    },
    onSuccess: () => {
      invalidateCashbook();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const setDefault = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await setDefaultCashAccountAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to set default account');
      return result.data!;
    },
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
