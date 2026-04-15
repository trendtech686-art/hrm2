/**
 * Combined Print Data API
 * GET /api/settings/print-data
 * 
 * ⚡ PERFORMANCE: Single API call returning ALL data needed for printing:
 * - Store info (company name, logo, address, etc.)
 * - Print template configurations  
 * - General settings (currency, date format, etc.)
 * 
 * Replaces 3 separate calls:
 *   - /api/settings/store-info
 *   - /api/settings/print-template-config
 *   - /api/settings?group=general
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { cache, CACHE_TTL } from '@/lib/cache'

export const dynamic = 'force-dynamic'

// Default store info
const defaultStoreInfo = {
  companyName: '',
  brandName: '',
  logo: '',
  taxCode: '',
  registrationNumber: '',
  representativeName: '',
  representativeTitle: '',
  hotline: '',
  email: '',
  website: '',
  headquartersAddress: '',
  ward: '',
  district: '',
  province: '',
  note: '',
  bankAccountName: '',
  bankAccountNumber: '',
  bankName: '',
}

export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  // Try cache first
  const cacheKey = 'settings:print-data'
  const cached = cache.get(cacheKey)
  if (cached) {
    return apiSuccess(cached)
  }

  try {
    // Fetch all 3 settings in parallel
    const [storeInfoSetting, printTemplateSetting, generalSettings] = await Promise.all([
      // Store info
      prisma.setting.findUnique({
        where: {
          key_group: {
            key: 'store-info',
            group: 'store',
          },
        },
      }),
      // Print template config
      prisma.setting.findUnique({
        where: {
          key_group: {
            key: 'print_template_config',
            group: 'printer',
          },
        },
      }),
      // General settings
      prisma.setting.findMany({
        where: { group: 'general' },
      }),
    ])

    // Parse store info
    const storeInfoValue = storeInfoSetting?.value as Record<string, unknown> | null
    const storeInfo = {
      ...defaultStoreInfo,
      ...(storeInfoValue || {}),
      updatedAt: storeInfoSetting?.updatedAt?.toISOString() ?? null,
    }

    // Parse print template config
    let printTemplateConfig = { templates: {}, defaultSizes: {} }
    if (printTemplateSetting?.value) {
      try {
        const raw = typeof printTemplateSetting.value === 'string' 
          ? JSON.parse(printTemplateSetting.value) 
          : printTemplateSetting.value
        printTemplateConfig = {
          templates: raw?.templates || {},
          defaultSizes: raw?.defaultSizes || {},
        }
      } catch {
        // Keep default
      }
    }

    // Parse general settings into key-value object
    const general: Record<string, unknown> = {}
    for (const setting of generalSettings) {
      general[setting.key] = setting.value
    }

    const result = {
      storeInfo,
      printTemplateConfig,
      general,
    }

    // Cache for 30 minutes
    cache.set(cacheKey, result, CACHE_TTL.LONG * 1000)

    return apiSuccess(result)
  } catch (error) {
    logError('Error fetching print data', error)
    return apiError('Failed to fetch print data', 500)
  }
}
