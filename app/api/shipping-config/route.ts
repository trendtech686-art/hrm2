/**
 * Shipping Config API
 * Stores shipping partners configuration
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const setting = await prisma.setting.findUnique({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: GROUP,
        }
      }
    })

    if (!setting) {
      return NextResponse.json(DEFAULT_CONFIG)
    }

    return NextResponse.json(setting.value)
  } catch (error) {
    console.error('[SHIPPING-CONFIG] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/shipping-config
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const config = await request.json()
    
    if (!config) {
      return NextResponse.json({ error: 'Config is required' }, { status: 400 })
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

    return NextResponse.json({ success: true, lastUpdated: config.lastUpdated })
  } catch (error) {
    console.error('[SHIPPING-CONFIG] POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
