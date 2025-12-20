/**
 * Order Store Adapter
 * Bridges React Query with existing zustand store interface
 */

import { useCallback, useMemo } from 'react'
import { 
  useOrders, 
  useCreateOrder, 
  useUpdateOrder, 
  useDeleteOrder 
} from '@/hooks/api/use-orders'
import type { Order } from '@/features/orders/types'
import type { SystemId } from '@/lib/id-types'

export function useOrderStoreV2() {
  const { data: orders = [], isLoading, error, refetch } = useOrders({ includeDeleted: true })
  const createMutation = useCreateOrder()
  const updateMutation = useUpdateOrder()
  const deleteMutation = useDeleteOrder()

  const add = useCallback(async (item: Omit<Order, 'systemId'>) => {
    return await createMutation.mutateAsync(item)
  }, [createMutation])

  const update = useCallback(async (systemId: SystemId | string, updates: Partial<Order>) => {
    await updateMutation.mutateAsync({ 
      systemId: String(systemId), 
      data: updates 
    })
  }, [updateMutation])

  const remove = useCallback(async (systemId: SystemId | string) => {
    await deleteMutation.mutateAsync({ systemId: String(systemId), hard: false })
  }, [deleteMutation])

  const hardDelete = useCallback(async (systemId: SystemId | string) => {
    await deleteMutation.mutateAsync({ systemId: String(systemId), hard: true })
  }, [deleteMutation])

  const findById = useCallback((systemId: SystemId | string) => {
    return orders.find(o => o.systemId === systemId)
  }, [orders])

  const getActive = useCallback(() => orders.filter(o => !o.isDeleted), [orders])
  const getDeleted = useCallback(() => orders.filter(o => o.isDeleted), [orders])

  // Order-specific helpers
  const getByStatus = useCallback((status: string) => 
    orders.filter(o => o.status === status && !o.isDeleted), [orders])
  
  const getByCustomer = useCallback((customerId: string) => 
    orders.filter(o => o.customerId === customerId && !o.isDeleted), [orders])

  return useMemo(() => ({
    data: orders,
    isLoading,
    error,
    add,
    update,
    remove,
    hardDelete,
    findById,
    getActive,
    getDeleted,
    getByStatus,
    getByCustomer,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch,
  }), [
    orders, isLoading, error,
    add, update, remove, hardDelete, findById, getActive, getDeleted,
    getByStatus, getByCustomer,
    createMutation.isPending, updateMutation.isPending, deleteMutation.isPending,
    refetch
  ])
}

export { useOrderStore } from '@/features/orders/store'
