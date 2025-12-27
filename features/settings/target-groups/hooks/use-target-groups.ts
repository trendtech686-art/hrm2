/**
 * Target Groups React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTargetGroups,
  fetchTargetGroupById,
  createTargetGroup,
  updateTargetGroup,
  deleteTargetGroup,
  setDefaultTargetGroup,
  fetchActiveTargetGroups,
  type TargetGroupFilters,
  type TargetGroupCreateInput,
  type TargetGroupUpdateInput,
} from '../api/target-groups-api';

export const targetGroupKeys = {
  all: ['target-groups'] as const,
  lists: () => [...targetGroupKeys.all, 'list'] as const,
  list: (filters: TargetGroupFilters) => [...targetGroupKeys.lists(), filters] as const,
  details: () => [...targetGroupKeys.all, 'detail'] as const,
  detail: (id: string) => [...targetGroupKeys.details(), id] as const,
  active: () => [...targetGroupKeys.all, 'active'] as const,
};

export function useTargetGroups(filters: TargetGroupFilters = {}) {
  return useQuery({
    queryKey: targetGroupKeys.list(filters),
    queryFn: () => fetchTargetGroups(filters),
    staleTime: 1000 * 60 * 10,
  });
}

export function useTargetGroupById(systemId: string | undefined) {
  return useQuery({
    queryKey: targetGroupKeys.detail(systemId!),
    queryFn: () => fetchTargetGroupById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 10,
  });
}

export function useActiveTargetGroups() {
  return useQuery({
    queryKey: targetGroupKeys.active(),
    queryFn: fetchActiveTargetGroups,
    staleTime: 1000 * 60 * 10,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useTargetGroupMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: targetGroupKeys.all });

  const create = useMutation({
    mutationFn: (data: TargetGroupCreateInput) => createTargetGroup(data),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: TargetGroupUpdateInput }) =>
      updateTargetGroup(systemId, data),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteTargetGroup(systemId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const setDefault = useMutation({
    mutationFn: (systemId: string) => setDefaultTargetGroup(systemId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  return {
    create, update, remove, setDefault,
    isLoading: create.isPending || update.isPending || remove.isPending || setDefault.isPending,
  };
}
