/**
 * React Query hooks for Employees API
 * Replaces zustand store with server state management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import type { Employee } from '@/features/employees/types'
import type { SystemId } from '@/lib/id-types'

// ============================================================
// API Functions
// ============================================================

const API_BASE = '/api/employees'

interface EmployeesResponse {
  data: Employee[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

async function fetchEmployees(params?: {
  search?: string
  department?: string
  status?: string
  includeDeleted?: boolean
}): Promise<EmployeesResponse> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.department) searchParams.set('departmentId', params.department)
  if (params?.status) searchParams.set('status', params.status)
  if (params?.includeDeleted) searchParams.set('includeDeleted', 'true')
  
  const url = searchParams.toString() ? `${API_BASE}?${searchParams}` : API_BASE
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch employees')
  return res.json()
}

async function fetchEmployee(systemId: string): Promise<Employee> {
  const res = await fetch(`${API_BASE}/${systemId}`)
  if (!res.ok) throw new Error('Employee not found')
  return res.json()
}

async function createEmployee(data: Omit<Employee, 'systemId'>): Promise<Employee> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create employee')
  }
  return res.json()
}

async function updateEmployee(systemId: string, data: Partial<Employee>): Promise<Employee> {
  const res = await fetch(`${API_BASE}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update employee')
  }
  return res.json()
}

async function deleteEmployee(systemId: string, hard = false): Promise<void> {
  const url = hard ? `${API_BASE}/${systemId}?hard=true` : `${API_BASE}/${systemId}`
  const res = await fetch(url, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete employee')
}

async function restoreEmployee(systemId: string): Promise<Employee> {
  const res = await fetch(`${API_BASE}/${systemId}/restore`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to restore employee')
  return res.json()
}

// ============================================================
// Query Hooks
// ============================================================

export interface UseEmployeesOptions {
  search?: string
  department?: string
  status?: string
  includeDeleted?: boolean
  enabled?: boolean
}

/**
 * Fetch all employees with optional filters
 */
export function useEmployees(options: UseEmployeesOptions = {}) {
  const { enabled = true, ...params } = options
  const filterKey = JSON.stringify(params)
  
  return useQuery({
    queryKey: queryKeys.employees.list(filterKey),
    queryFn: () => fetchEmployees(params),
    enabled,
  })
}

/**
 * Fetch single employee by systemId
 */
export function useEmployee(systemId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.employees.detail(systemId!),
    queryFn: () => fetchEmployee(systemId!),
    enabled: !!systemId,
  })
}

// ============================================================
// Mutation Hooks
// ============================================================

/**
 * Create new employee
 */
export function useCreateEmployee() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      // Invalidate all employee lists
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all })
    },
  })
}

/**
 * Update existing employee
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Employee> }) =>
      updateEmployee(systemId, data),
    onSuccess: (updatedEmployee) => {
      // Update cache optimistically
      queryClient.setQueryData(
        queryKeys.employees.detail(updatedEmployee.systemId),
        updatedEmployee
      )
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.lists() })
    },
  })
}

/**
 * Delete employee (soft or hard)
 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ systemId, hard = false }: { systemId: string; hard?: boolean }) =>
      deleteEmployee(systemId, hard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all })
    },
  })
}

/**
 * Restore soft-deleted employee
 */
export function useRestoreEmployee() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: restoreEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all })
    },
  })
}

// ============================================================
// Helper Hooks (for backwards compatibility)
// ============================================================

/**
 * Get active employees only (not deleted)
 */
export function useActiveEmployees() {
  return useEmployees({ includeDeleted: false })
}

/**
 * Get deleted employees only  
 */
export function useDeletedEmployees() {
  const { data, ...rest } = useEmployees({ includeDeleted: true })
  return {
    ...rest,
    data: data?.filter(e => e.isDeleted) ?? [],
  }
}

/**
 * Search employees by name/id
 */
export function useEmployeeSearch(searchTerm: string) {
  return useEmployees({ 
    search: searchTerm,
    enabled: searchTerm.length >= 2 
  })
}
