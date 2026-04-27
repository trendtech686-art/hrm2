/**
 * useCustomerStats hook — Unified customer profile + aggregated stats
 * 
 * ⚡ PERFORMANCE: Single API call returning:
 * - Full customer profile (replaces useCustomer)
 * - Resolved customer group name (replaces useCustomerGroups)
 * - Order/warranty/complaint counts
 * - Server-side debt calculation
 * 
 * Used by both customer-selector (order form) and order-detail-page.
 */

import { useQuery } from '@tanstack/react-query'
import type { Customer } from '@/lib/types/prisma-extended'
import { customerKeys } from './use-customers'

export interface CustomerStats {
  customer: Customer | null
  customerGroupName: string | null
  orders: {
    total: number
    pending: number
    inProgress: number
    completed: number
    cancelled: number
    lastOrderDate: string | null
  }
  warranties: {
    total: number
    active: number
  }
  complaints: {
    total: number
    active: number
  }
  financial: {
    totalSpent: number
    currentDebt: number
  }
}

const EMPTY_STATS: CustomerStats = {
  customer: null,
  customerGroupName: null,
  orders: { total: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0, lastOrderDate: null },
  warranties: { total: 0, active: 0 },
  complaints: { total: 0, active: 0 },
  financial: { totalSpent: 0, currentDebt: 0 },
}

async function fetchCustomerStats(systemId: string): Promise<CustomerStats> {
  const res = await fetch(`/api/customers/${systemId}/stats`)
  if (!res.ok) throw new Error('Failed to fetch customer stats')
  return res.json()
}

export function useCustomerStats(customerId: string | undefined | null) {
  const query = useQuery({
    queryKey: customerKeys.customerStats(customerId ?? ''),
    queryFn: () => fetchCustomerStats(customerId!),
    enabled: !!customerId,
    staleTime: 60_000,
    gcTime: 5 * 60 * 1000,
  })

  return {
    data: query.data ?? EMPTY_STATS,
    isLoaded: !!query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
