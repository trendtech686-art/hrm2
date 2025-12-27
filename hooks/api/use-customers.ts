/**
 * React Query hooks for Customers API
 * Replaces zustand store with server state management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import type { Customer } from '@/lib/types/prisma-extended'

// ============================================================
// API Functions
// ============================================================

const API_BASE = '/api/customers'

async function fetchCustomers(params?: {
  search?: string
  type?: string
  group?: string
  includeDeleted?: boolean
}): Promise<Customer[]> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.type) searchParams.set('type', params.type)
  if (params?.group) searchParams.set('group', params.group)
  if (params?.includeDeleted) searchParams.set('includeDeleted', 'true')
  
  const url = searchParams.toString() ? `${API_BASE}?${searchParams}` : API_BASE
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch customers')
  return res.json()
}

async function fetchCustomer(systemId: string): Promise<Customer> {
  const res = await fetch(`${API_BASE}/${systemId}`)
  if (!res.ok) throw new Error('Customer not found')
  return res.json()
}

async function createCustomer(data: Omit<Customer, 'systemId'>): Promise<Customer> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create customer')
  }
  return res.json()
}

async function updateCustomer(systemId: string, data: Partial<Customer>): Promise<Customer> {
  const res = await fetch(`${API_BASE}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update customer')
  }
  return res.json()
}

async function deleteCustomer(systemId: string, hard = false): Promise<void> {
  const url = hard ? `${API_BASE}/${systemId}?hard=true` : `${API_BASE}/${systemId}`
  const res = await fetch(url, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete customer')
}

// ============================================================
// Query Hooks
// ============================================================

export interface UseCustomersOptions {
  search?: string
  type?: string
  group?: string
  includeDeleted?: boolean
  enabled?: boolean
}

/**
 * Fetch all customers with optional filters
 */
export function useCustomers(options: UseCustomersOptions = {}) {
  const { enabled = true, ...params } = options
  const filterKey = JSON.stringify(params)
  
  return useQuery({
    queryKey: queryKeys.customers.list(filterKey),
    queryFn: () => fetchCustomers(params),
    enabled,
  })
}

/**
 * Fetch single customer by systemId
 */
export function useCustomer(systemId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.customers.detail(systemId!),
    queryFn: () => fetchCustomer(systemId!),
    enabled: !!systemId,
  })
}

// ============================================================
// Mutation Hooks
// ============================================================

/**
 * Create new customer
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
    },
  })
}

/**
 * Update existing customer
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Customer> }) =>
      updateCustomer(systemId, data),
    onSuccess: (updatedCustomer) => {
      queryClient.setQueryData(
        queryKeys.customers.detail(updatedCustomer.systemId),
        updatedCustomer
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() })
    },
  })
}

/**
 * Delete customer (soft or hard)
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ systemId, hard = false }: { systemId: string; hard?: boolean }) =>
      deleteCustomer(systemId, hard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
    },
  })
}

// ============================================================
// Helper Hooks
// ============================================================

/**
 * Get active customers only
 */
export function useActiveCustomers() {
  return useCustomers({ includeDeleted: false })
}

/**
 * Search customers by name/phone/email
 */
export function useCustomerSearch(searchTerm: string) {
  return useCustomers({ 
    search: searchTerm,
    enabled: searchTerm.length >= 2 
  })
}

/**
 * Get customers by type (B2B, B2C, etc.)
 */
export function useCustomersByType(type: string) {
  return useCustomers({ type, enabled: !!type })
}
