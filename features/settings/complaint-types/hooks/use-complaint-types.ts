/**
 * useComplaintTypes - React Query hooks
 * 
 * ⚠️ Direct import: import { useComplaintTypes } from '@/features/settings/complaint-types/hooks/use-complaint-types'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchComplaintTypes,
  fetchComplaintType,
  createComplaintType,
  updateComplaintType,
  deleteComplaintType,
  type ComplaintTypesParams,
  type ComplaintTypeSetting,
} from '../api/complaint-types-api';

export const complaintTypeKeys = {
  all: ['complaint-types'] as const,
  lists: () => [...complaintTypeKeys.all, 'list'] as const,
  list: (params: ComplaintTypesParams) => [...complaintTypeKeys.lists(), params] as const,
  details: () => [...complaintTypeKeys.all, 'detail'] as const,
  detail: (id: string) => [...complaintTypeKeys.details(), id] as const,
};

export function useComplaintTypes(params: ComplaintTypesParams = {}) {
  return useQuery({
    queryKey: complaintTypeKeys.list(params),
    queryFn: () => fetchComplaintTypes(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useComplaintType(id: string | null | undefined) {
  return useQuery({
    queryKey: complaintTypeKeys.detail(id!),
    queryFn: () => fetchComplaintType(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

interface UseComplaintTypeMutationsOptions {
  onCreateSuccess?: (complaintType: ComplaintTypeSetting) => void;
  onUpdateSuccess?: (complaintType: ComplaintTypeSetting) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useComplaintTypeMutations(options: UseComplaintTypeMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createComplaintType,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: complaintTypeKeys.all });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<ComplaintTypeSetting> }) => 
      updateComplaintType(systemId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: complaintTypeKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: complaintTypeKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteComplaintType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complaintTypeKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export type { ComplaintTypeSetting };
