/**
 * Tasks Settings API
 * Stores SLA settings, notification settings, card colors, evidence settings, etc.
 */

import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

// Setting types
type TasksSettingType = 'sla' | 'notifications' | 'reminders' | 'cardColors' | 'taskTypes' | 'templates' | 'evidence'

const SETTING_KEYS: Record<TasksSettingType, string> = {
  'sla': 'tasks_sla_settings',
  'notifications': 'tasks_notification_settings',
  'reminders': 'tasks_reminder_settings',
  'cardColors': 'tasks_card_color_settings',
  'taskTypes': 'tasks_task_types',
  'templates': 'tasks_templates',
  'evidence': 'tasks_evidence_settings',
}

const GROUP = 'tasks'

// Default values
const DEFAULTS: Record<TasksSettingType, unknown> = {
  'sla': {
    low: { responseTime: 480, resolveTime: 72 },
    medium: { responseTime: 240, resolveTime: 48 },
    high: { responseTime: 120, resolveTime: 24 },
    urgent: { responseTime: 60, resolveTime: 8 },
  },
  'notifications': {
    emailOnCreate: true,
    emailOnAssign: true,
    emailOnStatusChange: true,
    emailOnComment: false,
    emailOnOverdue: true,
    inAppNotifications: true,
  },
  'reminders': {
    enabled: true,
    intervals: {
      firstReminder: 24,
      secondReminder: 48,
      escalation: 72,
    },
    notifyAssignee: true,
    notifyCreator: true,
    notifyManager: true,
  },
  'cardColors': {
    statusColors: {
      pending: '#fbbf24',
      'in-progress': '#3b82f6',
      completed: '#22c55e',
      cancelled: '#ef4444',
    },
    priorityColors: {
      low: '#94a3b8',
      medium: '#fbbf24',
      high: '#f97316',
      urgent: '#ef4444',
    },
    overdueColor: '#dc2626',
    enableStatusColors: true,
    enablePriorityColors: false,
    enableOverdueColor: true,
  },
  'taskTypes': [],
  'templates': [],
  'evidence': {
    requiredForCompletion: false,
    allowedTypes: ['image', 'document', 'link'],
    maxFiles: 5,
    maxFileSize: 10,
  },
}

// GET /api/tasks-settings?type=sla
export async function GET(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const type = request.nextUrl.searchParams.get('type') as TasksSettingType
    
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
    console.error('[TASKS-SETTINGS] GET error:', error)
    return apiError('Internal server error', 500)
  }
}

// POST /api/tasks-settings
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
        type: 'tasks',
        group: GROUP,
        category: 'system',
        description: `Tasks ${type} settings`,
      }
    })

    return apiSuccess({ success: true, data })
  } catch (error) {
    console.error('[TASKS-SETTINGS] POST error:', error)
    return apiError('Internal server error', 500)
  }
}
