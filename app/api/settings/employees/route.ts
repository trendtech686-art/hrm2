import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { employeeSettingsSchema } from './validation'

const SETTING_KEY = 'employee-settings'
const SETTING_GROUP = 'hrm'

// GET /api/settings/employees - Get employee settings
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    if (!setting) {
      return apiSuccess({ data: null })
    }

    return apiSuccess({ data: setting.value })
  } catch (error) {
    console.error('Error fetching employee settings:', error)
    return apiError('Failed to fetch employee settings', 500)
  }
}

// PUT /api/settings/employees - Update employee settings
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, employeeSettingsSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const settings = validation.data

  try {
    const setting = await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: settings as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        systemId: `SET_EMP_${Date.now()}`,
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: settings as Prisma.InputJsonValue,
        description: 'Employee management settings',
      },
    })

    return apiSuccess({ data: setting.value })
  } catch (error) {
    console.error('Error saving employee settings:', error)
    return apiError('Failed to save employee settings', 500)
  }
}
