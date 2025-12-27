/**
 * React Query hooks for Branches API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import type { Branch } from '@/lib/types/prisma-extended'

const API_BASE = '/api/branches'

// API Functions
async function fetchBranches(params?: { includeDeleted?: boolean }): Promise<Branch[]> {
  const searchParams = new URLSearchParams()
  if (params?.includeDeleted) searchParams.set('includeDeleted', 'true')
  
  const url = searchParams.toString() ? `${API_BASE}?${searchParams}` : API_BASE
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch branches')
  return res.json()
}

async function fetchBranch(systemId: string): Promise<Branch> {
  const res = await fetch(`${API_BASE}/${systemId}`)
  if (!res.ok) throw new Error('Branch not found')
  return res.json()
}

async function createBranch(data: Omit<Branch, 'systemId'>): Promise<Branch> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create branch')
  return res.json()
}

async function updateBranch(systemId: string, data: Partial<Branch>): Promise<Branch> {
  const res = await fetch(`${API_BASE}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update branch')
  return res.json()
}

async function deleteBranch(systemId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${systemId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete branch')
}

// Query Hooks
export function useBranches(options: { includeDeleted?: boolean; enabled?: boolean } = {}) {
  const { enabled = true, ...params } = options
  return useQuery({
    queryKey: queryKeys.branches.list(JSON.stringify(params)),
    queryFn: () => fetchBranches(params),
    enabled,
  })
}

export function useBranch(systemId: string | undefined) {
  return useQuery({
    queryKey: [...queryKeys.branches.all, 'detail', systemId] as const,
    queryFn: () => fetchBranch(systemId!),
    enabled: !!systemId,
  })
}

// Mutation Hooks
export function useCreateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.branches.all }),
  })
}

export function useUpdateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Branch> }) =>
      updateBranch(systemId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.branches.all }),
  })
}

export function useDeleteBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.branches.all }),
  })
}

// Helper: Get active branches only
export function useActiveBranches() {
  return useBranches({ includeDeleted: false })
}
