/**
 * useRoles - React Query hooks
 * 
 * ⚠️ Direct import: import { useRoles } from '@/features/settings/roles/hooks/use-roles'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import {
  fetchRoles,
  fetchRole,
  createRole,
  updateRole,
  deleteRole,
  type RolesParams,
  type RoleSetting,
} from '../api/roles-api';

export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (params: RolesParams) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
};

export function useRoles(params: RolesParams = {}) {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => fetchRoles(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useRole(id: string | null | undefined) {
  return useQuery({
    queryKey: roleKeys.detail(id!),
    queryFn: () => fetchRole(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

interface UseRoleMutationsOptions {
  onCreateSuccess?: (role: RoleSetting) => void;
  onUpdateSuccess?: (role: RoleSetting) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useRoleMutations(options: UseRoleMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createRole,
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'roles');
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<RoleSetting> }) => 
      updateRole(systemId, data),
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'roles');
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      invalidateRelated(queryClient, 'roles');
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export type { RoleSetting };
