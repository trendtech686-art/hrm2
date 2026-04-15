/**
 * Consolidated Products Page Reference Data API
 * 
 * Returns all reference data needed by the products LIST page in a single request.
 * Replaces 5 separate API calls:
 *   - GET /api/categories?limit=0        (for filter dropdown + column lookups)
 *   - GET /api/brands?limit=0            (for column lookups)
 *   - GET /api/suppliers?limit=0         (for column lookups)
 *   - GET /api/settings/pricing-policies (for dynamic price columns)
 *   - GET /api/settings/store-info       (for print label)
 */

import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess } from '@/lib/api-utils'
import { serializeDecimals } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

export const GET = apiHandler(async () => {
    const [
      categories,
      brands,
      suppliers,
      pricingPolicies,
      storeInfoSetting,
    ] = await Promise.all([
      // Categories - for filter dropdown + column display
      prisma.category.findMany({
        where: { isDeleted: false },
        orderBy: { sortOrder: 'asc' },
        select: {
          systemId: true,
          name: true,
          path: true,
          parentId: true,
          isActive: true,
        },
      }),
      // Brands - for column display (just id + name)
      prisma.brand.findMany({
        where: { isDeleted: false },
        orderBy: { name: 'asc' },
        select: {
          systemId: true,
          name: true,
        },
      }),
      // Suppliers - for column display (just id + name)
      prisma.supplier.findMany({
        where: { isDeleted: false },
        orderBy: { name: 'asc' },
        select: {
          systemId: true,
          name: true,
        },
      }),
      // Pricing policies - for dynamic price columns
      prisma.pricingPolicy.findMany({
        orderBy: { name: 'asc' },
        select: {
          systemId: true,
          name: true,
          type: true,
          isActive: true,
          isDefault: true,
        },
      }),
      // Store info - for print label functionality
      prisma.setting.findUnique({
        where: {
          key_group: {
            key: 'store-info',
            group: 'store',
          },
        },
      }),
    ])

    // Parse store info from Setting JSON value
    const storeInfo = storeInfoSetting
      ? (storeInfoSetting.value as Record<string, unknown>)
      : null;

    return apiSuccess(serializeDecimals({
      categories,
      brands,
      suppliers,
      pricingPolicies,
      storeInfo,
    }))
})
