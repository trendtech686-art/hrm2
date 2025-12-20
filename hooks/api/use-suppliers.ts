/**
 * React Query hooks for Suppliers API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import type { Supplier } from '@/features/suppliers/types'

const API_BASE = '/api/suppliers'

// API Functions
async function fetchSuppliers(params?: { search?: string; includeDeleted?: boolean }): Promise<Supplier[]> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.includeDeleted) searchParams.set('includeDeleted', 'true')
  
  const url = searchParams.toString() ? `${API_BASE}?${searchParams}` : API_BASE
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch suppliers')
  return res.json()
}

async function fetchSupplier(systemId: string): Promise<Supplier> {
  const res = await fetch(`${API_BASE}/${systemId}`)
  if (!res.ok) throw new Error('Supplier not found')
  return res.json()
}

async function createSupplier(data: Omit<Supplier, 'systemId'>): Promise<Supplier> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create supplier')
  return res.json()
}

async function updateSupplier(systemId: string, data: Partial<Supplier>): Promise<Supplier> {
  const res = await fetch(`${API_BASE}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update supplier')
  return res.json()
}

async function deleteSupplier(systemId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${systemId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete supplier')
}

// Query Hooks
export function useSuppliers(options: { search?: string; includeDeleted?: boolean; enabled?: boolean } = {}) {
  const { enabled = true, ...params } = options
  return useQuery({
    queryKey: queryKeys.suppliers.list(JSON.stringify(params)),
    queryFn: () => fetchSuppliers(params),
    enabled,
  })
}

export function useSupplier(systemId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.suppliers.detail(systemId!),
    queryFn: () => fetchSupplier(systemId!),
    enabled: !!systemId,
  })
}

// Mutation Hooks
export function useCreateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all }),
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Supplier> }) =>
      updateSupplier(systemId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all }),
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all }),
  })
}

export function useSupplierSearch(searchTerm: string) {
  return useSuppliers({ search: searchTerm, enabled: searchTerm.length >= 2 })
}
