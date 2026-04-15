import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  type PromotionItem,
} from '../api/fetch-promotions'
import { invalidateRelated } from '@/lib/query-invalidation-map'

export const promotionKeys = {
  all: ['promotions'] as const,
  lists: () => [...promotionKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...promotionKeys.lists(), params] as const,
  active: () => [...promotionKeys.all, 'active'] as const,
}

export function usePromotions(params?: { search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: promotionKeys.list(params),
    queryFn: () => fetchPromotions(params),
  })
}

export function useActivePromotions() {
  return useQuery({
    queryKey: promotionKeys.active(),
    queryFn: () => fetchPromotions({ activeOnly: true, limit: 50 }),
    staleTime: 30_000,
  })
}

export function useCreatePromotion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createPromotion,
    onSuccess: () => invalidateRelated(qc, 'promotions'),
  })
}

export function useUpdatePromotion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<PromotionItem> }) =>
      updatePromotion(systemId, data),
    onSuccess: () => invalidateRelated(qc, 'promotions'),
  })
}

export function useDeletePromotion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deletePromotion,
    onSuccess: () => invalidateRelated(qc, 'promotions'),
  })
}
