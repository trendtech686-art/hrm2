/**
 * Complaints Settings API
 * Stores SLA settings, notification settings, tracking settings, and reminder settings
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Setting types
type ComplaintsSettingType = 'sla' | 'notifications' | 'tracking' | 'reminders' | 'templates'

const SETTING_KEYS: Record<ComplaintsSettingType, string> = {
  'sla': 'complaints_sla_settings',
  'notifications': 'complaints_notification_settings',
  'tracking': 'complaints_tracking_settings',
  'reminders': 'complaints_reminder_settings',
  'templates': 'complaints_templates',
}

const GROUP = 'complaints'

// Default values
const DEFAULTS: Record<ComplaintsSettingType, any> = {
  'sla': {
    low: { responseTime: 240, resolveTime: 48 },
    medium: { responseTime: 120, resolveTime: 24 },
    high: { responseTime: 60, resolveTime: 12 },
    urgent: { responseTime: 30, resolveTime: 4 },
  },
  'notifications': {
    emailOnCreate: true,
    emailOnAssign: true,
    emailOnVerified: false,
    emailOnResolved: true,
    emailOnOverdue: true,
    smsOnOverdue: false,
    inAppNotifications: true,
  },
  'tracking': {
    enabled: false,
    allowCustomerComments: false,
    showEmployeeName: true,
    showTimeline: true,
  },
  'reminders': {
    enabled: true,
    intervals: {
      firstReminder: 4,
      secondReminder: 8,
      escalation: 24,
    },
    notifyAssignee: true,
    notifyCreator: true,
    notifyManager: true,
  },
  'templates': [],
}

// GET /api/complaints-settings?type=sla
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const type = request.nextUrl.searchParams.get('type') as ComplaintsSettingType
    
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
    console.error('[COMPLAINTS-SETTINGS] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/complaints-settings
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
        type: 'complaints',
        group: GROUP,
        category: 'system',
        description: `Complaints ${type} settings`,
      }
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[COMPLAINTS-SETTINGS] POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
