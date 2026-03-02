/**
 * useOrderMutations - React Query mutations for orders
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * Import this file directly: import { useOrderMutations } from '@/features/orders/hooks/use-order-mutations'
 * 
 * Updated to use Server Actions for critical operations (Phase 2 migration)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder, updateOrder, deleteOrder } from '../api/orders-api';
import { updateOrderStatusAction } from '@/app/actions/orders';
import { OrderStatus } from '@/generated/prisma/client';
import { orderKeys } from './use-orders';

interface UseOrderMutationsOptions {
  onCreateSuccess?: (order: unknown) => void;
  onUpdateSuccess?: (order: unknown) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for order CRUD mutations
 * 
 * @example
 * ```tsx
 * function CreateOrderForm() {
 *   const { create, isCreating } = useOrderMutations({
 *     onCreateSuccess: (order) => {
 *       toast.success('Đơn hàng đã được tạo');
 *       router.push(`/orders/${order.id}`);
 *     },
 *   });
 *   
 *   const handleSubmit = (data: CreateOrderInput) => {
 *     create.mutate(data);
 *   };
 *   
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       // ...
 *       <Button loading={isCreating}>Tạo đơn hàng</Button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useOrderMutations(options: UseOrderMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      // Invalidate orders list to refetch
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      // Also invalidate stats
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: updateOrder,
    onSuccess: (data, variables) => {
      // Invalidate the specific order detail
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      // Invalidate stats in case status changed
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteOrder,
    // Optimistic delete - UI cập nhật ngay lập tức
    onMutate: async (systemId) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.lists() });
      
      const previousLists = queryClient.getQueriesData({ queryKey: orderKeys.lists() });
      
      queryClient.setQueriesData(
        { queryKey: orderKeys.lists() },
        (old: { data?: Array<{ systemId: string }>, pagination?: unknown } | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter(item => item.systemId !== systemId),
          };
        }
      );
      
      return { previousLists };
    },
    onError: (_err, _systemId, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      options.onError?.(_err as Error);
    },
    onSuccess: () => {
      options.onDeleteSuccess?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
  
  return {
    create,
    update,
    remove,
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isDeleting: remove.isPending,
    isMutating: create.isPending || update.isPending || remove.isPending,
  };
}

/**
 * Hook for optimistic order updates
 * 
 * Use this when you want instant UI feedback before server response
 */
export function useOptimisticOrderUpdate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateOrder,
    // Optimistic update
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(newData.id) });
      
      // Snapshot previous value
      const previousOrder = queryClient.getQueryData(orderKeys.detail(newData.id));
      
      // Optimistically update
      queryClient.setQueryData(orderKeys.detail(newData.id), (old: unknown) => ({
        ...(old as object),
        ...newData,
      }));
      
      return { previousOrder };
    },
    // Rollback on error
    onError: (_err, newData, context) => {
      if (context?.previousOrder) {
        queryClient.setQueryData(orderKeys.detail(newData.id), context.previousOrder);
      }
    },
    // Refetch after success or error
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
    },
  });
}

/**
 * Hook for optimistic order status update
 * 
 * Instantly updates UI when changing order status
 * 
 * @example
 * ```tsx
 * const { mutate: updateStatus, isPending } = useOptimisticOrderStatusUpdate({
 *   onSuccess: () => toast.success('Cập nhật trạng thái thành công'),
 *   onError: (err) => toast.error(err.message),
 * });
 * 
 * // Update status with optimistic UI
 * updateStatus({ systemId: 'ORDER000001', status: 'CONFIRMED' });
 * ```
 */
export function useOptimisticOrderStatusUpdate(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ systemId, status }: { systemId: string; status: string }) => {
      // Use Server Action instead of direct API call
      const result = await updateOrderStatusAction({ 
        systemId, 
        status: status as OrderStatus 
      });
      if (!result.success) {
        throw new Error(result.error || 'Cập nhật trạng thái thất bại');
      }
      return result.data;
    },
    // Optimistic update
    onMutate: async ({ systemId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(systemId) });
      await queryClient.cancelQueries({ queryKey: orderKeys.lists() });
      
      // Snapshot previous value
      const previousOrder = queryClient.getQueryData(orderKeys.detail(systemId));
      const previousLists = queryClient.getQueriesData({ queryKey: orderKeys.lists() });
      
      // Optimistically update detail
      queryClient.setQueryData(orderKeys.detail(systemId), (old: unknown) => {
        if (!old) return old;
        return { ...(old as object), status };
      });
      
      // Optimistically update in lists
      queryClient.setQueriesData(
        { queryKey: orderKeys.lists() },
        (old: { data?: Array<{ systemId: string; status?: string }>, pagination?: unknown } | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map(item => 
              item.systemId === systemId ? { ...item, status } : item
            ),
          };
        }
      );
      
      return { previousOrder, previousLists };
    },
    // Rollback on error
    onError: (err, { systemId }, context) => {
      if (context?.previousOrder) {
        queryClient.setQueryData(orderKeys.detail(systemId), context.previousOrder);
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      options?.onError?.(err as Error);
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    // Refetch to sync with server
    onSettled: (_data, _error, { systemId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(systemId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
}

// ========================================
// DUPLICATE ORDER HOOK
// ========================================

interface UseDuplicateOrderOptions {
  onSuccess?: (newOrder: { id: string; systemId: string; duplicatedFrom: string }) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for duplicating (copying) an order
 * 
 * @example
 * ```tsx
 * function OrderActions({ order }) {
 *   const router = useRouter();
 *   const { duplicate, isDuplicating } = useDuplicateOrder({
 *     onSuccess: (newOrder) => {
 *       toast.success(`Đã sao chép thành ${newOrder.id}`);
 *       router.push(`/orders/${newOrder.id}/edit`);
 *     },
 *   });
 *   
 *   return (
 *     <Button 
 *       onClick={() => duplicate(order.systemId)}
 *       loading={isDuplicating}
 *     >
 *       <CopyIcon /> Sao chép
 *     </Button>
 *   );
 * }
 * ```
 */
export function useDuplicateOrder(options: UseDuplicateOrderOptions = {}) {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async ({ 
      systemId, 
      notes, 
      preserveNotes 
    }: { 
      systemId: string; 
      notes?: string; 
      preserveNotes?: boolean;
    }) => {
      const { duplicateOrder } = await import('../api/orders-api');
      return duplicateOrder(systemId, { notes, preserveNotes });
    },
    onSuccess: (data) => {
      // Invalidate order lists to show new order
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });
  
  return {
    duplicate: (systemId: string, opts?: { notes?: string; preserveNotes?: boolean }) => 
      mutation.mutate({ systemId, ...opts }),
    duplicateAsync: (systemId: string, opts?: { notes?: string; preserveNotes?: boolean }) => 
      mutation.mutateAsync({ systemId, ...opts }),
    isDuplicating: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

