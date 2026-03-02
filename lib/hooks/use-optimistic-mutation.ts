/**
 * Optimistic Updates Hooks
 * 
 * React Query mutations with optimistic UI updates
 * Update UI immediately, sync with server in background
 */

import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { toast } from 'sonner';

// Cache data structure type
type CacheData<T = unknown> = {
  data?: T[];
  pagination?: { total: number };
};

// Context type for optimistic mutations
type OptimisticContext = { previousData?: CacheData };

type OptimisticUpdateConfig<TData, TVariables> = {
  /** Query key to update */
  queryKey: QueryKey;
  /** Mutation function (Server Action) */
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** Update cache optimistically before server responds */
  updateCache: (old: CacheData, variables: TVariables) => CacheData;
  /** Success message */
  successMessage?: string | ((data: TData, variables: TVariables) => string);
  /** Error message */
  errorMessage?: string | ((error: Error, variables: TVariables) => string);
  /** Callback on success */
  onSuccess?: (data: TData, variables: TVariables, context: OptimisticContext | undefined) => void;
  /** Callback on error */
  onError?: (error: Error, variables: TVariables, context: OptimisticContext | undefined) => void;
  /** Show loading toast */
  showLoadingToast?: boolean;
  /** Loading message */
  loadingMessage?: string;
};

/**
 * Create an optimistic mutation hook
 * 
 * @example
 * const updateStatus = useOptimisticMutation({
 *   queryKey: ['orders'],
 *   mutationFn: updateOrderStatus,
 *   updateCache: (old, { id, status }) => ({
 *     ...old,
 *     data: old.data.map(item => 
 *       item.id === id ? { ...item, status } : item
 *     ),
 *   }),
 *   successMessage: 'Cập nhật thành công!',
 * });
 */
export function useOptimisticMutation<TData, TVariables>({
  queryKey,
  mutationFn,
  updateCache,
  successMessage = 'Thành công!',
  errorMessage = 'Có lỗi xảy ra',
  onSuccess,
  onError,
  showLoadingToast = true,
  loadingMessage = 'Đang xử lý...',
}: OptimisticUpdateConfig<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    
    // Optimistic update
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(queryKey) as CacheData;

      // Optimistically update cache
      queryClient.setQueryData(queryKey, (old: CacheData) => {
        if (!old) return old;
        return updateCache(old, variables);
      });

      // Show loading toast
      if (showLoadingToast) {
        toast.loading(loadingMessage, { id: 'mutation-loading' });
      }

      // Return context with snapshot
      return { previousData } satisfies OptimisticContext;
    },

    // Rollback on error
    onError: (error, variables, context) => {
      const ctx = context as OptimisticContext | undefined;
      // Restore previous data
      if (ctx?.previousData) {
        queryClient.setQueryData(queryKey, ctx.previousData);
      }

      // Dismiss loading toast
      toast.dismiss('mutation-loading');

      // Show error
      const message = typeof errorMessage === 'function'
        ? errorMessage(error as Error, variables)
        : errorMessage;
      toast.error(message);

      // Custom error handler
      onError?.(error as Error, variables, ctx);
    },

    // Success
    onSuccess: (data, variables, context) => {
      const ctx = context as OptimisticContext | undefined;
      // Dismiss loading toast
      toast.dismiss('mutation-loading');

      // Show success
      const message = typeof successMessage === 'function'
        ? successMessage(data, variables)
        : successMessage;
      toast.success(message);

      // Custom success handler
      onSuccess?.(data, variables, ctx);
    },

    // Always refetch to ensure sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

/**
 * Hook for optimistic delete
 * 
 * @example
 * const deleteOrder = useOptimisticDelete({
 *   queryKey: ['orders'],
 *   mutationFn: deleteOrderAction,
 *   getItemId: (item) => item.systemId,
 * });
 * 
 * deleteOrder.mutate({ systemId: 'ABC123' });
 */
// Item with systemId for optimistic updates
type ItemWithSystemId = { systemId: string; [key: string]: unknown };

