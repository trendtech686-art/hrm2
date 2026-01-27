/**
 * Custom Fields React Query Hooks
 * Provides data fetching and mutations for custom field definitions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/custom-fields-api';
import type { CustomFieldDefinition } from '../custom-fields-types';

// Query keys factory
export const customFieldKeys = {
  all: ['custom-fields'] as const,
  lists: () => [...customFieldKeys.all, 'list'] as const,
  details: () => [...customFieldKeys.all, 'detail'] as const,
  detail: (id: string) => [...customFieldKeys.details(), id] as const,
};

/**
 * Hook to fetch all custom fields
 */
export function useCustomFields() {
  return useQuery({
    queryKey: customFieldKeys.lists(),
    queryFn: api.fetchCustomFields,
    staleTime: 1000 * 60 * 5, // 5 minutes - fields don't change often
  });
}

/**
 * Hook to fetch single custom field
 */
export function useCustomFieldById(systemId: string | undefined) {
  return useQuery({
    queryKey: customFieldKeys.detail(systemId!),
    queryFn: () => api.fetchCustomFieldById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 5,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing custom field mutations
 */
export function useCustomFieldMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateFields = () => {
    queryClient.invalidateQueries({ queryKey: customFieldKeys.all });
  };

  const create = useMutation({
    mutationFn: api.createCustomField,
    onSuccess: () => {
      invalidateFields();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<CustomFieldDefinition> }) =>
      api.updateCustomField(systemId, data),
    onSuccess: () => {
      invalidateFields();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: api.deleteCustomField,
    onSuccess: () => {
      invalidateFields();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const reorder = useMutation({
    mutationFn: api.reorderCustomFields,
    onSuccess: () => {
      invalidateFields();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    create,
    update,
    remove,
    reorder,
  };
}
