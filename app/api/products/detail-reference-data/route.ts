/**
 * Consolidated Products Detail Page Reference Data API
 * 
 * Returns all reference data needed by the product DETAIL page in a single request.
 * Replaces 6 separate API calls:
 *   - GET /api/categories?limit=0          (for category name display)
 *   - GET /api/brands?limit=0              (for brand name display)
 *   - GET /api/suppliers?limit=0           (for supplier name display)
 *   - GET /api/settings/pricing-policies   (for price display)
 *   - GET /api/branches?limit=0            (for inventory table)
 *   - GET /api/settings/store-info         (for print label)
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
      branches,
      storeInfoSetting,
    ] = await Promise.all([
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
      prisma.brand.findMany({
        where: { isDeleted: false },
        orderBy: { name: 'asc' },
        select: {
          systemId: true,
          name: true,
        },
      }),
      prisma.supplier.findMany({
        where: { isDeleted: false },
        orderBy: { name: 'asc' },
        select: {
          systemId: true,
          name: true,
        },
      }),
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
      prisma.branch.findMany({
        where: { isDeleted: false },
        orderBy: { name: 'asc' },
        select: {
          systemId: true,
          name: true,
          isDefault: true,
          address: true,
          phone: true,
        },
      }),
      prisma.setting.findUnique({
        where: {
          key_group: {
            key: 'store-info',
            group: 'store',
          },
        },
      }),
    ])

    const storeInfo = storeInfoSetting
      ? (storeInfoSetting.value as Record<string, unknown>)
      : null;

    return apiSuccess(serializeDecimals({
      categories,
      brands,
      suppliers,
      pricingPolicies,
      branches,
      storeInfo,
    }))
})