export function useOptimisticDelete<TData, TVariables extends { systemId: string }>({
  queryKey,
  mutationFn,
  getItemId = (item: ItemWithSystemId) => item.systemId,
  successMessage = 'Đã xóa!',
  errorMessage = 'Xóa thất bại',
  onSuccess,
  onError,
}: {
  queryKey: QueryKey;
  mutationFn: (variables: TVariables) => Promise<TData>;
  getItemId?: (item: ItemWithSystemId) => string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}) {
  return useOptimisticMutation<TData, TVariables>({
    queryKey,
    mutationFn,
    updateCache: (old, variables) => {
      if (!old?.data) return old;
      
      return {
        ...old,
        data: old.data.filter((item) => getItemId(item as ItemWithSystemId) !== variables.systemId),
        pagination: old.pagination ? {
          ...old.pagination,
          total: old.pagination.total - 1,
        } : undefined,
      };
    },
    successMessage,
    errorMessage,
    onSuccess: (data) => onSuccess?.(data),
    onError: (error) => onError?.(error),
  });
}

/**
 * Hook for optimistic status update
 * 
 * @example
 * const updateStatus = useOptimisticStatusUpdate({
 *   queryKey: ['orders'],
 *   mutationFn: updateOrderStatus,
 *   statusField: 'status',
 * });
 * 
 * updateStatus.mutate({ systemId: 'ABC', status: 'COMPLETED' });
 */
export function useOptimisticStatusUpdate<
  TData,
  TVariables extends { systemId: string; status: string }
>({
  queryKey,
  mutationFn,
  statusField = 'status',
  getItemId = (item: ItemWithSystemId) => item.systemId,
  successMessage = 'Cập nhật thành công!',
  errorMessage = 'Cập nhật thất bại',
  onSuccess,
  onError,
}: {
  queryKey: QueryKey;
  mutationFn: (variables: TVariables) => Promise<TData>;
  statusField?: string;
  getItemId?: (item: ItemWithSystemId) => string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}) {
  return useOptimisticMutation<TData, TVariables>({
    queryKey,
    mutationFn,
    updateCache: (old, variables) => {
      if (!old || !old.data) return old;
      const current = old;
      return {
        ...current,
        data: current.data!.map((item) =>
          getItemId(item as ItemWithSystemId) === variables.systemId
            ? { ...(item as Record<string, unknown>), [statusField]: variables.status }
            : item
        ),
      };
    },
    successMessage,
    errorMessage,
    onSuccess: (data) => onSuccess?.(data),
    onError: (error) => onError?.(error),
  });
}

/**
 * Hook for optimistic toggle
 * 
 * @example
 * const toggleActive = useOptimisticToggle({
 *   queryKey: ['products'],
 *   mutationFn: toggleProductActive,
 *   toggleField: 'isActive',
 * });
 */
export function useOptimisticToggle<
  TData,
  TVariables extends { systemId: string }
>({
  queryKey,
  mutationFn,
  toggleField,
  getItemId = (item: ItemWithSystemId) => item.systemId,
  successMessage = 'Cập nhật thành công!',
  errorMessage = 'Cập nhật thất bại',
  onSuccess,
}: {
  queryKey: QueryKey;
  mutationFn: (variables: TVariables) => Promise<TData>;
  toggleField: string;
  getItemId?: (item: ItemWithSystemId) => string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: TData) => void;
}) {
  return useOptimisticMutation<TData, TVariables>({
    queryKey,
    mutationFn,
    updateCache: (old, variables) => {
      if (!old || !old.data) return old;
      const current = old;
      return {
        ...current,
        data: current.data!.map((item) => {
          const typedItem = item as ItemWithSystemId;
          return getItemId(typedItem) === variables.systemId
            ? { ...(item as Record<string, unknown>), [toggleField]: !typedItem[toggleField] }
            : item;
        }),
      };
    },
    successMessage,
    errorMessage,
    onSuccess: (data) => onSuccess?.(data),
  });
}
