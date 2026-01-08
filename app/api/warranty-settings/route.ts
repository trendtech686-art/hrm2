/**
 * Warranty Settings API
 * Stores SLA targets, notification settings, tracking settings, and reminder templates
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateWarrantySettingsSchema } from './validation'

// Setting types
type WarrantySettingType = 'sla-targets' | 'notifications' | 'tracking' | 'reminder-templates'

const SETTING_KEYS: Record<WarrantySettingType, string> = {
  'sla-targets': 'warranty_sla_targets',
  'notifications': 'warranty_notification_settings',
  'tracking': 'warranty_tracking_settings',
  'reminder-templates': 'warranty_reminder_templates',
}

const GROUP = 'warranty'

// Type definitions for settings values
interface SlaTargets {
  response: number
  processing: number
  return: number
}

interface NotificationSettings {
  emailOnCreate: boolean
  emailOnAssign: boolean
  emailOnProcessing: boolean
  emailOnProcessed: boolean
  emailOnReturned: boolean
  emailOnOverdue: boolean
  smsOnOverdue: boolean
  inAppNotifications: boolean
  reminderNotifications: boolean
}

interface TrackingSettings {
  enabled: boolean
  allowCustomerComments: boolean
  showEmployeeName: boolean
  showTimeline: boolean
}

type WarrantySettingValue = SlaTargets | NotificationSettings | TrackingSettings | unknown[]

// Default values
const DEFAULTS: Record<WarrantySettingType, WarrantySettingValue> = {
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
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const type = request.nextUrl.searchParams.get('type') as WarrantySettingType
    
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
    console.error('[WARRANTY-SETTINGS] GET error:', error)
    return apiError('Internal server error', 500)
  }
}

// POST /api/warranty-settings
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateWarrantySettingsSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const { type, data } = validation.data

  try {
    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEYS[type],
          group: GROUP,
        }
      },
      update: {
        value: data as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        key: SETTING_KEYS[type],
        value: data as Prisma.InputJsonValue,
        type: 'warranty',
        group: GROUP,
        category: 'system',
        description: `Warranty ${type} settings`,
      }
    })

    return apiSuccess({ success: true, data })
  } catch (error) {
    console.error('[WARRANTY-SETTINGS] POST error:', error)
    return apiError('Internal server error', 500)
  }
}
