/**
 * Warranty Settings API
 * Stores SLA targets, notification settings, tracking settings, and reminder templates
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Setting types
type WarrantySettingType = 'sla-targets' | 'notifications' | 'tracking' | 'reminder-templates'

const SETTING_KEYS: Record<WarrantySettingType, string> = {
  'sla-targets': 'warranty_sla_targets',
  'notifications': 'warranty_notification_settings',
  'tracking': 'warranty_tracking_settings',
  'reminder-templates': 'warranty_reminder_templates',
}

const GROUP = 'warranty'

// Default values
const DEFAULTS: Record<WarrantySettingType, any> = {
  'sla-targets': {
    response: 2 * 60,      // 2 hours
    processing: 24 * 60,   // 24 hours
    return: 48 * 60,       // 48 hours
  },
  'notifications': {
    emailOnCreate: true,
    emailOnAssign: true,
    emailOnProcessing: false,
    emailOnProcessed: true,
    emailOnReturned: true,
    emailOnOverdue: true,
    smsOnOverdue: false,
    inAppNotifications: true,
    reminderNotifications: true,
  },
  'tracking': {
    enabled: false,
    allowCustomerComments: false,
    showEmployeeName: true,
    showTimeline: true,
  },
  'reminder-templates': [],
}

// GET /api/warranty-settings?type=sla-targets
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const type = request.nextUrl.searchParams.get('type') as WarrantySettingType
    
    if (!type || !SETTING_KEYS[type]) {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

    const setting = await prisma.setting.findUnique({
      where: {
        key_group: {
          key: SETTING_KEYS[type],
          group: GROUP,
        }
      }
    })

    if (!setting) {
      return NextResponse.json(DEFAULTS[type])
    }

    return NextResponse.json(setting.value)
  } catch (error) {
    console.error('[WARRANTY-SETTINGS] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/warranty-settings
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, data } = await request.json()
    
    if (!type || !SETTING_KEYS[type]) {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Data is required' }, { status: 400 })
    }

    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEYS[type],
          group: GROUP,
        }
      },
      update: {
        value: data,
        updatedAt: new Date(),
      },
      create: {
        key: SETTING_KEYS[type],
        value: data,
        type: 'warranty',
        group: GROUP,
        category: 'system',
        description: `Warranty ${type} settings`,
      }
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[WARRANTY-SETTINGS] POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
