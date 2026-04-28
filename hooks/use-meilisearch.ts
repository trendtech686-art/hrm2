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
  lastPurchasePrice: number // Giá nhập cuối cùng
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

export interface SupplierSearchResult {
  systemId: string
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
  taxCode: string | null
  contactPerson: string | null
  totalOrders: number
  totalPurchased: number
  totalDebt: number
  isActive: boolean
  status: string
  bankName: string | null
  bankAccount: string | null
  _highlight?: {
    name?: string
    phone?: string
    email?: string
    address?: string
  }
}

export interface ShipmentSearchResult {
  systemId: string
  trackingCode: string | null
  trackingNumber: string | null
  carrier: string
  status: string
  service: string | null
  orderId: string | null
  orderBusinessId: string | null
  recipientName: string | null
  recipientPhone: string | null
  recipientAddress: string | null
  shippingFee: number
  weight: number | null
  createdAt: string | null
  pickedAt: string | null
  deliveredAt: string | null
  returnedAt: string | null
  printStatus: string
  deliveryStatus: string | null
  _highlight?: {
    trackingCode?: string
    trackingNumber?: string
    recipientName?: string
    recipientPhone?: string
  }
}

export interface WarrantySearchResult {
  systemId: string
  warrantyId: string
  warrantyCode: string
  title: string
  customerName: string
  customerPhone: string
  customerEmail: string | null
  customerAddress: string | null
  productName: string
  serialNumber: string | null
  status: string
  priority: string
  branchName: string | null
  assigneeName: string | null
  orderId: string | null
  isUnderWarranty: boolean
  totalCost: number
  createdAt: string | null
  receivedAt: string | null
  completedAt: string | null
  _highlight?: {
    warrantyId?: string
    warrantyCode?: string
    title?: string
    customerName?: string
    customerPhone?: string
    productName?: string
  }
}

// PKGX Product Search Result
export interface PkgxProductSearchResult {
  id: number
  goodsSn: string | null
  goodsNumber: string | null
  name: string
  catId: number | null
  catName: string | null
  brandId: number | null
  brandName: string | null
  shopPrice: number
  hrmProductId: string | null
}

export interface EmployeeSearchResult {
  systemId: string
  id: string
  fullName: string
  phone: string
  workEmail: string | null
  personalEmail?: string | null
  workEmail?: string | null
  email?: string | null
  department?: string | null
  departmentId?: string | null
  departmentName?: string | null
  jobTitle?: string | null
  position?: string | null
  role?: string
  avatarUrl?: string | null
  avatar?: string | null
  hireDate?: string | null
  employmentStatus?: string
  status?: string
  _highlight?: {
    fullName?: string
    employeeId?: string
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

/**
 * Employee search with Meilisearch
 */
export function useMeiliEmployeeSearch({
  query,
  limit = 20,
  offset = 0,
  debounceMs = 200,
  enabled = true,
  filters = {},
}: UseSearchOptions & {
  filters?: {
    department?: string
    position?: string
    status?: string
  }
}) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)

