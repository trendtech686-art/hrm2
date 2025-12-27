/**
 * useInventoryChecks - React Query hooks (Phiếu Kiểm Kê)
 * 
 * ⚠️ Direct import: import { useInventoryChecks } from '@/features/inventory-checks/hooks/use-inventory-checks'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchInventoryChecks,
  fetchInventoryCheck,
  createInventoryCheck,
  updateInventoryCheck,
  deleteInventoryCheck,
  balanceInventoryCheck,
  cancelInventoryCheck,
  type InventoryChecksParams,
} from '../api/inventory-checks-api';
import type { InventoryCheck } from '../types';
import { asSystemId } from '@/lib/id-types';

export const inventoryCheckKeys = {
  all: ['inventory-checks'] as const,
  lists: () => [...inventoryCheckKeys.all, 'list'] as const,
  list: (params: InventoryChecksParams) => [...inventoryCheckKeys.lists(), params] as const,
  details: () => [...inventoryCheckKeys.all, 'detail'] as const,
  detail: (id: string) => [...inventoryCheckKeys.details(), id] as const,
};

export function useInventoryChecks(params: InventoryChecksParams = {}) {
  return useQuery({
    queryKey: inventoryCheckKeys.list(params),
    queryFn: () => fetchInventoryChecks(params),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useInventoryCheck(id: string | null | undefined) {
  return useQuery({
    queryKey: inventoryCheckKeys.detail(id!),
    queryFn: () => fetchInventoryCheck(asSystemId(id!)),
    enabled: !!id,
    staleTime: 60_000,
  });
}

interface UseInventoryCheckMutationsOptions {
  onCreateSuccess?: (check: InventoryCheck) => void;
  onUpdateSuccess?: (check: InventoryCheck) => void;
  onDeleteSuccess?: () => void;
  onBalanceSuccess?: (check: InventoryCheck) => void;
  onCancelSuccess?: (check: InventoryCheck) => void;
  onError?: (error: Error) => void;
}

export function useInventoryCheckMutations(options: UseInventoryCheckMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createInventoryCheck,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: inventoryCheckKeys.lists() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<InventoryCheck> }) => 
      updateInventoryCheck(asSystemId(systemId), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryCheckKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: inventoryCheckKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: (systemId: string) => deleteInventoryCheck(asSystemId(systemId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryCheckKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  const balance = useMutation({
    mutationFn: (systemId: string) => balanceInventoryCheck(asSystemId(systemId)),
    onSuccess: (data, systemId) => {
      queryClient.invalidateQueries({ queryKey: inventoryCheckKeys.detail(systemId) });
      queryClient.invalidateQueries({ queryKey: inventoryCheckKeys.lists() });
      options.onBalanceSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const cancel = useMutation({
    mutationFn: ({ systemId, reason }: { systemId: string; reason: string }) => 
      cancelInventoryCheck(asSystemId(systemId), reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryCheckKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: inventoryCheckKeys.lists() });
      options.onCancelSuccess?.(data);
    },
    onError: options.onError,
  });
  
  return { create, update, remove, balance, cancel };
}

export function useDraftInventoryChecks() {
  return useInventoryChecks({ status: 'draft' });
}

export function useInventoryChecksByBranch(branchId: string | null | undefined) {
  return useInventoryChecks({
    branchId: branchId || undefined,
    limit: 50,
  });
}
