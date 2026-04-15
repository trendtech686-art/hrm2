/**
 * Combined settings endpoint for Order Form page
 * ⚡ OPTIMIZED: Single request instead of multiple parallel requests
 * 
 * Returns all settings needed for creating/editing orders:
 * - paymentMethods (active only)
 * - salesChannels (applied only)
 * - pricingPolicies
 * - shippingPartners (active only)
 * - taxes (active only)
 * - shippingSettings
 * - generalSettings
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { cache, CACHE_TTL } from '@/lib/cache'
import { logError } from '@/lib/logger'

const CACHE_KEY = 'settings:order-form:combined'

export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    // Try cache first
    const cached = cache.get(CACHE_KEY)
    if (cached) {
      return apiSuccess(cached)
    }

    // Fetch all settings in parallel
    const [
      paymentMethods,
      salesChannels,
      pricingPolicies,
      shippingPartners,
      taxes,
      shippingSetting,
      generalSettings,
      branches,
      units,
      productTypes,
    ] = await Promise.all([
      // Payment methods - active only
      prisma.paymentMethod.findMany({
        where: { isActive: true },
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
        select: {
          id: true,
          systemId: true,
          name: true,
          isDefault: true,
          isActive: true,
        },
      }),
      
      // Sales channels - applied only
      prisma.salesChannel.findMany({
        where: { isApplied: true },
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
        select: {
          id: true,
          systemId: true,
          name: true,
          isDefault: true,
          isApplied: true,
        },
      }),
      
      // Pricing policies - all active
      prisma.pricingPolicy.findMany({
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
        select: {
          id: true,
          systemId: true,
          name: true,
          type: true,
          isDefault: true,
          isActive: true,
        },
      }),
      
      // Shipping partners - active only with services
      prisma.shippingPartner.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          systemId: true,
          name: true,
          code: true,
          isActive: true,
          // ✅ Include services (JSON field) - contains available shipping services
          services: true,
        },
      }),
      
      // Taxes - active only (with isDeleted check)
      prisma.tax.findMany({
        where: { isDeleted: false },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          systemId: true,
          name: true,
          rate: true,
          isDefaultSale: true,
          isDefaultPurchase: true,
        },
      }),
      
      // Shipping settings
      prisma.setting.findFirst({
        where: {
          key: 'shipping-settings',
          group: 'operations',
        },
      }),
      
      // General settings
      prisma.setting.findMany({
        where: { group: 'general' },
      }),
      
      // Branches - for branch selector
      prisma.branch.findMany({
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
        select: {
          id: true,
          systemId: true,
          name: true,
          isDefault: true,
          address: true,
          phone: true,
          province: true,
          provinceId: true,
          district: true,
          districtId: true,
          ward: true,
          wardCode: true,
        },
      }),
      
      // Units - for product unit selector
      prisma.unit.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          systemId: true,
          name: true,
          isActive: true,
        },
      }),
      
      // Product types - from settingsData table
      prisma.settingsData.findMany({
        where: { type: 'product-type', isDeleted: false },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          systemId: true,
          name: true,
        },
      }),
    ])

    // Transform general settings to key-value object
    const generalSettingsObj = generalSettings.reduce((acc: Record<string, unknown>, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {})

    const result = {
      paymentMethods,
      salesChannels,
      pricingPolicies,
      shippingPartners,
      taxes,
      shippingSettings: shippingSetting?.value ?? null,
      generalSettings: generalSettingsObj,
      branches,
      units,
      productTypes,
    }

    // Cache for 5 minutes
    cache.set(CACHE_KEY, result, CACHE_TTL.MEDIUM * 1000)
    
    return apiSuccess(result)
  } catch (error) {
    logError('Error fetching order form settings', error)
    return apiError('Failed to fetch order form settings', 500)
  }
}