  return useQuery({
    queryKey: ['meili-employees', debouncedQuery, limit, offset, filters],
    queryFn: async (): Promise<{ data: EmployeeSearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(limit),
        offset: String(offset),
      })

      if (filters.department) params.set('department', filters.department)
      if (filters.position) params.set('position', filters.position)
      if (filters.status) params.set('status', filters.status)

      const response = await fetch(`/api/search/employees?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    enabled: enabled, // ✅ Always enabled - show default results when empty
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
 * ⚡ OPTIMIZED: Added lazyLoad option to defer initial fetch until user interaction
 */
export function useInfiniteMeiliProductSearch({
  query,
  debounceMs = 200,
  enabled = true,
  lazyLoad = false,
  filters = {},
}: Omit<UseSearchOptions, 'limit' | 'offset'> & {
  lazyLoad?: boolean;
  filters?: {
    brandId?: string
    categoryId?: string
    status?: string
  }
}) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  // ⚡ If lazyLoad, only enable when user has typed something OR explicitly enabled
  const isEnabled = enabled && (!lazyLoad || query.length > 0)
  
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
    enabled: isEnabled,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

/**
 * Infinite scroll customer search - loads more on scroll
 * ⚡ OPTIMIZED: Added lazyLoad option to defer initial fetch until user interaction
 */
export function useInfiniteMeiliCustomerSearch({
  query,
  debounceMs = 200,
  enabled = true,
  lazyLoad = false,
  filters = {},
}: Omit<UseSearchOptions, 'limit' | 'offset'> & {
  lazyLoad?: boolean;
  filters?: {
    city?: string
    district?: string
  }
}) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  // ⚡ If lazyLoad, only enable when user has typed something OR explicitly enabled
  const isEnabled = enabled && (!lazyLoad || query.length > 0)

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
    enabled: isEnabled,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

/**
 * Infinite scroll employee search - loads more on scroll
 * ⚡ OPTIMIZED: Added lazyLoad option to defer initial fetch until user interaction
 */
export function useInfiniteMeiliEmployeeSearch({
  query,
  debounceMs = 200,
  enabled = true,
  lazyLoad = false,
  filters = {},
}: Omit<UseSearchOptions, 'limit' | 'offset'> & {
  lazyLoad?: boolean;
  filters?: {
    department?: string
    position?: string
    status?: string
  }
}) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  // ⚡ If lazyLoad, only enable when user has typed something OR explicitly enabled
  const isEnabled = enabled && (!lazyLoad || query.length > 0)

  return useInfiniteQuery({
    queryKey: ['meili-employees-infinite', debouncedQuery, filters],
    queryFn: async ({ pageParam = 0 }): Promise<{ data: EmployeeSearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(PAGE_SIZE),
        offset: String(pageParam),
      })

      if (filters.department) params.set('department', filters.department)
      if (filters.position) params.set('position', filters.position)
      if (filters.status) params.set('status', filters.status)

      const response = await fetch(`/api/search/employees?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.data.length, 0)
      if (totalLoaded >= lastPage.meta.total) return undefined
      return totalLoaded // offset for next page
    },
    enabled: isEnabled,
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

// ===========================================
// Supplier Search Hooks
// ===========================================

/**
 * Supplier search with Meilisearch
 */
export function useMeiliSupplierSearch({
  query,
  limit = 20,
  offset = 0,
  debounceMs = 200,
  enabled = true,
  filters = {},
}: UseSearchOptions & {
  filters?: {
    isActive?: boolean
    status?: string
  }
}) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  
  return useQuery({
    queryKey: ['meili-suppliers', debouncedQuery, limit, offset, filters],
    queryFn: async (): Promise<{ data: SupplierSearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(limit),
        offset: String(offset),
      })
      
      if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive))
      if (filters.status) params.set('status', filters.status)
      
      const response = await fetch(`/api/search/suppliers?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    enabled: enabled,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}

/**
 * Infinite scroll supplier search
 */
export function useInfiniteMeiliSupplierSearch({
  query,
  debounceMs = 200,
  enabled = true,
  lazyLoad = false,
  filters = {},
}: Omit<UseSearchOptions, 'limit' | 'offset'> & {
  lazyLoad?: boolean;
  filters?: {
    isActive?: boolean
    status?: string
  }
}) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  const isEnabled = enabled && (!lazyLoad || query.length > 0)
  
  return useInfiniteQuery({
    queryKey: ['meili-suppliers-infinite', debouncedQuery, filters],
    queryFn: async ({ pageParam = 0 }): Promise<{ data: SupplierSearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(PAGE_SIZE),
        offset: String(pageParam),
      })
      
      if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive))
      if (filters.status) params.set('status', filters.status)
      
      const response = await fetch(`/api/search/suppliers?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.data.length, 0)
      if (totalLoaded >= lastPage.meta.total) return undefined
      return totalLoaded
    },
    enabled: isEnabled,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

/**
 * Simple supplier autocomplete for dropdowns/combobox
 */
export function useSupplierAutocomplete(query: string, limit = 10) {
  const { data, ...rest } = useMeiliSupplierSearch({
    query,
    limit,
    debounceMs: 150,
  })
  
  return {
    suppliers: data?.data || [],
    searchTime: data?.meta.searchTimeMs,
    ...rest,
  }
}

// ===========================================
// Shipment Search Hooks
// ===========================================

/**
 * Shipment search with Meilisearch
 */
