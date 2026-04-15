/**
 * useProductFormData - Consolidated hook for product form reference data
 * 
 * Fetches all reference data needed by the product create/edit form in a single API call.
 * Replaces 9 individual hooks → 1 request.
 * 
 * Also populates individual React Query caches so settings pages can read from cache.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import type { ProductSlaSettings, ProductLogisticsSettings } from '@/features/settings/inventory/types'
import type { PricingPolicy } from '@/lib/types/prisma-extended'
import type { SystemId } from '@/lib/id-types'
import { slaSettingsKeys } from '@/features/settings/inventory/hooks/use-sla-settings'
import { logisticsSettingsKeys } from '@/features/settings/inventory/hooks/use-logistics-settings'

interface FormReferenceData {
  units: Array<{ systemId: string; id: string; name: string; description?: string | null; isDefault?: boolean; isActive?: boolean }>
  suppliers: Array<{ systemId: string; id: string; name: string }>
  storageLocations: Array<{ systemId: SystemId; id: string; name: string; isActive?: boolean; isDefault?: boolean; branchId?: string | null; [key: string]: unknown }>
  productTypes: Array<{ systemId: SystemId; id: string; name: string; isActive?: boolean; isDefault?: boolean; [key: string]: unknown }>
  brands: Array<{ systemId: SystemId; id: string; name: string; isActive?: boolean; isDeleted?: boolean; [key: string]: unknown }>
  categories: Array<{ systemId: SystemId; id: string; name: string; path?: string | null; isActive?: boolean; level?: number | null; parentId?: string | null; [key: string]: unknown }>
  pricingPolicies: PricingPolicy[]
  slaSettings: ProductSlaSettings
  logisticsSettings: ProductLogisticsSettings
}

const DEFAULT_SLA: ProductSlaSettings = {
  defaultReorderLevel: 10,
  defaultSafetyStock: 5,
  defaultMaxStock: 100,
  deadStockDays: 90,
  slowMovingDays: 30,
  enableEmailAlerts: false,
  alertEmailRecipients: [],
  alertFrequency: 'daily',
  showOnDashboard: true,
  dashboardAlertTypes: ['out_of_stock', 'low_stock', 'below_safety'],
}

const DEFAULT_LOGISTICS: ProductLogisticsSettings = {
  physicalDefaults: { weight: 500, weightUnit: 'g', length: 30, width: 20, height: 10 },
  comboDefaults: { weight: 1000, weightUnit: 'g', length: 35, width: 25, height: 15 },
}

async function fetchFormReferenceData(): Promise<FormReferenceData> {
  const res = await fetch('/api/products/form-reference-data')
  if (!res.ok) throw new Error('Failed to fetch form reference data')
  return res.json()
}

const EMPTY_ARRAY: never[] = []

export function useProductFormData() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['products', 'form-reference-data'],
    queryFn: fetchFormReferenceData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  // Populate individual caches so settings pages can benefit from cached data
  React.useEffect(() => {
    if (!query.data) return
    const d = query.data
    queryClient.setQueryData(slaSettingsKeys.settings(), d.slaSettings)
    queryClient.setQueryData(logisticsSettingsKeys.settings(), d.logisticsSettings)
  }, [query.data, queryClient])

  return {
    units: query.data?.units ?? EMPTY_ARRAY,
    suppliers: query.data?.suppliers ?? EMPTY_ARRAY as Array<{ systemId: SystemId; id: string; name: string }>,
    storageLocations: query.data?.storageLocations ?? EMPTY_ARRAY,
    productTypes: query.data?.productTypes ?? EMPTY_ARRAY,
    brands: query.data?.brands ?? EMPTY_ARRAY,
    categories: query.data?.categories ?? EMPTY_ARRAY,
    pricingPolicies: query.data?.pricingPolicies ?? EMPTY_ARRAY as PricingPolicy[],
    slaSettings: query.data?.slaSettings ?? DEFAULT_SLA,
    logisticsSettings: query.data?.logisticsSettings ?? DEFAULT_LOGISTICS,
    isLoading: query.isLoading,
  }
}
