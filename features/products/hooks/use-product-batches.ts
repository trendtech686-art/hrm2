'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateRelated } from '@/lib/query-invalidation-map'
import {
  fetchProductBatches,
  createProductBatch,
  updateProductBatch,
  deleteProductBatch,
} from '../api/product-batches-api'

export const batchKeys = {
  all: ['product-batches'] as const,
  list: (params: Record<string, unknown>) => [...batchKeys.all, 'list', params] as const,
  nearExpiry: (days: number) => [...batchKeys.all, 'near-expiry', days] as const,
}

export function useProductBatches(params: {
  productId?: string
  branchId?: string
  status?: string
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: batchKeys.list(params),
    queryFn: () => fetchProductBatches(params),
    enabled: !!params.productId || !!params.branchId,
  })
}

export function useNearExpiryBatches(days: number = 30, branchId?: string) {
  return useQuery({
    queryKey: batchKeys.nearExpiry(days),
    queryFn: () => fetchProductBatches({ nearExpiry: days, branchId, limit: 100 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateBatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createProductBatch,
    onSuccess: () => {
      invalidateRelated(qc, 'product-batches')
    },
  })
}

export function useUpdateBatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Parameters<typeof updateProductBatch>[1] }) =>
      updateProductBatch(systemId, data),
    onSuccess: () => {
      invalidateRelated(qc, 'product-batches')
    },
  })
}

export function useDeleteBatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteProductBatch,
    onSuccess: () => {
      invalidateRelated(qc, 'product-batches')
    },
  })
}
