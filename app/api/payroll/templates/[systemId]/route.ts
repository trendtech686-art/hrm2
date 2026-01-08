import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'
import type { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updatePayrollTemplateSchema } from '../validation'

const SETTING_KEY = 'payroll-templates'
const SETTING_GROUP = 'hrm'

interface PayrollTemplate {
  systemId: string
  [key: string]: unknown
}

type RouteParams = { params: Promise<{ systemId: string }> }

// GET /api/payroll/templates/[systemId]
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const templates = (setting?.value as PayrollTemplate[]) || []
    const template = templates.find((t) => t.systemId === systemId)

    if (!template) {
      return apiError('Template not found', 404)
    }

    return apiSuccess({ data: template })
  } catch (error) {
    console.error('Error fetching payroll template:', error)
    return apiError('Failed to fetch payroll template', 500)
  }
}

// PATCH /api/payroll/templates/[systemId]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updatePayrollTemplateSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const templates = (setting?.value as PayrollTemplate[]) || []
    const existingIndex = templates.findIndex((t) => t.systemId === systemId)
    
    if (existingIndex < 0) {
      return apiError('Template not found', 404)
    }

    templates[existingIndex] = { ...templates[existingIndex], ...body }

    await prisma.setting.update({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      data: {
        value: templates as unknown as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
    })

    return apiSuccess({ data: templates[existingIndex] })
  } catch (error) {
    console.error('Error updating payroll template:', error)
    return apiError('Failed to update payroll template', 500)
  }
}

// DELETE /api/payroll/templates/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const templates = (setting?.value as PayrollTemplate[]) || []
    const filteredTemplates = templates.filter((t) => t.systemId !== systemId)

    await prisma.setting.update({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      data: {
        value: filteredTemplates as unknown as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    console.error('Error deleting payroll template:', error)
    return apiError('Failed to delete payroll template', 500)
  }
}
