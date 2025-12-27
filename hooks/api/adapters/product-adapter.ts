/**
 * Product Store Adapter
 * Bridges React Query with existing zustand store interface
 */

import { useCallback, useMemo } from 'react'
import { 
  useProducts, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct 
} from '@/hooks/api/use-products'
import type { Product } from '@/lib/types/prisma-extended'
import type { SystemId } from '@/lib/id-types'

export function useProductStoreV2() {
  const { data: products = [], isLoading, error, refetch } = useProducts({ includeDeleted: true })
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  const add = useCallback(async (item: Omit<Product, 'systemId'>) => {
    return await createMutation.mutateAsync(item)
  }, [createMutation])

  const update = useCallback(async (systemId: SystemId | string, updates: Partial<Product>) => {
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
    return products.find(p => p.systemId === systemId)
  }, [products])

  const getActive = useCallback(() => products.filter(p => !p.isDeleted), [products])
  const getDeleted = useCallback(() => products.filter(p => p.isDeleted), [products])

  return useMemo(() => ({
    data: products,
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
    products, isLoading, error,
    add, update, remove, hardDelete, findById, getActive, getDeleted,
    createMutation.isPending, updateMutation.isPending, deleteMutation.isPending,
    refetch
  ])
}

export { useProductStore } from '@/features/products/store'
