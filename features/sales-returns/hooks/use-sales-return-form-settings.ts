/**
 * useSalesReturnFormSettings - Combined settings hook for Sales Return Form page
 * ⚡ OPTIMIZED: Single API call instead of 6+ parallel calls
 * 
 * Replaces separate calls to:
 * - useAllBranches
 * - useAllPricingPolicies
 * - useAllCashAccounts
 * - useAllPaymentMethods
 * - useProductTypeFinder
 * - useAllUnits
 */

import { useQuery } from '@tanstack/react-query'

export interface SalesReturnFormSettings {
  branches: Array<{
    id: string
    systemId: string
    name: string
    isDefault: boolean
    address?: string | null
    phone?: string | null
    province?: string | null
    provinceId?: string | null
    district?: string | null
    districtId?: number | null
    ward?: string | null
    wardCode?: string | null
  }>
  pricingPolicies: Array<{
    id: number
    systemId: string
    name: string
    type: string
    isDefault: boolean
    isActive: boolean
  }>
  cashAccounts: Array<{
    id: string
    systemId: string
    name: string
    type: string
    isDefault: boolean
    branchSystemId?: string | null
  }>
  paymentMethods: Array<{
    id: number
    systemId: string
    name: string
    type: string // cash, bank, other
    isDefault: boolean
    isActive: boolean
  }>
  productTypes: Array<{
    id: string
    systemId: string
    name: string
  }>
  units: Array<{
    id: string
    systemId: string
    name: string
    isActive: boolean
  }>
}

async function fetchSalesReturnFormSettings(): Promise<SalesReturnFormSettings> {
  const response = await fetch('/api/settings/sales-return-form')
  if (!response.ok) throw new Error('Failed to fetch sales return form settings')
  const json = await response.json()
  // Handle both {data: ...} and direct response formats
  const data = json.data ?? json
  if (!data || !data.branches) {
    throw new Error('Invalid sales return form settings response')
  }
  return data
}

export const salesReturnFormSettingsKeys = {
  all: ['sales-return-form-settings'] as const,
}

export function useSalesReturnFormSettings() {
  return useQuery({
    queryKey: salesReturnFormSettingsKeys.all,
    queryFn: fetchSalesReturnFormSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

/**
 * Helper to get default pricing policy for sales
 */
export function getDefaultSalePricingPolicy(policies: SalesReturnFormSettings['pricingPolicies']) {
  return policies.find(p => p.isDefault && p.type === 'Bán hàng') ?? null
}

/**
 * Helper to get default cash account
 */
export function getDefaultCashAccount(accounts: SalesReturnFormSettings['cashAccounts']) {
  return accounts.find(a => a.isDefault) ?? accounts[0] ?? null
}

/**
 * Helper to get default payment method
 */
export function getDefaultPaymentMethod(methods: SalesReturnFormSettings['paymentMethods']) {
  return methods.find(m => m.isDefault) ?? methods[0] ?? null
}

/**
 * Helper to find product type by systemId
 */
export function findProductType(
  productTypes: SalesReturnFormSettings['productTypes'],
  systemId: string | null | undefined
) {
  if (!systemId) return null
  return productTypes.find(pt => pt.systemId === systemId) ?? null
}
