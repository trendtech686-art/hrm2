/**
 * Penalties React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/penalties-api';
import type { Penalty, PenaltyType } from '@/lib/types/prisma-extended';
import type { PenaltyFilters } from '../api/penalties-api';

export const penaltyKeys = {
  all: ['penalties'] as const,
  lists: () => [...penaltyKeys.all, 'list'] as const,
  list: (filters: PenaltyFilters) => [...penaltyKeys.lists(), filters] as const,
  details: () => [...penaltyKeys.all, 'detail'] as const,
  detail: (id: string) => [...penaltyKeys.details(), id] as const,
  types: () => [...penaltyKeys.all, 'types'] as const,
};

export function usePenalties(filters: PenaltyFilters = {}) {
  return useQuery({ queryKey: penaltyKeys.list(filters), queryFn: () => api.fetchPenalties(filters), staleTime: 1000 * 60 * 5 });
}

export function usePenaltyById(systemId: string | undefined) {
  return useQuery({ queryKey: penaltyKeys.detail(systemId!), queryFn: () => api.fetchPenaltyById(systemId!), enabled: !!systemId });
}

export function usePenaltyMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: penaltyKeys.all });
  return {
    create: useMutation({ mutationFn: api.createPenalty, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Penalty> }) => api.updatePenalty(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deletePenalty, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Penalty Types
export function usePenaltyTypes() {
  return useQuery({ queryKey: penaltyKeys.types(), queryFn: api.fetchPenaltyTypes, staleTime: 1000 * 60 * 10 });
}

export function usePenaltyTypeMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: penaltyKeys.types() });
  return {
    create: useMutation({ mutationFn: api.createPenaltyType, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<PenaltyType> }) => api.updatePenaltyType(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deletePenaltyType, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}
