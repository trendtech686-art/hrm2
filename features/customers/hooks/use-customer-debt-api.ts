/**
 * Hook for fetching customer debt from server-side API
 * Uses the optimized /api/customer-debt endpoint
 */

import { useQuery } from '@tanstack/react-query'
import type { SystemId } from '@/lib/id-types'

export type CustomerDebtInfo = {
  systemId: string
  name: string
  phone: string | null
  email: string | null
  paymentTerms: string | null
  currentDebt: number
}

export type CustomerDebtResponse = {
  data: CustomerDebtInfo[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type SingleCustomerDebtResponse = {
  debt: number
}

/**
 * Fetch customer debt from API
 */
async function fetchCustomerDebt(params: {
  customerSystemId?: string
  page?: number
  limit?: number
}): Promise<CustomerDebtResponse | SingleCustomerDebtResponse> {
  const searchParams = new URLSearchParams()
  if (params.customerSystemId) searchParams.set('customerSystemId', params.customerSystemId)
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())

  const response = await fetch(`/api/customer-debt?${searchParams.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch customer debt')
  }
  const json = await response.json()
  return json.data
}

/**
 * Hook to get debt for a single customer (server-side calculated)
 */
export function useCustomerDebt(customerSystemId: SystemId | null | undefined) {
  return useQuery({
    queryKey: ['customer-debt', customerSystemId],
    queryFn: async () => {
      if (!customerSystemId) return null
      const response = await fetchCustomerDebt({ customerSystemId }) as SingleCustomerDebtResponse
      return response.debt
    },
    enabled: !!customerSystemId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to get debt for all customers with pagination (server-side calculated)
 */
export function useAllCustomersDebt(options: { page?: number; limit?: number } = {}) {
  const { page = 1, limit = 50 } = options

  return useQuery({
    queryKey: ['customers-debt', page, limit],
    queryFn: async () => {
      const response = await fetchCustomerDebt({ page, limit }) as CustomerDebtResponse
      return response
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}
