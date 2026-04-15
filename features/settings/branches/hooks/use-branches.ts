/**
 * useBranches - React Query hooks
 * 
 * ⚠️ Direct import: import { useBranches } from '@/features/settings/branches/hooks/use-branches'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import {
  fetchBranches,
  fetchBranch,
  createBranch,
  updateBranch,
  deleteBranch,
  setDefaultBranch,
  type BranchesParams,
  type Branch,
} from '../api/branches-api';

export const branchKeys = {
  all: ['branches'] as const,
  lists: () => [...branchKeys.all, 'list'] as const,
  list: (params: BranchesParams) => [...branchKeys.lists(), params] as const,
  details: () => [...branchKeys.all, 'detail'] as const,
  detail: (id: string) => [...branchKeys.details(), id] as const,
};

export function useBranches(params: BranchesParams = {}) {
  return useQuery({
    queryKey: branchKeys.list(params),
    queryFn: () => fetchBranches(params),
    staleTime: 10 * 60 * 1000, // Branches rarely change
    gcTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useBranch(id: string | null | undefined) {
  return useQuery({
    queryKey: branchKeys.detail(id!),
    queryFn: () => fetchBranch(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

interface UseBranchMutationsOptions {
  onCreateSuccess?: (branch: Branch) => void;
  onUpdateSuccess?: (branch: Branch) => void;
  onDeleteSuccess?: () => void;
  onSetDefaultSuccess?: (branch: Branch) => void;
  onError?: (error: Error) => void;
}

export function useBranchMutations(options: UseBranchMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createBranch,
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'branches');
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Branch> }) => 
      updateBranch(systemId, data),
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'branches');
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => {
      invalidateRelated(queryClient, 'branches');
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  const makeDefault = useMutation({
    mutationFn: setDefaultBranch,
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'branches');
      options.onSetDefaultSuccess?.(data);
    },
    onError: options.onError,
  });
  
  return { create, update, remove, makeDefault };
}

// Note: useAllBranches is exported from use-all-branches.ts which provides
// properly typed Branch[] data. Do not re-export here.

export function useDefaultBranch() {
  const { data, ...rest } = useBranches({ isDefault: true });
  return {
    ...rest,
    data: data?.data?.[0] ?? null,
  };
}
