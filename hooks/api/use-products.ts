/**
 * React Query hooks for Products API
 * Replaces zustand store with server state management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import type { Product } from '@/lib/types/prisma-extended'

// ============================================================
// API Functions
// ============================================================

const API_BASE = '/api/products'

async function fetchProducts(params?: {
  search?: string
  category?: string
  brand?: string
  status?: string
  includeDeleted?: boolean
}): Promise<Product[]> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.category) searchParams.set('category', params.category)
  if (params?.brand) searchParams.set('brand', params.brand)
  if (params?.status) searchParams.set('status', params.status)
  if (params?.includeDeleted) searchParams.set('includeDeleted', 'true')
  
  const url = searchParams.toString() ? `${API_BASE}?${searchParams}` : API_BASE
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

async function fetchProduct(systemId: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/${systemId}`)
  if (!res.ok) throw new Error('Product not found')
  return res.json()
}

async function createProduct(data: Omit<Product, 'systemId'>): Promise<Product> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create product')
  }
  return res.json()
}

async function updateProduct(systemId: string, data: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update product')
  }
  return res.json()
}

async function deleteProduct(systemId: string, hard = false): Promise<void> {
  const url = hard ? `${API_BASE}/${systemId}?hard=true` : `${API_BASE}/${systemId}`
  const res = await fetch(url, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete product')
}

// ============================================================
// Query Hooks
// ============================================================

export interface UseProductsOptions {
  search?: string
  category?: string
  brand?: string
  status?: string
  includeDeleted?: boolean
  enabled?: boolean
}

/**
 * Fetch all products with optional filters
 */
export function useProducts(options: UseProductsOptions = {}) {
  const { enabled = true, ...params } = options
  const filterKey = JSON.stringify(params)
  
  return useQuery({
    queryKey: queryKeys.products.list(filterKey),
    queryFn: () => fetchProducts(params),
    enabled,
  })
}

/**
 * Fetch single product by systemId
 */
export function useProduct(systemId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.detail(systemId!),
    queryFn: () => fetchProduct(systemId!),
    enabled: !!systemId,
  })
}

// ============================================================
// Mutation Hooks
// ============================================================

/**
 * Create new product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}

/**
 * Update existing product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Product> }) =>
      updateProduct(systemId, data),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(
        queryKeys.products.detail(updatedProduct.systemId),
        updatedProduct
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
    },
  })
}

/**
 * Delete product (soft or hard)
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ systemId, hard = false }: { systemId: string; hard?: boolean }) =>
      deleteProduct(systemId, hard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}

// ============================================================
// Helper Hooks
// ============================================================

/**
 * Get active products only
 */
export function useActiveProducts() {
  return useProducts({ includeDeleted: false })
}

/**
 * Search products by name/sku
 */
export function useProductSearch(searchTerm: string) {
  return useProducts({ 
    search: searchTerm,
    enabled: searchTerm.length >= 2 
  })
}

/**
 * Get products by category
 */
export function useProductsByCategory(categoryId: string) {
  return useProducts({ category: categoryId, enabled: !!categoryId })
}

/**
 * Get products by brand
 */
export function useProductsByBrand(brandId: string) {
  return useProducts({ brand: brandId, enabled: !!brandId })
}
