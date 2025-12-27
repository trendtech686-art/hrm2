/**
 * useOrderMutations - React Query mutations for orders
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * Import this file directly: import { useOrderMutations } from '@/features/orders/hooks/use-order-mutations'
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder, updateOrder, deleteOrder, type CreateOrderInput, type UpdateOrderInput } from '../api/orders-api';
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
    onSuccess: () => {
      // Invalidate all order queries
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
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
