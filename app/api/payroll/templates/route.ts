import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { createPayrollTemplateSchema, bulkUpdatePayrollTemplatesSchema } from './validation'
import { generateIdWithPrefix } from '@/lib/id-generator'

const SETTING_KEY = 'payroll-templates'
const SETTING_GROUP = 'hrm'

// GET /api/payroll/templates - Get all payroll templates
export async function GET(_request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    if (!setting || !setting.value) {
      return apiSuccess({ data: [] })
    }

    return apiSuccess({ data: setting.value })
  } catch (error) {
    console.error('Error fetching payroll templates:', error)
    return apiError('Failed to fetch payroll templates', 500)
  }
}

// POST /api/payroll/templates - Create template
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createPayrollTemplateSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // Get existing templates
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const templates = (setting?.value as unknown[]) || []
    templates.push(body)

    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: templates as unknown as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        systemId: await generateIdWithPrefix('SPAYTPL', prisma),
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: templates as unknown as Prisma.InputJsonValue,
        description: 'Payroll templates',
      },
    })

    return apiSuccess({ data: body })
  } catch (error) {
    console.error('Error creating payroll template:', error)
    return apiError('Failed to create payroll template', 500)
  }
}

// PUT /api/payroll/templates - Bulk update templates
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, bulkUpdatePayrollTemplatesSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const { templates } = validation.data

  try {
    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: templates as unknown as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        systemId: await generateIdWithPrefix('SPAYTPL', prisma),
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: templates as unknown as Prisma.InputJsonValue,
        description: 'Payroll templates',
      },
    })

    return apiSuccess({ data: templates })
  } catch (error) {
    console.error('Error updating payroll templates:', error)
    return apiError('Failed to update payroll templates', 500)
  }
}
