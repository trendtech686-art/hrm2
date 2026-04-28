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
import {
  enrichBrandMappingsWithOrphanFlag,
  enrichCategoryMappingsWithOrphanFlag,
} from '@/lib/pkgx/orphan-helpers'

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
        select: {
          id: true,
          name: true,
          parentId: true,
          sortOrder: true,
          isShow: true,
          catDesc: true,
          longDesc: true,
          keywords: true,
          metaTitle: true,
          metaDesc: true,
          catAlias: true,
          style: true,
          grade: true,
          filterAttr: true,
          syncedAt: true,
          createdAt: true,
          updatedAt: true,
          mappings: {
            select: {
              systemId: true,
              hrmCategoryId: true,
              hrmCategoryName: true,
              pkgxCategoryId: true,
              pkgxCategoryName: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
              createdBy: true,
              updatedBy: true,
            },
          },
        },
      }),
      // 3. PKGX brands
      prisma.pkgxBrand.findMany({
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        select: {
          id: true,
          name: true,
          logo: true,
          description: true,
          siteUrl: true,
          sortOrder: true,
          isShow: true,
          keywords: true,
          metaTitle: true,
          metaDesc: true,
          shortDescription: true,
          longDescription: true,
          syncedAt: true,
          createdAt: true,
          updatedAt: true,
          mappings: {
            select: {
              systemId: true,
              hrmBrandId: true,
              hrmBrandName: true,
              pkgxBrandId: true,
              pkgxBrandName: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
              createdBy: true,
              updatedBy: true,
            },
          },
        },
      }),
      // 4. Category mappings (active only)
      prisma.pkgxCategoryMapping.findMany({
        where: { isActive: true },
        select: {
          systemId: true,
          hrmCategoryId: true,
          hrmCategoryName: true,
          pkgxCategoryId: true,
          pkgxCategoryName: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          createdBy: true,
          updatedBy: true,
          pkgxCategory: {
            select: {
              id: true,
              name: true,
              parentId: true,
              sortOrder: true,
              isShow: true,
              catDesc: true,
              longDesc: true,
              keywords: true,
              metaTitle: true,
              metaDesc: true,
              catAlias: true,
              style: true,
              grade: true,
              filterAttr: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      // 5. Brand mappings (active only)
      prisma.pkgxBrandMapping.findMany({
        where: { isActive: true },
        select: {
          systemId: true,
          hrmBrandId: true,
          hrmBrandName: true,
          pkgxBrandId: true,
          pkgxBrandName: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          createdBy: true,
          updatedBy: true,
          pkgxBrand: {
            select: {
              id: true,
              name: true,
              logo: true,
              description: true,
              siteUrl: true,
              sortOrder: true,
              isShow: true,
              keywords: true,
              metaTitle: true,
              metaDesc: true,
              shortDescription: true,
              longDescription: true,
            },
          },
        },
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

    // Orphan detection: mapping trỏ vào Brand/Category HRM đã xoá/soft-delete.
    // Chạy song song + cũng enrich mảng `mappings` nested bên trong categories/brands.
    const [
      enrichedCategoryMappings,
      enrichedBrandMappings,
      enrichedCategoriesMappingsNested,
      enrichedBrandsMappingsNested,
    ] = await Promise.all([
      enrichCategoryMappingsWithOrphanFlag(categoryMappings),
      enrichBrandMappingsWithOrphanFlag(brandMappings),
      enrichCategoryMappingsWithOrphanFlag(
        categories.flatMap((c) => c.mappings),
      ),
      enrichBrandMappingsWithOrphanFlag(
        brands.flatMap((b) => b.mappings),
      ),
    ])

    const catMappingById = new Map(
      enrichedCategoriesMappingsNested.map((m) => [m.systemId, m]),
    )
    const brandMappingById = new Map(
      enrichedBrandsMappingsNested.map((m) => [m.systemId, m]),
    )
    const categoriesWithOrphan = categories.map((c) => ({
      ...c,
      mappings: c.mappings.map((m) => catMappingById.get(m.systemId) ?? { ...m, hrmEntityMissing: false }),
    }))
    const brandsWithOrphan = brands.map((b) => ({
      ...b,
      mappings: b.mappings.map((m) => brandMappingById.get(m.systemId) ?? { ...m, hrmEntityMissing: false }),
    }))

    return apiSuccess({
      settings: lightSettings,
      categories: categoriesWithOrphan,
      brands: brandsWithOrphan,
      categoryMappings: enrichedCategoryMappings,
      brandMappings: enrichedBrandMappings,
      priceMappings: enrichedPriceMappings,
      orphanCount: {
        brand: enrichedBrandMappings.filter((m) => m.hrmEntityMissing).length,
        category: enrichedCategoryMappings.filter((m) => m.hrmEntityMissing).length,
      },
    })
  } catch (error) {
    logError('Error fetching consolidated PKGX mappings', error)
    return apiError('Failed to fetch PKGX mappings', 500)
  }
}
