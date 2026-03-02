import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { z } from 'zod'
import { generateIdWithPrefix } from '@/lib/id-generator'

const SETTING_KEY = 'payroll-templates'
const SETTING_GROUP = 'hrm'

// Validation schema for a single payroll template
const payrollTemplateSchema = z.object({
  systemId: z.string(),
  id: z.string(),
  name: z.string().min(1, 'Tên mẫu không được để trống'),
  description: z.string().optional(),
  componentSystemIds: z.array(z.string()),
  isDefault: z.boolean().default(false),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
})

// Validation schema for the entire templates array
const payrollTemplatesSchema = z.array(payrollTemplateSchema)

// GET /api/settings/payroll-templates - Get all payroll templates
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

    if (!setting || !setting.value) {
      return apiSuccess({ data: [] })
    }

    // Ensure we return an array
    const templates = Array.isArray(setting.value) ? setting.value : []
    return apiSuccess({ data: templates })
  } catch (error) {
    console.error('Error fetching payroll templates:', error)
    return apiError('Failed to fetch payroll templates', 500)
  }
}

// PUT /api/settings/payroll-templates - Update all payroll templates
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, payrollTemplatesSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const templates = validation.data

  try {
    const setting = await prisma.setting.upsert({
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
        systemId: await generateIdWithPrefix('SET_PAYTPL', prisma),
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: templates as unknown as Prisma.InputJsonValue,
        description: 'Payroll templates configuration',
      },
    })

    return apiSuccess({ data: setting.value })
  } catch (error) {
    console.error('Error saving payroll templates:', error)
    return apiError('Failed to save payroll templates', 500)
  }
}
