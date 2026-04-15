import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchOrderedProducts } from '../api/ordered-products-api'
import type { OrderedProductsParams } from '../types'

export const orderedProductKeys = {
  all: ['ordered-products'] as const,
  lists: () => [...orderedProductKeys.all, 'list'] as const,
  list: (params: OrderedProductsParams) => [...orderedProductKeys.lists(), params] as const,
}

export function useOrderedProducts(params: OrderedProductsParams = {}) {
  return useQuery({
    queryKey: orderedProductKeys.list(params),
    queryFn: () => fetchOrderedProducts(params),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}
