/**
 * useCashAccounts - React Query hooks
 * 
 * ⚠️ Direct import: import { useCashAccounts } from '@/features/settings/cash-accounts/hooks/use-cash-accounts'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
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
    gcTime: 30 * 60 * 1000,
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
  const query = useQuery({
    queryKey: [...cashAccountKeys.all, 'active'],
    queryFn: () => fetchAllPages((p) => fetchCashAccounts({ ...p, isActive: true })),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  return { ...query, data: query.data ? { data: query.data } : undefined };
}

export function useCashAccountsByBranch(branchId: string | null | undefined) {
  const query = useQuery({
    queryKey: [...cashAccountKeys.all, 'branch', branchId],
    queryFn: () => fetchAllPages((p) => fetchCashAccounts({ ...p, branchId: branchId || undefined, isActive: true })),
    enabled: !!branchId,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  return { ...query, data: query.data ? { data: query.data } : undefined };
}

export function useAllCashAccounts() {
  const query = useQuery({
    queryKey: [...cashAccountKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchCashAccounts(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  return { ...query, data: query.data ? { data: query.data } : undefined };
}
