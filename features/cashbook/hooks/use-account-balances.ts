/**
 * Hook for fetching cash account balances from server-side API
 * Uses the optimized /api/cash-accounts/balances endpoint
 */

import { useQuery } from '@tanstack/react-query'
import type { SystemId } from '@/lib/id-types'

export type AccountBalance = {
  systemId: string
  id: string
  name: string
  branchSystemId: string | null
  initialBalance: number
  totalReceipts: number
  totalPayments: number
  currentBalance: number
  minBalance: number | null
  maxBalance: number | null
  isLowBalance: boolean
  isHighBalance: boolean
  isActive: boolean
  isDefault: boolean
}

export type AccountBalancesResponse = {
  data: AccountBalance[]
}

/**
 * Fetch account balances from API
 */
async function fetchAccountBalances(params: {
  accountSystemId?: string
  branchId?: string
}): Promise<AccountBalance[]> {
  const searchParams = new URLSearchParams()
  if (params.accountSystemId) searchParams.set('accountSystemId', params.accountSystemId)
  if (params.branchId) searchParams.set('branchId', params.branchId)

  const response = await fetch(`/api/cash-accounts/balances?${searchParams.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch account balances')
  }
  const json = await response.json()
  return json.data.data
}

/**
 * Hook to get balances for all cash accounts (server-side calculated)
 */
export function useAccountBalances(options: { branchId?: string } = {}) {
  const { branchId } = options

  return useQuery({
    queryKey: ['cash-account-balances', branchId],
    queryFn: () => fetchAccountBalances({ branchId }),
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to get balance for a single account (server-side calculated)
 */
export function useAccountBalance(accountSystemId: SystemId | null | undefined) {
  return useQuery({
    queryKey: ['cash-account-balance', accountSystemId],
    queryFn: async () => {
      if (!accountSystemId) return null
      const balances = await fetchAccountBalances({ accountSystemId })
      return balances[0] || null
    },
    enabled: !!accountSystemId,
    staleTime: 30 * 1000, // 30 seconds
  })
}
