/**
 * Combined settings endpoint for Sales Return Form page
 * ⚡ OPTIMIZED: Single request instead of 6+ parallel requests
 * 
 * Returns all settings needed for creating sales returns:
 * - branches (for branch selector)
 * - pricingPolicies (for exchange items pricing)
 * - cashAccounts (for refund account selector)
 * - paymentMethods (for refund method selector)
 * - productTypes (for product labels)
 * - units (for product unit display)
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { cache, CACHE_TTL } from '@/lib/cache'
import { logError } from '@/lib/logger'

const CACHE_KEY = 'settings:sales-return-form:combined'

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
      branches,
      pricingPolicies,
      cashAccounts,
      paymentMethods,
      productTypes,
      units,
    ] = await Promise.all([
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
      
      // Pricing policies - for exchange item pricing
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
      
      // Cash accounts - for refund account selector
      prisma.cashAccount.findMany({
        where: { isActive: true },
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
        select: {
          id: true,
          systemId: true,
          name: true,
          type: true,
          isDefault: true,
          branchSystemId: true,
        },
      }),
      
      // Payment methods - for refund method selector
      prisma.paymentMethod.findMany({
        where: { isActive: true },
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
        select: {
          id: true,
          systemId: true,
          name: true,
          type: true, // cash, bank, other
          isDefault: true,
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
      
      // Units - for product unit display
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
    ])

    const result = {
      branches,
      pricingPolicies,
      // Convert CashAccount type to lowercase for frontend consistency
      cashAccounts: cashAccounts.map(acc => ({
        ...acc,
        type: (acc.type || 'cash').toLowerCase(),
      })),
      // Map payment method type to lowercase
      paymentMethods: paymentMethods.map(pm => ({
        ...pm,
        type: (pm.type || 'other').toLowerCase(),
      })),
      productTypes,
      units,
    }

    // Cache for 5 minutes
    cache.set(CACHE_KEY, result, CACHE_TTL.MEDIUM * 1000)
    
    return apiSuccess(result)
  } catch (error) {
    logError('Error fetching sales return form settings', error)
    return apiError('Failed to fetch sales return form settings', 500)
  }
}
