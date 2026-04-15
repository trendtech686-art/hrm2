import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { NextRequest } from 'next/server'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

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

    if (!component || component.isDeleted) {
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
    logError('Error fetching salary component', error)
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

    if (!existing || existing.isDeleted) {
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

    // Activity log
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existing.name) changes['Tên'] = { from: existing.name, to: body.name }
    if (body.description !== undefined && body.description !== existing.description) changes['Mô tả'] = { from: existing.description, to: body.description }
    if (body.isActive !== undefined && body.isActive !== existing.isActive) changes['Trạng thái'] = { from: existing.isActive ? 'Hoạt động' : 'Ngừng', to: body.isActive ? 'Hoạt động' : 'Ngừng' }
    if (body.category !== undefined && body.category !== existingMetadata?.category) changes['Loại'] = { from: existingMetadata?.category, to: body.category }
    if (body.amount !== undefined && body.amount !== existingMetadata?.amount) changes['Số tiền'] = { from: existingMetadata?.amount, to: body.amount }
    if (body.taxable !== undefined && body.taxable !== existingMetadata?.taxable) changes['Chịu thuế'] = { from: existingMetadata?.taxable ? 'Có' : 'Không', to: body.taxable ? 'Có' : 'Không' }
    if (body.partOfSocialInsurance !== undefined && body.partOfSocialInsurance !== existingMetadata?.partOfSocialInsurance) changes['Tham gia BHXH'] = { from: existingMetadata?.partOfSocialInsurance ? 'Có' : 'Không', to: body.partOfSocialInsurance ? 'Có' : 'Không' }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      await createActivityLog({
        entityType: 'salary_component',
        entityId: systemId,
        action: `Cập nhật thành phần lương: ${existing.name}: ${changeDetail}`,
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
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
    logError('Error updating salary component', error)
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

    await createActivityLog({
      entityType: 'salary_component',
      entityId: systemId,
      action: `Xóa thành phần lương: ${existing.name}`,
      createdBy: session.user?.id,
    }).catch(e => logError('Failed to create activity log', e))

    return apiSuccess({ success: true })
  } catch (error) {
    logError('Error deleting salary component', error)
    return apiError('Failed to delete salary component', 500)
  }
}
