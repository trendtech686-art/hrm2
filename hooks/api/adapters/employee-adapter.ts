/**
 * Employee Store Adapter
 * Bridges React Query with existing zustand store interface
 * 
 * This adapter allows gradual migration:
 * 1. Pages can continue using the same interface (useEmployeeStore)
 * 2. Data comes from API via React Query
 * 3. Old zustand store functions are mapped to mutations
 * 
 * Usage in pages:
 * - import { useEmployeeStoreV2 } from '@/hooks/api/adapters/employee-adapter'
 * - Replace: useEmployeeStore() → useEmployeeStoreV2()
 */

import { useCallback, useMemo } from 'react'
import { 
  useEmployees, 
  useCreateEmployee, 
  useUpdateEmployee, 
  useDeleteEmployee,
  useRestoreEmployee 
} from '@/hooks/api/use-employees'
import type { Employee } from '@/lib/types/prisma-extended'
import type { SystemId } from '@/lib/id-types'

/**
 * Adapter hook that provides zustand-like interface backed by React Query
 */
export function useEmployeeStoreV2() {
  // React Query hooks
  const { data: response, isLoading, error, refetch } = useEmployees({ includeDeleted: true })
  const employees = response?.data ?? []
  const createMutation = useCreateEmployee()
  const updateMutation = useUpdateEmployee()
  const deleteMutation = useDeleteEmployee()
  const restoreMutation = useRestoreEmployee()

  // Zustand-like methods
  const add = useCallback(async (item: Omit<Employee, 'systemId'>) => {
    const result = await createMutation.mutateAsync(item)
    return result
  }, [createMutation])

  const addMultiple = useCallback(async (items: Omit<Employee, 'systemId'>[]) => {
    for (const item of items) {
      await createMutation.mutateAsync(item)
    }
    refetch()
  }, [createMutation, refetch])

  const update = useCallback(async (systemId: SystemId | string, updates: Partial<Employee>) => {
    await updateMutation.mutateAsync({ 
      systemId: typeof systemId === 'string' ? systemId : systemId, 
      data: updates 
    })
  }, [updateMutation])

  const remove = useCallback(async (systemId: SystemId | string) => {
    await deleteMutation.mutateAsync({ 
      systemId: typeof systemId === 'string' ? systemId : systemId,
      hard: false 
    })
  }, [deleteMutation])

  const hardDelete = useCallback(async (systemId: SystemId | string) => {
    await deleteMutation.mutateAsync({ 
      systemId: typeof systemId === 'string' ? systemId : systemId,
      hard: true 
    })
  }, [deleteMutation])

  const restore = useCallback(async (systemId: SystemId | string) => {
    await restoreMutation.mutateAsync(typeof systemId === 'string' ? systemId : systemId)
  }, [restoreMutation])

  const findById = useCallback((systemId: SystemId | string) => {
    return employees.find(e => e.systemId === systemId)
  }, [employees])

  const getActive = useCallback(() => {
    return employees.filter(e => !e.isDeleted)
  }, [employees])

  const getDeleted = useCallback(() => {
    return employees.filter(e => e.isDeleted)
  }, [employees])

  // Return zustand-compatible interface
  return useMemo(() => ({
    // Data
    data: employees,
    
    // Loading states  
    isLoading,
    error,
    
    // Actions (sync-looking but async behind)
    add,
    addMultiple,
    update,
    remove,
    hardDelete,
    restore,
    findById,
    getActive,
    getDeleted,
    
    // Mutation states for UI feedback
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Manual refetch
    refetch,
  }), [
    employees, isLoading, error,
    add, addMultiple, update, remove, hardDelete, restore, findById, getActive, getDeleted,
    createMutation.isPending, updateMutation.isPending, deleteMutation.isPending,
    refetch
  ])
}

/**
 * Re-export original store for backwards compatibility
 * Use this when you explicitly need localStorage (offline mode)
 */
export { useEmployeeStore } from '@/features/employees/store'
