/**
 * Server-side customer debt computation hooks
 * 
 * Replaces client-side useCustomersWithComputedDebt() which loaded ALL orders + ALL receipts + ALL payments.
 * Uses /api/customers/debt endpoint for full debt with debtTransactions.
 * Uses /api/customer-debt endpoint for simple currentDebt numbers.
 * 
 * ⚡ PERFORMANCE: Single API call instead of 3 separate useAll* hooks
 */

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Customer, DebtTransaction } from '@/lib/types/prisma-extended'
import type { SystemId } from '@/lib/id-types'

// ============================================
// NEW: Full debt computation API (/api/customers/debt)
// Returns currentDebt + debtTransactions per customer
// ============================================

export type ComputedDebtInfo = {
  currentDebt: number
  debtTransactions: DebtTransaction[]
}

type DebtApiResponse = {
  success: boolean
  data: Record<string, ComputedDebtInfo>
}

async function fetchAllCustomersDebtFull(): Promise<Record<string, ComputedDebtInfo>> {
  const res = await fetch('/api/customers/debt')
  if (!res.ok) throw new Error('Failed to fetch customer debt')
  const json: DebtApiResponse = await res.json()
  return json.data ?? {}
}

/**
 * Hook to fetch all customers' debt computed server-side (full: currentDebt + debtTransactions)
 */
export function useAllCustomersDebtFull() {
  return useQuery({
    queryKey: ['customers', 'debt', 'full'],
    queryFn: fetchAllCustomersDebtFull,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  })
}

/**
 * Hook that enriches customers array with server-computed debt (currentDebt + debtTransactions)
 * Drop-in replacement for useCustomersWithComputedDebt()
 */
export function useCustomersWithServerDebt(customers: Customer[]): {
  data: Customer[]
  isLoading: boolean
} {
  const { data: debtMap, isLoading } = useAllCustomersDebtFull()

  const enrichedCustomers = React.useMemo(() => 
    customers.map(customer => {
      const debtInfo = debtMap?.[customer.systemId]
      if (debtInfo) {
        return {
          ...customer,
          currentDebt: debtInfo.currentDebt,
          debtTransactions: debtInfo.debtTransactions,
        }
      }
      return customer
    }),
    [customers, debtMap]
  )

  return { data: enrichedCustomers, isLoading }
}

// ============================================
// LEGACY: Simple debt number API (/api/customer-debt)
// ============================================

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
    staleTime: 30 * 1000,
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
    staleTime: 30 * 1000,
  })
}
