/**
 * Consolidated Product Form Reference Data API
 * Returns all reference data needed by the product create/edit form in a single request.
 * 
 * Replaces 9 separate API calls:
 * - GET /api/units?page=1
 * - GET /api/suppliers?page=1&limit=0
 * - GET /api/storage-locations?page=1
 * - GET /api/settings/product-types?page=1
 * - GET /api/brands?page=1
 * - GET /api/categories?page=1
 * - GET /api/settings/pricing-policies?page=1
 * - GET /api/settings/inventory-sla
 * - GET /api/settings/logistics
 */

import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

const DEFAULT_SLA_SETTINGS = {
  defaultReorderLevel: 10,
  defaultSafetyStock: 5,
  defaultMaxStock: 100,
  deadStockDays: 90,
  slowMovingDays: 30,
  enableEmailAlerts: false,
  alertEmailRecipients: [] as string[],
  alertFrequency: 'daily',
  showOnDashboard: true,
  dashboardAlertTypes: ['out_of_stock', 'low_stock', 'below_safety'],
}

const DEFAULT_LOGISTICS_SETTINGS = {
  physicalDefaults: { weight: 500, weightUnit: 'g', length: 30, width: 20, height: 10 },
  comboDefaults: { weight: 1000, weightUnit: 'g', length: 35, width: 25, height: 15 },
}

export const GET = apiHandler(async () => {
    const [
      units,
      suppliers,
      storageLocationsRaw,
      productTypes,
      brands,
      categories,
      pricingPolicies,
      slaSetting,
      logisticsSetting,
    ] = await Promise.all([
      // 1. Units - all
      prisma.unit.findMany({ orderBy: { name: 'asc' } }),
      // 2. Suppliers - all active (not deleted), just id+name for dropdown
      prisma.supplier.findMany({
        where: { isDeleted: false },
        orderBy: { name: 'asc' },
        select: { systemId: true, id: true, name: true },
      }),
      // 3. Storage locations - all active (not deleted)
      prisma.settingsData.findMany({
        where: { type: 'storage-location', isDeleted: false },
        orderBy: { name: 'asc' },
      }),
      // 4. Product types - all active (not deleted)
      prisma.settingsData.findMany({
        where: { type: 'product-type', isDeleted: false },
        orderBy: { name: 'asc' },
      }),
      // 5. Brands - all active (not deleted)
      prisma.brand.findMany({
        where: { isDeleted: false },
        orderBy: { name: 'asc' },
      }),
      // 6. Categories - all active (not deleted), with path info
      prisma.category.findMany({
        where: { isDeleted: false },
        orderBy: { sortOrder: 'asc' },
        include: {
          parent: true,
          _count: { select: { productCategories: true, children: true } },
        },
      }),
      // 7. Pricing policies - all
      prisma.pricingPolicy.findMany({
        orderBy: { name: 'asc' },
      }),
      // 8. SLA settings
      prisma.setting.findFirst({ where: { key: 'inventory-sla-settings' } }),
      // 9. Logistics settings
      prisma.setting.findFirst({ where: { key: 'logistics-settings' } }),
    ])

    // Transform storage locations (merge metadata)
    const storageLocations = storageLocationsRaw.map(item => ({
      ...item,
      ...((item.metadata as Record<string, unknown>) || {}),
    }))

    // Transform pricing policies dates
    const transformedPolicies = pricingPolicies.map(p => ({
      systemId: p.systemId,
      id: p.id,
      name: p.name,
      type: p.type,
      description: p.description,
      isDefault: p.isDefault,
      isActive: p.isActive,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      createdBy: p.createdBy,
      updatedBy: p.updatedBy,
    }))

    return apiSuccess({
      units,
      suppliers,
      storageLocations,
      productTypes,
      brands,
      categories,
      pricingPolicies: transformedPolicies,
      slaSettings: slaSetting
        ? (slaSetting.value as typeof DEFAULT_SLA_SETTINGS)
        : DEFAULT_SLA_SETTINGS,
      logisticsSettings: logisticsSetting
        ? (logisticsSetting.value as typeof DEFAULT_LOGISTICS_SETTINGS)
        : DEFAULT_LOGISTICS_SETTINGS,
    })
})