export function useMeiliShipmentSearch({
  query,
  limit = 20,
  offset = 0,
  debounceMs = 200,
  enabled = true,
  filters = {},
}: UseSearchOptions & {
  filters?: {
    status?: string
    carrier?: string
    printStatus?: string
    deliveryStatus?: string
  }
}) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  
  return useQuery({
    queryKey: ['meili-shipments', debouncedQuery, limit, offset, filters],
    queryFn: async (): Promise<{ data: ShipmentSearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(limit),
        offset: String(offset),
      })
      
      if (filters.status) params.set('status', filters.status)
      if (filters.carrier) params.set('carrier', filters.carrier)
      if (filters.printStatus) params.set('printStatus', filters.printStatus)
      if (filters.deliveryStatus) params.set('deliveryStatus', filters.deliveryStatus)
      
      const response = await fetch(`/api/search/shipments?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    enabled: enabled && debouncedQuery.length > 0,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}

/**
 * Infinite scroll shipment search
 */
export function useInfiniteMeiliShipmentSearch({
  query,
  debounceMs = 200,
  enabled = true,
  lazyLoad = false,
  filters = {},
}: Omit<UseSearchOptions, 'limit' | 'offset'> & {
  lazyLoad?: boolean;
  filters?: {
    status?: string
    carrier?: string
    printStatus?: string
    deliveryStatus?: string
  }
}) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  const isEnabled = enabled && (!lazyLoad || query.length > 0) && debouncedQuery.length > 0
  
  return useInfiniteQuery({
    queryKey: ['meili-shipments-infinite', debouncedQuery, filters],
    queryFn: async ({ pageParam = 0 }): Promise<{ data: ShipmentSearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(PAGE_SIZE),
        offset: String(pageParam),
      })
      
      if (filters.status) params.set('status', filters.status)
      if (filters.carrier) params.set('carrier', filters.carrier)
      if (filters.printStatus) params.set('printStatus', filters.printStatus)
      if (filters.deliveryStatus) params.set('deliveryStatus', filters.deliveryStatus)
      
      const response = await fetch(`/api/search/shipments?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.data.length, 0)
      if (totalLoaded >= lastPage.meta.total) return undefined
      return totalLoaded
    },
    enabled: isEnabled,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

/**
 * Simple shipment autocomplete for dropdowns/combobox
 */
export function useShipmentAutocomplete(query: string, limit = 10) {
  const { data, ...rest } = useMeiliShipmentSearch({
    query,
    limit,
    debounceMs: 150,
  })
  
  return {
    shipments: data?.data || [],
    searchTime: data?.meta.searchTimeMs,
    ...rest,
  }
}

// ===========================================
// Warranty Search Hooks
// ===========================================

/**
 * Warranty search with Meilisearch
 */
export function useMeiliWarrantySearch({
  query,
  limit = 20,
  offset = 0,
  debounceMs = 200,
  enabled = true,
  filters = {},
}: UseSearchOptions & {
  filters?: {
    status?: string
    priority?: string
    isUnderWarranty?: boolean
    branchName?: string
    assigneeName?: string
  }
}) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  
  return useQuery({
    queryKey: ['meili-warranties', debouncedQuery, limit, offset, filters],
    queryFn: async (): Promise<{ data: WarrantySearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(limit),
        offset: String(offset),
      })
      
      if (filters.status) params.set('status', filters.status)
      if (filters.priority) params.set('priority', filters.priority)
      if (filters.isUnderWarranty !== undefined) params.set('isUnderWarranty', String(filters.isUnderWarranty))
      if (filters.branchName) params.set('branchName', filters.branchName)
      if (filters.assigneeName) params.set('assigneeName', filters.assigneeName)
      
      const response = await fetch(`/api/search/warranties?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    enabled: enabled && debouncedQuery.length > 0,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}

/**
 * Infinite scroll warranty search
 */
export function useInfiniteMeiliWarrantySearch({
  query,
  debounceMs = 200,
  enabled = true,
  lazyLoad = false,
  filters = {},
}: Omit<UseSearchOptions, 'limit' | 'offset'> & {
  lazyLoad?: boolean;
  filters?: {
    status?: string
    priority?: string
    isUnderWarranty?: boolean
    branchName?: string
    assigneeName?: string
  }
}) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  const isEnabled = enabled && (!lazyLoad || query.length > 0) && debouncedQuery.length > 0
  
  return useInfiniteQuery({
    queryKey: ['meili-warranties-infinite', debouncedQuery, filters],
    queryFn: async ({ pageParam = 0 }): Promise<{ data: WarrantySearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(PAGE_SIZE),
        offset: String(pageParam),
      })
      
      if (filters.status) params.set('status', filters.status)
      if (filters.priority) params.set('priority', filters.priority)
      if (filters.isUnderWarranty !== undefined) params.set('isUnderWarranty', String(filters.isUnderWarranty))
      if (filters.branchName) params.set('branchName', filters.branchName)
      if (filters.assigneeName) params.set('assigneeName', filters.assigneeName)
      
      const response = await fetch(`/api/search/warranties?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.data.length, 0)
      if (totalLoaded >= lastPage.meta.total) return undefined
      return totalLoaded
    },
    enabled: isEnabled,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

