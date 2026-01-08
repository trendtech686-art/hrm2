/**
 * Complaints Settings API
 * Stores SLA settings, notification settings, tracking settings, and reminder settings
 */

import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

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

// Type definitions for settings values
interface SlaSetting {
  responseTime: number
  resolveTime: number
}

interface SlaSettings {
  low: SlaSetting
  medium: SlaSetting
  high: SlaSetting
  urgent: SlaSetting
}

interface NotificationSettings {
  emailOnCreate: boolean
  emailOnAssign: boolean
  emailOnVerified: boolean
  emailOnResolved: boolean
  emailOnOverdue: boolean
  smsOnOverdue: boolean
  inAppNotifications: boolean
}

interface TrackingSettings {
  enabled: boolean
  allowCustomerComments: boolean
  showEmployeeName: boolean
  showTimeline: boolean
}

interface ReminderSettings {
  enabled: boolean
  intervals: {
    firstReminder: number
    secondReminder: number
    escalation: number
  }
  notifyAssignee: boolean
  notifyCreator: boolean
  notifyManager: boolean
}

type ComplaintsSettingValue = SlaSettings | NotificationSettings | TrackingSettings | ReminderSettings | unknown[]

// Default values
const DEFAULTS: Record<ComplaintsSettingType, ComplaintsSettingValue> = {
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
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const type = request.nextUrl.searchParams.get('type') as ComplaintsSettingType
    
    if (!type || !SETTING_KEYS[type]) {
      return apiError('Invalid type parameter', 400)
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
      return apiSuccess(DEFAULTS[type])
    }

    return apiSuccess(setting.value)
  } catch (error) {
    console.error('[COMPLAINTS-SETTINGS] GET error:', error)
    return apiError('Internal server error', 500)
  }
}

// POST /api/complaints-settings
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { type, data } = await request.json()
    
    if (!type || !SETTING_KEYS[type]) {
      return apiError('Invalid type parameter', 400)
    }

    if (!data) {
      return apiError('Data is required', 400)
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

    return apiSuccess({ success: true, data })
  } catch (error) {
    console.error('[COMPLAINTS-SETTINGS] POST error:', error)
    return apiError('Internal server error', 500)
  }
}
