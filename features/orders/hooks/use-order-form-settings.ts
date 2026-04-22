/**
 * Một request cho toàn bộ cấu hình cần cho form đơn (khớp GET /api/settings/order-form).
 * Thay 6+ query song song: payment / sales channel / pricing / ship partner / thuế / chi nhánh.
 */
import { useQuery } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import type { Tax } from '@/lib/types/prisma-extended'
import { paymentMethodKeys } from '@/features/settings/payments/methods/hooks/use-payment-methods'
import { salesChannelKeys } from '@/features/settings/sales-channels/hooks/use-sales-channels'
import { pricingPolicyKeys } from '@/features/settings/pricing/hooks/use-pricing'
import { shippingPartnerKeys } from '@/features/settings/shipping/hooks/use-shipping'
import { taxKeys } from '@/features/settings/taxes/hooks/use-taxes'
import { branchKeys } from '@/features/settings/branches/hooks/use-branches'

export const orderFormSettingsKeys = {
  all: ['settings', 'order-form', 'combined'] as const,
}

export interface OrderFormSettingsBundle {
  paymentMethods: unknown[]
  salesChannels: unknown[]
  pricingPolicies: unknown[]
  shippingPartners: unknown[]
  taxes: Tax[]
  shippingSettings: unknown
  generalSettings: Record<string, unknown>
  branches: unknown[]
  units: unknown[]
  productTypes: unknown[]
}

async function fetchOrderFormSettings(): Promise<OrderFormSettingsBundle> {
  const r = await fetch('/api/settings/order-form')
  if (!r.ok) {
    const text = await r.text().catch(() => '')
    throw new Error(text || 'Failed to load order form settings')
  }
  return r.json() as Promise<OrderFormSettingsBundle>
}

/**
 * Cấu hình gộp + hydrate cache React Query để màn /settings cùng key không refetch tức thì nếu đã warm.
 */
export function useOrderFormSettingsData(options?: { enabled?: boolean }) {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: orderFormSettingsKeys.all,
    queryFn: fetchOrderFormSettings,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled !== false,
  })

  const data = query.data

  React.useLayoutEffect(() => {
    if (!data) return
    // Khớp shape từng API list để hook khác (sau này) dùng cache thống nhất
    queryClient.setQueryData(paymentMethodKeys.list({ isActive: true }), {
      data: data.paymentMethods,
      pagination: {
        page: 1,
        limit: data.paymentMethods.length,
        total: data.paymentMethods.length,
        totalPages: 1,
      },
    })
    queryClient.setQueryData(salesChannelKeys.list({}), {
      data: data.salesChannels,
      pagination: {
        page: 1,
        limit: data.salesChannels.length,
        total: data.salesChannels.length,
        totalPages: 1,
      },
    })
    queryClient.setQueryData([...pricingPolicyKeys.all, 'all'], data.pricingPolicies)
    queryClient.setQueryData([...shippingPartnerKeys.all, 'all'], data.shippingPartners)
    queryClient.setQueryData(taxKeys.lists(), data.taxes)
    queryClient.setQueryData([...branchKeys.all, 'all'], data.branches)
  }, [data, queryClient])

  const getDefaultSale = React.useCallback((): Tax | undefined => {
    if (!data?.taxes) return undefined
    return data.taxes.find((t) => t.isDefaultSale)
  }, [data?.taxes])

  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    getDefaultSale,
  }
}
