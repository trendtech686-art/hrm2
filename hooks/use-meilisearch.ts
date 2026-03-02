import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@/hooks/use-server-filters'

// ===========================================
// Types
// ===========================================

interface SearchMeta {
  total: number
  limit: number
  offset: number
  query: string
  searchTimeMs: number
  processingTimeMs: number
}

// Export types for use in components
export interface ProductSearchResult {
  systemId: string
  id: string
  name: string
  barcode: string | null
  brandId: string | null
  brandName: string | null
  categoryId: string | null
  categoryName: string | null
  costPrice: number
  price: number // Default selling price
  prices: Record<string, number> // All prices by pricingPolicyId
  unit: string // Unit of measure
  status: string
  thumbnailImage: string | null
  pkgxId: number | null
  totalStock: number // Total stock across all branches
  branchStocks: { branchId: string; branchName: string; onHand: number }[] // Stock per branch
  _highlight?: {
    name?: string
    productId?: string
  }
}

export interface CustomerSearchResult {
  systemId: string
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  district: string | null
  totalOrders: number
  totalSpent: number
  _highlight?: {
    name?: string
    phone?: string
    email?: string
  }
}

interface OrderSearchResult {
  systemId: string
  id: string
  customerName: string | null
  customerPhone: string | null
  status: string
  totalAmount: number
  branchId: string | null
  branchName: string | null
  createdAt: string | null
  _highlight?: {
    orderId?: string
    customerName?: string
    customerPhone?: string
  }
}

// ===========================================
// Search Hooks
// ===========================================

interface UseSearchOptions {
  query: string
  limit?: number
  offset?: number
  debounceMs?: number
  enabled?: boolean
}

/**
 * Universal Meilisearch product search hook
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useMeiliProductSearch({
 *   query: searchTerm,
 *   filters: { brandId: 'xxx' }
 * })
 * ```
 */
export function useMeiliProductSearch({
  query,
  limit = 20,
  offset = 0,
  debounceMs = 200,
  enabled = true,
  filters = {},
}: UseSearchOptions & {
  filters?: {
    brandId?: string
    categoryId?: string
    status?: string
  }
}) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  
  return useQuery({
    queryKey: ['meili-products', debouncedQuery, limit, offset, filters],
    queryFn: async (): Promise<{ data: ProductSearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(limit),
        offset: String(offset),
      })
      
      if (filters.brandId) params.set('brandId', filters.brandId)
      if (filters.categoryId) params.set('categoryId', filters.categoryId)
      if (filters.status) params.set('status', filters.status)
      
      const response = await fetch(`/api/search/products?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    enabled: enabled, // ✅ Always enabled - show default results when empty
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}

/**
 * Customer search with Meilisearch
 */
export function useMeiliCustomerSearch({
  query,
  limit = 20,
  offset = 0,
  debounceMs = 200,
  enabled = true,
  filters = {},
}: UseSearchOptions & {
  filters?: {
    city?: string
    district?: string
  }
}) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  
  return useQuery({
    queryKey: ['meili-customers', debouncedQuery, limit, offset, filters],
    queryFn: async (): Promise<{ data: CustomerSearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(limit),
        offset: String(offset),
      })
      
      if (filters.city) params.set('city', filters.city)
      if (filters.district) params.set('district', filters.district)
      
      const response = await fetch(`/api/search/customers?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    enabled: enabled, // ✅ Always enabled - show default results when empty
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}

/**
 * Order search with Meilisearch
 */
export function useMeiliOrderSearch({
  query,
  limit = 20,
  offset = 0,
  debounceMs = 200,
  enabled = true,
  filters = {},
}: UseSearchOptions & {
  filters?: {
    status?: string
    branchId?: string
    fromDate?: string
    toDate?: string
  }
}) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  
  return useQuery({
    queryKey: ['meili-orders', debouncedQuery, limit, offset, filters],
    queryFn: async (): Promise<{ data: OrderSearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(limit),
        offset: String(offset),
      })
      
      if (filters.status) params.set('status', filters.status)
      if (filters.branchId) params.set('branchId', filters.branchId)
      if (filters.fromDate) params.set('fromDate', filters.fromDate)
      if (filters.toDate) params.set('toDate', filters.toDate)
      
      const response = await fetch(`/api/search/orders?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    enabled: enabled && debouncedQuery.length > 0,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}

// ===========================================
// Infinite Query Hooks for Scroll Loading
// ===========================================

const PAGE_SIZE = 30

/**
 * Infinite scroll product search - loads more on scroll
 */
export function useInfiniteMeiliProductSearch({
  query,
  debounceMs = 200,
  enabled = true,
  filters = {},
}: Omit<UseSearchOptions, 'limit' | 'offset'> & {
  filters?: {
    brandId?: string
    categoryId?: string
    status?: string
  }
}) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  
  return useInfiniteQuery({
    queryKey: ['meili-products-infinite', debouncedQuery, filters],
    queryFn: async ({ pageParam = 0 }): Promise<{ data: ProductSearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(PAGE_SIZE),
        offset: String(pageParam),
      })
      
      if (filters.brandId) params.set('brandId', filters.brandId)
      if (filters.categoryId) params.set('categoryId', filters.categoryId)
      if (filters.status) params.set('status', filters.status)
      
      const response = await fetch(`/api/search/products?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.data.length, 0)
      if (totalLoaded >= lastPage.meta.total) return undefined
      return totalLoaded // offset for next page
    },
    enabled,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

/**
 * Infinite scroll customer search - loads more on scroll
 */
export function useInfiniteMeiliCustomerSearch({
  query,
  debounceMs = 200,
  enabled = true,
  filters = {},
}: Omit<UseSearchOptions, 'limit' | 'offset'> & {
  filters?: {
    city?: string
    district?: string
  }
}) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  
  return useInfiniteQuery({
    queryKey: ['meili-customers-infinite', debouncedQuery, filters],
    queryFn: async ({ pageParam = 0 }): Promise<{ data: CustomerSearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(PAGE_SIZE),
        offset: String(pageParam),
      })
      
      if (filters.city) params.set('city', filters.city)
      if (filters.district) params.set('district', filters.district)
      
      const response = await fetch(`/api/search/customers?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.data.length, 0)
      if (totalLoaded >= lastPage.meta.total) return undefined
      return totalLoaded // offset for next page
    },
    enabled,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

// ===========================================
// Simple Autocomplete Hooks
// ===========================================

/**
 * Simple product autocomplete for dropdowns/combobox
 */
export function useProductAutocomplete(query: string, limit = 10) {
  const { data, ...rest } = useMeiliProductSearch({
    query,
    limit,
    debounceMs: 150,
  })
  
  return {
    products: data?.data || [],
    searchTime: data?.meta.searchTimeMs,
    ...rest,
  }
}

/**
 * Simple customer autocomplete for dropdowns/combobox
 */
export function useCustomerAutocomplete(query: string, limit = 10) {
  const { data, ...rest } = useMeiliCustomerSearch({
    query,
    limit,
    debounceMs: 150,
  })
  
  return {
    customers: data?.data || [],
    searchTime: data?.meta.searchTimeMs,
    ...rest,
  }
}

/**
 * Simple order autocomplete for dropdowns/combobox
 */
export function useOrderAutocomplete(query: string, limit = 10) {
  const { data, ...rest } = useMeiliOrderSearch({
    query,
    limit,
    debounceMs: 150,
  })
  
  return {
    orders: data?.data || [],
    searchTime: data?.meta.searchTimeMs,
    ...rest,
  }
}
