/**
 * Packaging React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/packaging-api';
import type { PackagingFilters } from '../api/packaging-api';

export const packagingKeys = {
  all: ['packaging'] as const,
  lists: () => [...packagingKeys.all, 'list'] as const,
  list: (filters: PackagingFilters) => [...packagingKeys.lists(), filters] as const,
  details: () => [...packagingKeys.all, 'detail'] as const,
  detail: (id: string) => [...packagingKeys.details(), id] as const,
};

export function usePackagingSlips(filters: PackagingFilters = {}) {
  return useQuery({ queryKey: packagingKeys.list(filters), queryFn: () => api.fetchPackagingSlips(filters), staleTime: 1000 * 60 * 2 });
}

export function usePackagingById(systemId: string | undefined) {
  return useQuery({ queryKey: packagingKeys.detail(systemId!), queryFn: () => api.fetchPackagingById(systemId!), enabled: !!systemId });
}

export function usePackagingMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: packagingKeys.all });
  return {
    confirm: useMutation({ mutationFn: api.confirmPackaging, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    cancel: useMutation({ mutationFn: ({ systemId, reason }: { systemId: string; reason: string }) => api.cancelPackaging(systemId, reason), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    assign: useMutation({ mutationFn: ({ systemId, employeeSystemId }: { systemId: string; employeeSystemId: string }) => api.assignPackaging(systemId, employeeSystemId), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    print: useMutation({ mutationFn: api.printPackaging, onSuccess: opts?.onSuccess }),
  };
}
