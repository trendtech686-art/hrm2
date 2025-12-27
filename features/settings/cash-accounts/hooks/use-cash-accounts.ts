/**
 * useCashAccounts - React Query hooks
 * 
 * ⚠️ Direct import: import { useCashAccounts } from '@/features/settings/cash-accounts/hooks/use-cash-accounts'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchCashAccounts,
  fetchCashAccount,
  createCashAccount,
  updateCashAccount,
  deleteCashAccount,
  type CashAccountsParams,
  type CashAccount,
} from '../api/cash-accounts-api';

export const cashAccountKeys = {
  all: ['cash-accounts'] as const,
  lists: () => [...cashAccountKeys.all, 'list'] as const,
  list: (params: CashAccountsParams) => [...cashAccountKeys.lists(), params] as const,
  details: () => [...cashAccountKeys.all, 'detail'] as const,
  detail: (id: string) => [...cashAccountKeys.details(), id] as const,
};

export function useCashAccounts(params: CashAccountsParams = {}) {
  return useQuery({
    queryKey: cashAccountKeys.list(params),
    queryFn: () => fetchCashAccounts(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useCashAccount(id: string | null | undefined) {
  return useQuery({
    queryKey: cashAccountKeys.detail(id!),
    queryFn: () => fetchCashAccount(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

interface UseCashAccountMutationsOptions {
  onCreateSuccess?: (account: CashAccount) => void;
  onUpdateSuccess?: (account: CashAccount) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCashAccountMutations(options: UseCashAccountMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createCashAccount,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cashAccountKeys.all });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<CashAccount> }) => 
      updateCashAccount(systemId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: cashAccountKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: cashAccountKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteCashAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cashAccountKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export function useActiveCashAccounts() {
  return useCashAccounts({ isActive: true, limit: 50 });
}

export function useCashAccountsByBranch(branchId: string | null | undefined) {
  return useCashAccounts({
    branchId: branchId || undefined,
    isActive: true,
    limit: 50,
  });
}

export function useAllCashAccounts() {
  return useCashAccounts({ limit: 200 });
}
