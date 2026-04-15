/**
 * Consolidated PKGX Mappings API
 * Returns all PKGX mapping data in a single request.
 * Replaces 6 separate API calls:
 * - GET /api/pkgx/settings
 * - GET /api/settings/pkgx/categories
 * - GET /api/settings/pkgx/brands
 * - GET /api/settings/pkgx/category-mappings
 * - GET /api/settings/pkgx/brand-mappings
 * - GET /api/pkgx/price-mappings
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

const SETTINGS_KEY = 'settings'
const SETTINGS_GROUP = 'pkgx'

export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const [
      setting,
      categories,
      brands,
      categoryMappings,
      brandMappings,
      priceMappings,
    ] = await Promise.all([
      // 1. PKGX base settings (from JSON blob)
      prisma.setting.findFirst({
        where: { key: SETTINGS_KEY, group: SETTINGS_GROUP },
      }),
      // 2. PKGX categories
      prisma.pkgxCategory.findMany({
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        include: { mappings: true },
      }),
      // 3. PKGX brands
      prisma.pkgxBrand.findMany({
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        include: { mappings: true },
      }),
      // 4. Category mappings (active only)
      prisma.pkgxCategoryMapping.findMany({
        where: { isActive: true },
        include: { pkgxCategory: true },
        orderBy: { createdAt: 'desc' },
      }),
      // 5. Brand mappings (active only)
      prisma.pkgxBrandMapping.findMany({
        where: { isActive: true },
        include: { pkgxBrand: true },
        orderBy: { createdAt: 'desc' },
      }),
      // 6. Price mappings (active only)
      prisma.pkgxPriceMapping.findMany({
        where: { isActive: true },
        orderBy: { priceType: 'asc' },
      }),
    ])

    // Process base settings - strip large fields
    const fullData = (setting?.value || {}) as Record<string, unknown>
    const { pkgxProducts: _products, logs: _logs, ...lightSettings } = fullData

    // Enrich price mappings with policy validation
    const policyIds = priceMappings.map(m => m.pricingPolicyId).filter(Boolean) as string[]
    const policies = policyIds.length > 0
      ? await prisma.pricingPolicy.findMany({
          where: { systemId: { in: policyIds }, isActive: true },
          select: { systemId: true, name: true },
        })
      : []
    const validPolicyIds = new Set(policies.map(p => p.systemId))

    const enrichedPriceMappings = priceMappings.map(m => {
      const isValid = m.pricingPolicyId && validPolicyIds.has(m.pricingPolicyId)
      return {
        ...m,
        pricingPolicyId: isValid ? m.pricingPolicyId : null,
        pricingPolicy: isValid ? policies.find(p => p.systemId === m.pricingPolicyId) : null,
      }
    })

    return apiSuccess({
      settings: lightSettings,
      categories,
      brands,
      categoryMappings,
      brandMappings,
      priceMappings: enrichedPriceMappings,
    })
  } catch (error) {
    logError('Error fetching consolidated PKGX mappings', error)
    return apiError('Failed to fetch PKGX mappings', 500)
  }
}
