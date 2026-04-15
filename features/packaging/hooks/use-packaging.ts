/**
 * Packaging React Query Hooks
 * 
 * ⚠️ Direct import: import { usePackagingSlips } from '@/features/packaging/hooks/use-packaging'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import * as api from '../api/packaging-api';
import type { PackagingFilters } from '../api/packaging-api';
import {
  completePackagingAction,
  cancelPackagingAction,
  updatePackagingAction,
  markAsPrintedAction,
} from '@/app/actions/packagings';

export const packagingKeys = {
  all: ['packaging'] as const,
  lists: () => [...packagingKeys.all, 'list'] as const,
  list: (filters: PackagingFilters) => [...packagingKeys.lists(), filters] as const,
  details: () => [...packagingKeys.all, 'detail'] as const,
  detail: (id: string) => [...packagingKeys.details(), id] as const,
};

export function usePackagingSlips(filters: PackagingFilters = {}) {
  return useQuery({
    queryKey: packagingKeys.list(filters),
    queryFn: () => api.fetchPackagingSlips(filters),
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
  });
}

export function usePackagingById(systemId: string | undefined) {
  return useQuery({ 
    queryKey: packagingKeys.detail(systemId!), 
    queryFn: () => api.fetchPackagingById(systemId!), 
    enabled: !!systemId,
    retry: 1, // Retry once on failure
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function usePackagingMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => invalidateRelated(qc, 'packaging');
  
  return {
    confirm: useMutation({ 
      mutationFn: async (systemId: string) => {
        const result = await completePackagingAction(systemId, '');
        if (!result.success) throw new Error(result.error || 'Không thể xác nhận đóng gói');
        return result.data!;
      }, 
      onSuccess: () => { invalidate(); opts?.onSuccess?.(); } 
    }),
    cancel: useMutation({ 
      mutationFn: async ({ systemId, reason }: { systemId: string; reason: string }) => {
        const result = await cancelPackagingAction(systemId, '', reason);
        if (!result.success) throw new Error(result.error || 'Không thể hủy đóng gói');
        return result.data!;
      }, 
      onSuccess: () => { invalidate(); opts?.onSuccess?.(); } 
    }),
    assign: useMutation({ 
      mutationFn: async ({ systemId, employeeSystemId }: { systemId: string; employeeSystemId: string }) => {
        const result = await updatePackagingAction({ systemId, assignedEmployeeId: employeeSystemId });
        if (!result.success) throw new Error(result.error || 'Không thể phân công đóng gói');
        return result.data!;
      }, 
      onSuccess: () => { invalidate(); opts?.onSuccess?.(); } 
    }),
    print: useMutation({ 
      mutationFn: async (systemId: string) => {
        const result = await markAsPrintedAction(systemId);
        if (!result.success) throw new Error(result.error || 'Không thể đánh dấu đã in');
        return result.data!;
      }, 
      onSuccess: opts?.onSuccess 
    }),
  };
}
