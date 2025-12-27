/**
 * Paginated Data Hooks
 * 
 * Dùng React Query để fetch data với pagination thay vì load tất cả vào Zustand.
 * Pattern này scale được với hàng triệu records.
 * 
 * Usage:
 * ```tsx
 * const { data, isLoading, pagination } = useOrders({ 
 *   page: 1, 
 *   limit: 50, 
 *   search: 'keyword' 
 * })
 * ```
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query'

// ============== TYPES ==============

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

export interface FilterParams extends PaginationParams {
  [key: string]: string | number | boolean | undefined
}

// ============== GENERIC FETCH HELPER ==============

async function fetchPaginated<T>(
  endpoint: string,
  params: FilterParams = {}
): Promise<PaginatedResponse<T>> {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  })
  
  // Default pagination
  if (!params.page) searchParams.set('page', '1')
  if (!params.limit) searchParams.set('limit', '50')
  
  const response = await fetch(`${endpoint}?${searchParams.toString()}`, {
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.status}`)
  }
  
  const json = await response.json()
  
  // Handle different API response formats
  if (json.pagination) {
    return json as PaginatedResponse<T>
  }
  
  // Fallback for APIs that return array directly
  const data = json.data ?? json ?? []
  return {
    data,
    pagination: {
      page: params.page ?? 1,
      limit: params.limit ?? 50,
      total: json.total ?? data.length,
      totalPages: json.totalPages ?? Math.ceil((json.total ?? data.length) / (params.limit ?? 50)),
      hasMore: json.hasMore ?? false,
    },
  }
}

// ============== ORDERS HOOK ==============

export interface OrderFilters extends FilterParams {
  status?: string
  customerId?: string
  branchId?: string
  startDate?: string
  endDate?: string
}

export function useOrders(filters: OrderFilters = {}, options?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => fetchPaginated('/api/orders', filters),
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  })
}

// ============== CUSTOMERS HOOK ==============

export interface CustomerFilters extends FilterParams {
  type?: string
  status?: string
  targetGroup?: string
}

export function useCustomers(filters: CustomerFilters = {}, options?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => fetchPaginated('/api/customers', filters),
    staleTime: 60 * 1000, // 1 minute
    ...options,
  })
}

// ============== PRODUCTS HOOK ==============

export interface ProductFilters extends FilterParams {
  categoryId?: string
  brandId?: string
  status?: string
  inStock?: boolean
}

export function useProducts(filters: ProductFilters = {}, options?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchPaginated('/api/products', filters),
    staleTime: 60 * 1000,
    ...options,
  })
}

// ============== EMPLOYEES HOOK ==============

export interface EmployeeFilters extends FilterParams {
  departmentId?: string
  branchId?: string
  status?: string
}

export function useEmployeesQuery(filters: EmployeeFilters = {}, options?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => fetchPaginated('/api/employees', filters),
    staleTime: 60 * 1000,
    ...options,
  })
}

// ============== SUPPLIERS HOOK ==============

export function useSuppliers(filters: FilterParams = {}, options?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: ['suppliers', filters],
    queryFn: () => fetchPaginated('/api/suppliers', filters),
    staleTime: 60 * 1000,
    ...options,
  })
}

// ============== SINGLE ITEM HOOKS ==============

export function useOrder(systemId: string | undefined) {
  return useQuery({
    queryKey: ['order', systemId],
    queryFn: async () => {
      if (!systemId) return null
      const response = await fetch(`/api/orders/${systemId}`)
      if (!response.ok) throw new Error('Order not found')
      return response.json()
    },
    enabled: !!systemId,
    staleTime: 30 * 1000,
  })
}

export function useCustomer(systemId: string | undefined) {
  return useQuery({
    queryKey: ['customer', systemId],
    queryFn: async () => {
      if (!systemId) return null
      const response = await fetch(`/api/customers/${systemId}`)
      if (!response.ok) throw new Error('Customer not found')
      return response.json()
    },
    enabled: !!systemId,
    staleTime: 60 * 1000,
  })
}

export function useProduct(systemId: string | undefined) {
  return useQuery({
    queryKey: ['product', systemId],
    queryFn: async () => {
      if (!systemId) return null
      const response = await fetch(`/api/products/${systemId}`)
      if (!response.ok) throw new Error('Product not found')
      return response.json()
    },
    enabled: !!systemId,
    staleTime: 60 * 1000,
  })
}

// ============== SEARCH/AUTOCOMPLETE HOOKS ==============

export function useCustomerSearch(query: string, limit = 10) {
  return useQuery({
    queryKey: ['customers', 'search', query],
    queryFn: () => fetchPaginated('/api/customers', { search: query, limit }),
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  })
}

export function useProductSearch(query: string, limit = 10) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => fetchPaginated('/api/products', { search: query, limit }),
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  })
}

// ============== MUTATION HELPERS ==============

export function useCreateOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create order')
      return response.json()
    },
    onSuccess: () => {
      // Invalidate orders list to refetch
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useUpdateOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: any }) => {
      const response = await fetch(`/api/orders/${systemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update order')
      return response.json()
    },
    onSuccess: (_, { systemId }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', systemId] })
    },
  })
}