/**
 * Simple warranty autocomplete for dropdowns/combobox
 */
export function useWarrantyAutocomplete(query: string, limit = 10) {
  const { data, ...rest } = useMeiliWarrantySearch({
    query,
    limit,
    debounceMs: 150,
  })
  
  return {
    warranties: data?.data || [],
    searchTime: data?.meta.searchTimeMs,
    ...rest,
  }
}

// ===========================================
// PKGX Product Search Hooks
// ===========================================

/**
 * Meilisearch PKGX product search hook
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useMeiliPkgxProductSearch(searchTerm, {
 *   limit: 30,
 *   filters: { catId: 123 }
 * })
 * ```
 */
export function useMeiliPkgxProductSearch(
  query: string,
  options?: {
    limit?: number
    offset?: number
    debounceMs?: number
    enabled?: boolean
    filters?: {
      catId?: number
      brandId?: number
      mapped?: boolean
    }
  }
) {
  const {
    limit = 30,
    offset = 0,
    debounceMs = 300,
    enabled = true,
    filters = {},
  } = options || {}
  
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  
  return useQuery({
    queryKey: ['meili-pkgx-products', debouncedQuery, limit, offset, filters],
    queryFn: async (): Promise<{ data: PkgxProductSearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(limit),
        offset: String(offset),
      })
      
      if (filters.catId) params.set('catId', String(filters.catId))
      if (filters.brandId) params.set('brandId', String(filters.brandId))
      if (filters.mapped !== undefined) params.set('mapped', String(filters.mapped))
      
      const response = await fetch(`/api/search/pkgx-products?${params}`)
      if (!response.ok) throw new Error('PKGX product search failed')
      return response.json()
    },
    enabled: enabled && debouncedQuery.length > 0,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}

/**
 * Infinite scroll PKGX product search - loads more on scroll
 * 
 * @example
 * ```tsx
 * const {
 *   data,
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage,
 * } = useInfiniteMeiliPkgxProductSearch(searchTerm, {
 *   filters: { mapped: false }
 * })
 * ```
 */
export function useInfiniteMeiliPkgxProductSearch(
  query: string,
  options?: {
    debounceMs?: number
    enabled?: boolean
    lazyLoad?: boolean
    filters?: {
      catId?: number
      brandId?: number
      mapped?: boolean
    }
  }
) {
  const {
    debounceMs = 300,
    enabled = true,
    lazyLoad = false,
    filters = {},
  } = options || {}
  
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  const isEnabled = enabled && (!lazyLoad || query.length > 0)
  
  return useInfiniteQuery({
    queryKey: ['meili-pkgx-products-infinite', debouncedQuery, filters],
    queryFn: async ({ pageParam = 0 }): Promise<{ data: PkgxProductSearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(PAGE_SIZE),
        offset: String(pageParam),
      })
      
      if (filters.catId) params.set('catId', String(filters.catId))
      if (filters.brandId) params.set('brandId', String(filters.brandId))
      if (filters.mapped !== undefined) params.set('mapped', String(filters.mapped))
      
      const response = await fetch(`/api/search/pkgx-products?${params}`)
      if (!response.ok) throw new Error('PKGX product search failed')
      return response.json()
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.data.length, 0)
      if (totalLoaded >= lastPage.meta.total) return undefined
      return totalLoaded
    },
    enabled: isEnabled && debouncedQuery.length > 0,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

/**
 * Simple PKGX product autocomplete for dropdowns/combobox
 */
export function usePkgxProductAutocomplete(query: string, limit = 10) {
  const { data, ...rest } = useMeiliPkgxProductSearch(query, {
    limit,
    debounceMs: 300,
  })
  
  return {
    products: data?.data || [],
    searchTime: data?.meta.searchTimeMs,
    ...rest,
  }
}

/**
 * Simple employee autocomplete for dropdowns/combobox
 */
export function useEmployeeAutocomplete(query: string, limit = 10) {
  const { data, ...rest } = useMeiliEmployeeSearch({
    query,
    limit,
    debounceMs: 150,
  })

  return {
    employees: data?.data || [],
    searchTime: data?.meta.searchTimeMs,
    ...rest,
  }
}
