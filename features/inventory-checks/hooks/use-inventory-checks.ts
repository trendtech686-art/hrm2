/**
 * useInventoryChecks - React Query hooks (Phiếu Kiểm Kê)
 * 
 * ⚠️ Direct import: import { useInventoryChecks } from '@/features/inventory-checks/hooks/use-inventory-checks'
 * 
 * Updated to use Server Actions for mutations (Phase 2 migration)
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchInventoryChecks,
  fetchInventoryCheck,
  type InventoryChecksParams,
} from '../api/inventory-checks-api';
import {
  createInventoryCheckAction,
  updateInventoryCheckAction,
  deleteInventoryCheckAction,
  balanceInventoryCheckAction,
  cancelInventoryCheckAction,
  syncInventoryCheckItemsAction,
  type CreateInventoryCheckInput,
  type UpdateInventoryCheckInput,
} from '@/app/actions/inventory-checks';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import type { InventoryCheck as _InventoryCheck } from '../types';
import { asSystemId } from '@/lib/id-types';

// Type for Server Action responses
type InventoryCheckData = NonNullable<Awaited<ReturnType<typeof createInventoryCheckAction>>['data']>;

// Re-export types for backwards compatibility
export type { CreateInventoryCheckInput, UpdateInventoryCheckInput };

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
  onCreateSuccess?: (check: InventoryCheckData) => void;
  onUpdateSuccess?: (check: InventoryCheckData) => void;
  onDeleteSuccess?: () => void;
  onBalanceSuccess?: (check: InventoryCheckData) => void;
  onCancelSuccess?: (check: InventoryCheckData) => void;
  onError?: (error: Error) => void;
}

export function useInventoryCheckMutations(options: UseInventoryCheckMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: async (data: CreateInventoryCheckInput) => {
      const result = await createInventoryCheckAction(data);
      if (!result.success) throw new Error(result.error || 'Failed to create inventory check');
      return result.data!;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'inventory-checks');
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: UpdateInventoryCheckInput }) => {
      const result = await updateInventoryCheckAction({ 
        systemId, 
        checkDate: data.checkDate,
        description: data.description,
        updatedBy: data.updatedBy,
      });
      if (!result.success) throw new Error(result.error || 'Failed to update inventory check');
      return result.data!;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'inventory-checks');
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteInventoryCheckAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to delete inventory check');
      return result.data;
    },
    onSuccess: () => {
      invalidateRelated(queryClient, 'inventory-checks');
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  const balance = useMutation({
    mutationFn: async ({ systemId, balancedBy }: { systemId: string; balancedBy: string }) => {
      const result = await balanceInventoryCheckAction(systemId, balancedBy);
      if (!result.success) throw new Error(result.error || 'Failed to balance inventory check');
      return result.data!;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'inventory-checks');
      options.onBalanceSuccess?.(data);
    },
    onError: options.onError,
  });

  // ✅ Sync items mutation - saves all form items to DB before balance
  const syncItems = useMutation({
    mutationFn: async ({ systemId, items }: { systemId: string; items: CreateInventoryCheckInput['items'] }) => {
      const result = await syncInventoryCheckItemsAction(systemId, items || []);
      if (!result.success) throw new Error(result.error || 'Failed to sync items');
      return result.data!;
    },
    onSuccess: (data, { systemId }) => {
      queryClient.invalidateQueries({ queryKey: inventoryCheckKeys.detail(systemId) });
    },
    onError: options.onError,
  });
  
  const cancel = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await cancelInventoryCheckAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to cancel inventory check');
      return result.data!;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'inventory-checks');
      options.onCancelSuccess?.(data);
    },
    onError: options.onError,
  });
  
  return { create, update, remove, balance, syncItems, cancel };
}

export function useDraftInventoryChecks() {
  return useInventoryChecks({ status: 'draft' });
}

export function useInventoryChecksByBranch(branchId: string | null | undefined) {
  return useInventoryChecks({
    branchId: branchId || undefined,
  });
}

// ============================================================================
// Stats Hook
// ============================================================================

export interface InventoryCheckStats {
  draft: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  total: number;
}

export function useInventoryCheckStats(initialData?: InventoryCheckStats) {
  return useQuery({
    queryKey: [...inventoryCheckKeys.all, 'stats'] as const,
    queryFn: async () => {
      const response = await fetch('/api/inventory-checks/stats');
      if (!response.ok) throw new Error('Failed to fetch inventory check stats');
      return response.json() as Promise<InventoryCheckStats>;
    },
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    initialData,
  });
}
