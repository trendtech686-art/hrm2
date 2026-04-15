'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateRelated } from '@/lib/query-invalidation-map'
import {
  fetchProductSerials,
  createProductSerial,
  bulkCreateSerials,
  updateProductSerial,
  deleteProductSerial,
} from '../api/product-serials-api'

export const serialKeys = {
  all: ['product-serials'] as const,
  list: (params: Record<string, unknown>) => [...serialKeys.all, 'list', params] as const,
  byOrder: (orderId: string) => [...serialKeys.all, 'order', orderId] as const,
}

export function useProductSerials(params: {
  productId?: string
  branchId?: string
  status?: string
  search?: string
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: serialKeys.list(params),
    queryFn: () => fetchProductSerials(params),
    enabled: !!params.productId || !!params.branchId,
  })
}

export function useOrderSerials(orderId: string) {
  return useQuery({
    queryKey: serialKeys.byOrder(orderId),
    queryFn: () => fetchProductSerials({ orderId }),
    enabled: !!orderId,
  })
}

export function useCreateSerial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createProductSerial,
    onSuccess: () => {
      invalidateRelated(qc, 'product-serials')
    },
  })
}

export function useBulkCreateSerials() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: bulkCreateSerials,
    onSuccess: () => {
      invalidateRelated(qc, 'product-serials')
    },
  })
}

export function useUpdateSerial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Parameters<typeof updateProductSerial>[1] }) =>
      updateProductSerial(systemId, data),
    onSuccess: () => {
      invalidateRelated(qc, 'product-serials')
    },
  })
}

export function useDeleteSerial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteProductSerial,
    onSuccess: () => {
      invalidateRelated(qc, 'product-serials')
    },
  })
}
