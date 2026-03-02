import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { generateIdWithPrefix } from '@/lib/id-generator'

const SETTING_KEY = 'employee-payroll-profiles'
const SETTING_GROUP = 'hrm'

interface PayrollProfile {
  employeeSystemId: string
  [key: string]: unknown
}

type RouteParams = { params: Promise<{ employeeSystemId: string }> }

// PATCH /api/employee-payroll-profiles/[employeeSystemId]
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { employeeSystemId } = await params
    const body = await request.json()

    // Get existing profiles
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const profiles = (setting?.value as PayrollProfile[]) || []
    const existingIndex = profiles.findIndex((p) => p.employeeSystemId === employeeSystemId)
    
    if (existingIndex >= 0) {
      profiles[existingIndex] = { ...profiles[existingIndex], ...body }
    } else {
      profiles.push({ employeeSystemId, ...body })
    }

    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: profiles as unknown as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        systemId: await generateIdWithPrefix('SPAYPROF', prisma),
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: profiles as unknown as Prisma.InputJsonValue,
        description: 'Employee payroll profiles',
      },
    })

    return apiSuccess({ data: profiles.find((p) => p.employeeSystemId === employeeSystemId) })
  } catch (error) {
    console.error('Error updating payroll profile:', error)
    return apiError('Failed to update payroll profile', 500)
  }
}

// DELETE /api/employee-payroll-profiles/[employeeSystemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { employeeSystemId } = await params

    // Get existing profiles
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const profiles = (setting?.value as PayrollProfile[]) || []
    const filteredProfiles = profiles.filter((p) => p.employeeSystemId !== employeeSystemId)

    await prisma.setting.update({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      data: {
        value: filteredProfiles as unknown as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    console.error('Error deleting payroll profile:', error)
    return apiError('Failed to delete payroll profile', 500)
  }
}
