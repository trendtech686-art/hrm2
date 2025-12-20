/**
 * React Query hooks for Orders API
 * Replaces zustand store with server state management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Order } from '@/features/orders/types'

// ============================================================
// Query Keys
// ============================================================

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: string) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
}

// ============================================================
// API Functions
// ============================================================

const API_BASE = '/api/orders'

async function fetchOrders(params?: {
  search?: string
  status?: string
  customerId?: string
  branchId?: string
  dateFrom?: string
  dateTo?: string
  includeDeleted?: boolean
}): Promise<Order[]> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.status) searchParams.set('status', params.status)
  if (params?.customerId) searchParams.set('customerId', params.customerId)
  if (params?.branchId) searchParams.set('branchId', params.branchId)
  if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom)
  if (params?.dateTo) searchParams.set('dateTo', params.dateTo)
  if (params?.includeDeleted) searchParams.set('includeDeleted', 'true')
  
  const url = searchParams.toString() ? `${API_BASE}?${searchParams}` : API_BASE
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json()
}

async function fetchOrder(systemId: string): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}`)
  if (!res.ok) throw new Error('Order not found')
  return res.json()
}

async function createOrder(data: Omit<Order, 'systemId'>): Promise<Order> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create order')
  }
  return res.json()
}

async function updateOrder(systemId: string, data: Partial<Order>): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update order')
  }
  return res.json()
}

async function deleteOrder(systemId: string, hard = false): Promise<void> {
  const url = hard ? `${API_BASE}/${systemId}?hard=true` : `${API_BASE}/${systemId}`
  const res = await fetch(url, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete order')
}

// ============================================================
// Query Hooks
// ============================================================

export interface UseOrdersOptions {
  search?: string
  status?: string
  customerId?: string
  branchId?: string
  dateFrom?: string
  dateTo?: string
  includeDeleted?: boolean
  enabled?: boolean
}

/**
 * Fetch all orders with optional filters
 */
export function useOrders(options: UseOrdersOptions = {}) {
  const { enabled = true, ...params } = options
  const filterKey = JSON.stringify(params)
  
  return useQuery({
    queryKey: orderKeys.list(filterKey),
    queryFn: () => fetchOrders(params),
    enabled,
  })
}

/**
 * Fetch single order by systemId
 */
export function useOrder(systemId: string | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(systemId!),
    queryFn: () => fetchOrder(systemId!),
    enabled: !!systemId,
  })
}

// ============================================================
// Mutation Hooks
// ============================================================

/**
 * Create new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
    },
  })
}

/**
 * Update existing order
 */
export function useUpdateOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Order> }) =>
      updateOrder(systemId, data),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(
        orderKeys.detail(updatedOrder.systemId),
        updatedOrder
      )
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    },
  })
}

/**
 * Delete order (soft or hard)
 */
export function useDeleteOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ systemId, hard = false }: { systemId: string; hard?: boolean }) =>
      deleteOrder(systemId, hard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
    },
  })
}

// ============================================================
// Helper Hooks
// ============================================================

/**
 * Get orders by status
 */
export function useOrdersByStatus(status: string) {
  return useOrders({ status, enabled: !!status })
}

/**
 * Get orders by customer
 */
export function useCustomerOrders(customerId: string) {
  return useOrders({ customerId, enabled: !!customerId })
}

/**
 * Get today's orders
 */
export function useTodayOrders() {
  const today = new Date().toISOString().split('T')[0]
  return useOrders({ dateFrom: today, dateTo: today })
}

/**
 * Get pending orders (not completed/cancelled)
 */
export function usePendingOrders() {
  return useOrders({ status: 'pending' })
}
