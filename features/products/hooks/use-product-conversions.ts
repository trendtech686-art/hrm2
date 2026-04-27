'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateRelated } from '@/lib/query-invalidation-map'
import {
  fetchProductConversions,
  createProductConversion,
  updateProductConversion,
  deleteProductConversion,
} from '../api/product-conversions-api'

export const conversionKeys = {
  all: ['product-conversions'] as const,
  byProduct: (baseProductId: string) => [...conversionKeys.all, baseProductId] as const,
}

export function useProductConversions(baseProductId: string) {
  return useQuery({
    queryKey: conversionKeys.byProduct(baseProductId),
    queryFn: () => fetchProductConversions(baseProductId),
    enabled: !!baseProductId,
  })
}

export function useCreateConversion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createProductConversion,
    onSuccess: (_data, _variables) => {
      invalidateRelated(qc, 'product-conversions')
    },
  })
}

export function useUpdateConversion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Parameters<typeof updateProductConversion>[1] }) =>
      updateProductConversion(systemId, data),
    onSuccess: () => {
      invalidateRelated(qc, 'product-conversions')
    },
  })
}

export function useDeleteConversion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteProductConversion,
    onSuccess: () => {
      invalidateRelated(qc, 'product-conversions')
    },
  })
}
