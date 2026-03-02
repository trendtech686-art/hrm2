import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { NextRequest } from 'next/server'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/settings/employees/salary-components/[systemId]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params

  try {
    const component = await prisma.settingsData.findUnique({
      where: { systemId },
    })

    if (!component || component.type !== 'salary_benefit') {
      return apiNotFound('Thành phần lương')
    }

    const metadata = component.metadata as Record<string, unknown>
    return apiSuccess({
      systemId: component.systemId,
      id: component.id,
      name: component.name,
      description: component.description,
      category: metadata?.category ?? 'earning',
      type: metadata?.type ?? 'fixed',
      amount: metadata?.amount ?? 0,
      formula: metadata?.formula ?? null,
      taxable: metadata?.taxable ?? true,
      partOfSocialInsurance: metadata?.partOfSocialInsurance ?? false,
      isActive: component.isActive,
      sortOrder: (metadata?.sortOrder as number) ?? 0,
      applicableDepartmentSystemIds: [],
      createdAt: component.createdAt,
      updatedAt: component.updatedAt,
    })
  } catch (error) {
    console.error('Error fetching salary component:', error)
    return apiError('Failed to fetch salary component', 500)
  }
}

// PATCH /api/settings/employees/salary-components/[systemId]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params

  try {
    const body = await request.json()
    
    const existing = await prisma.settingsData.findUnique({
      where: { systemId },
    })

    if (!existing || existing.type !== 'salary_benefit') {
      return apiNotFound('Thành phần lương')
    }

    const existingMetadata = existing.metadata as Record<string, unknown>

    const component = await prisma.settingsData.update({
      where: { systemId },
      data: {
        name: body.name ?? existing.name,
        description: body.description ?? existing.description,
        isActive: body.isActive ?? existing.isActive,
        metadata: {
          sortOrder: body.sortOrder ?? existingMetadata?.sortOrder ?? 0,
          ...existingMetadata,
          category: body.category ?? existingMetadata?.category,
          type: body.type ?? existingMetadata?.type,
          amount: body.amount ?? existingMetadata?.amount,
          formula: body.formula ?? existingMetadata?.formula,
          taxable: body.taxable ?? existingMetadata?.taxable,
          partOfSocialInsurance: body.partOfSocialInsurance ?? existingMetadata?.partOfSocialInsurance,
        },
        updatedBy: session.user?.id,
      },
    })

    const metadata = component.metadata as Record<string, unknown>
    return apiSuccess({
      systemId: component.systemId,
      id: component.id,
      name: component.name,
      description: component.description,
      category: metadata?.category ?? 'earning',
      type: metadata?.type ?? 'fixed',
      amount: metadata?.amount ?? 0,
      formula: metadata?.formula ?? null,
      taxable: metadata?.taxable ?? true,
      partOfSocialInsurance: metadata?.partOfSocialInsurance ?? false,
      isActive: component.isActive,
      sortOrder: (metadata?.sortOrder as number) ?? 0,
      applicableDepartmentSystemIds: [],
      createdAt: component.createdAt,
      updatedAt: component.updatedAt,
    })
  } catch (error) {
    console.error('Error updating salary component:', error)
    return apiError('Failed to update salary component', 500)
  }
}

// DELETE /api/settings/employees/salary-components/[systemId]
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params

  try {
    const existing = await prisma.settingsData.findUnique({
      where: { systemId },
    })

    if (!existing || existing.type !== 'salary_benefit') {
      return apiNotFound('Thành phần lương')
    }

    // Soft delete
    await prisma.settingsData.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        updatedBy: session.user?.id,
      },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    console.error('Error deleting salary component:', error)
    return apiError('Failed to delete salary component', 500)
  }
}
