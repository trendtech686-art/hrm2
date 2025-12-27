/**
 * Reconciliation React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/reconciliation-api';
import type { ReconciliationFilters } from '../api/reconciliation-api';

export const reconciliationKeys = {
  all: ['reconciliation'] as const,
  lists: () => [...reconciliationKeys.all, 'list'] as const,
  list: (filters: ReconciliationFilters) => [...reconciliationKeys.lists(), filters] as const,
  details: () => [...reconciliationKeys.all, 'detail'] as const,
  detail: (id: string) => [...reconciliationKeys.details(), id] as const,
};

export function useReconciliations(filters: ReconciliationFilters = {}) {
  return useQuery({ queryKey: reconciliationKeys.list(filters), queryFn: () => api.fetchReconciliations(filters), staleTime: 1000 * 60 * 2 });
}

export function useReconciliationById(systemId: string | undefined) {
  return useQuery({ queryKey: reconciliationKeys.detail(systemId!), queryFn: () => api.fetchReconciliationById(systemId!), enabled: !!systemId });
}

export function useReconciliationMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: reconciliationKeys.all });
  return {
    markReconciled: useMutation({ mutationFn: ({ systemId, notes }: { systemId: string; notes?: string }) => api.markAsReconciled(systemId, notes), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    updateAmount: useMutation({ mutationFn: ({ systemId, actualAmount }: { systemId: string; actualAmount: number }) => api.updateActualAmount(systemId, actualAmount), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}
