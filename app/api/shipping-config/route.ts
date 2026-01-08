/**
 * Shipping Config API
 * Stores shipping partners configuration
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

const SETTING_KEY = 'shipping_partners_config'
const GROUP = 'shipping'

const DEFAULT_CONFIG = {
  version: 2,
  partners: {
    GHN: { accounts: [] },
    GHTK: { accounts: [] },
    VTP: { accounts: [] },
    'J&T': { accounts: [] },
    SPX: { accounts: [] },
    VNPOST: { accounts: [] },
    NINJA_VAN: { accounts: [] },
    AHAMOVE: { accounts: [] },
  },
  global: {
    weight: { mode: 'FROM_PRODUCTS', customValue: 500 },
    dimensions: { length: 30, width: 20, height: 10 },
    requirement: 'ALLOW_CHECK_NOT_TRY',
    note: '',
    autoSyncCancelStatus: false,
    autoSyncCODCollection: false,
    latePickupWarningDays: 2,
    lateDeliveryWarningDays: 7,
  },
  lastUpdated: new Date().toISOString(),
}

// GET /api/shipping-config
export async function GET(_request: Request) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const setting = await prisma.setting.findUnique({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: GROUP,
        }
      }
    })

    if (!setting) {
      return apiSuccess(DEFAULT_CONFIG)
    }

    return apiSuccess(setting.value)
  } catch (error) {
    console.error('[SHIPPING-CONFIG] GET error:', error)
    return apiError('Internal server error', 500)
  }
}

// POST /api/shipping-config
export async function POST(request: Request) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const config = await request.json()
    
    if (!config) {
      return apiError('Config is required', 400)
    }

    // Update lastUpdated
    config.lastUpdated = new Date().toISOString()

    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: GROUP,
        }
      },
      update: {
        value: config,
        updatedAt: new Date(),
      },
      create: {
        key: SETTING_KEY,
        value: config,
        type: 'shipping',
        group: GROUP,
        category: 'system',
        description: 'Shipping partners configuration',
      }
    })

    return apiSuccess({ success: true, lastUpdated: config.lastUpdated })
  } catch (error) {
    console.error('[SHIPPING-CONFIG] POST error:', error)
    return apiError('Internal server error', 500)
  }
}
