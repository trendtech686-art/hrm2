/**
 * Customer Store Adapter
 * Bridges React Query with existing zustand store interface
 */

import { useCallback, useMemo } from 'react'
import { 
  useCustomers, 
  useCreateCustomer, 
  useUpdateCustomer, 
  useDeleteCustomer 
} from '@/hooks/api/use-customers'
import type { Customer } from '@/lib/types/prisma-extended'
import type { SystemId } from '@/lib/id-types'

export function useCustomerStoreV2() {
  const { data: customers = [], isLoading, error, refetch } = useCustomers({ includeDeleted: true })
  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()
  const deleteMutation = useDeleteCustomer()

  const add = useCallback(async (item: Omit<Customer, 'systemId'>) => {
    return await createMutation.mutateAsync(item)
  }, [createMutation])

  const update = useCallback(async (systemId: SystemId | string, updates: Partial<Customer>) => {
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
    return customers.find(c => c.systemId === systemId)
  }, [customers])

  const getActive = useCallback(() => customers.filter(c => !c.isDeleted), [customers])
  const getDeleted = useCallback(() => customers.filter(c => c.isDeleted), [customers])

  return useMemo(() => ({
    data: customers,
    isLoading,
    error,
    add,
    update,
    remove,
    hardDelete,
    findById,
    getActive,
    getDeleted,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch,
  }), [
    customers, isLoading, error,
    add, update, remove, hardDelete, findById, getActive, getDeleted,
    createMutation.isPending, updateMutation.isPending, deleteMutation.isPending,
    refetch
  ])
}

export { useCustomerStore } from '@/features/customers/store'
