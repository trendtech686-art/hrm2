/**
 * Generic API Hook Factory
 * Creates standard CRUD hooks for any entity
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface EntityConfig {
  name: string           // Entity name for query keys (e.g., 'departments')
  apiPath: string        // API path (e.g., '/api/departments')
}

// Generic API functions
async function fetchList<T>(apiPath: string, params?: Record<string, string>): Promise<T[]> {
  const searchParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, value)
    })
  }
  const url = searchParams.toString() ? `${apiPath}?${searchParams}` : apiPath
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${apiPath}`)
  return res.json()
}

async function fetchOne<T>(apiPath: string, systemId: string): Promise<T> {
  const res = await fetch(`${apiPath}/${systemId}`)
  if (!res.ok) throw new Error(`Not found: ${systemId}`)
  return res.json()
}

async function createOne<T>(apiPath: string, data: Partial<T>): Promise<T> {
  const res = await fetch(apiPath, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Failed to create`)
  return res.json()
}

async function updateOne<T>(apiPath: string, systemId: string, data: Partial<T>): Promise<T> {
  const res = await fetch(`${apiPath}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Failed to update`)
  return res.json()
}

async function deleteOne(apiPath: string, systemId: string, hard = false): Promise<void> {
  const url = hard ? `${apiPath}/${systemId}?hard=true` : `${apiPath}/${systemId}`
  const res = await fetch(url, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Failed to delete`)
}

/**
 * Create CRUD hooks for an entity
 * @example
 * const { useList, useOne, useCreate, useUpdate, useDelete } = createEntityHooks({
 *   name: 'departments',
 *   apiPath: '/api/departments'
 * })
 */
export function createEntityHooks<T extends { systemId: string }>(config: EntityConfig) {
  const { name, apiPath } = config
  const keys = {
    all: [name] as const,
    lists: () => [...keys.all, 'list'] as const,
    list: (filters: string) => [...keys.lists(), { filters }] as const,
    details: () => [...keys.all, 'detail'] as const,
    detail: (id: string) => [...keys.details(), id] as const,
  }

  // List hook
  function useList(params?: Record<string, string>, enabled = true) {
    return useQuery({
      queryKey: keys.list(JSON.stringify(params || {})),
      queryFn: () => fetchList<T>(apiPath, params),
      enabled,
    })
  }

  // Single item hook
  function useOne(systemId: string | undefined) {
    return useQuery({
      queryKey: keys.detail(systemId!),
      queryFn: () => fetchOne<T>(apiPath, systemId!),
      enabled: !!systemId,
    })
  }

  // Create mutation
  function useCreate() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (data: Partial<T>) => createOne<T>(apiPath, data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
    })
  }

  // Update mutation  
  function useUpdate() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ systemId, data }: { systemId: string; data: Partial<T> }) =>
        updateOne<T>(apiPath, systemId, data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
    })
  }

  // Delete mutation
  function useDelete() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ systemId, hard = false }: { systemId: string; hard?: boolean }) =>
        deleteOne(apiPath, systemId, hard),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
    })
  }

  return {
    keys,
    useList,
    useOne,
    useCreate,
    useUpdate,
    useDelete,
  }
}

// ============================================================
// Pre-built hooks for common entities
// ============================================================

// Departments
export const departmentHooks = createEntityHooks<{ systemId: string; name: string }>({
  name: 'departments',
  apiPath: '/api/departments',
})

// Job Titles
export const jobTitleHooks = createEntityHooks<{ systemId: string; name: string }>({
  name: 'job-titles',
  apiPath: '/api/job-titles',
})

// Categories
export const categoryHooks = createEntityHooks<{ systemId: string; name: string }>({
  name: 'categories',
  apiPath: '/api/categories',
})

// Brands
export const brandHooks = createEntityHooks<{ systemId: string; name: string }>({
  name: 'brands',
  apiPath: '/api/brands',
})

// Stock Locations
export const stockLocationHooks = createEntityHooks<{ systemId: string; name: string }>({
  name: 'stock-locations',
  apiPath: '/api/stock-locations',
})

// Payment Methods
export const paymentMethodHooks = createEntityHooks<{ systemId: string; name: string }>({
  name: 'payment-methods',
  apiPath: '/api/payment-methods',
})

// ============================================================
// Convenience exports
// ============================================================

export const useDepartments = departmentHooks.useList
export const useDepartment = departmentHooks.useOne
export const useCreateDepartment = departmentHooks.useCreate
export const useUpdateDepartment = departmentHooks.useUpdate
export const useDeleteDepartment = departmentHooks.useDelete

export const useJobTitles = jobTitleHooks.useList
export const useJobTitle = jobTitleHooks.useOne

export const useCategories = categoryHooks.useList
export const useCategory = categoryHooks.useOne

export const useBrands = brandHooks.useList
export const useBrand = brandHooks.useOne

export const useStockLocations = stockLocationHooks.useList
export const useStockLocation = stockLocationHooks.useOne

export const usePaymentMethods = paymentMethodHooks.useList
