import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { cache, CACHE_TAGS } from '@/lib/cache'
import { revalidatePath } from '@/lib/revalidation'
import { createActivityLog } from '@/lib/services/activity-log-service'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/branches/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const branch = await prisma.branch.findUnique({
      where: { systemId },
      include: {
        employees: {
          where: { isDeleted: false },
          take: 10,
          select: {
            systemId: true,
            id: true,
            fullName: true,
            avatar: true,
            jobTitle: true,
            department: true,
          },
        },
        _count: { select: { employees: true } },
      },
    })

    if (!branch) {
      return apiNotFound('Chi nhánh')
    }

    return apiSuccess(branch)
  } catch (error) {
    logError('Error fetching branch', error)
    return apiError('Failed to fetch branch', 500)
  }
}

// PUT /api/branches/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    // Fetch existing data before update for change detection
    const existing = await prisma.branch.findUnique({
      where: { systemId },
      select: {
        name: true,
        address: true,
        phone: true,
        isDefault: true,
        managerId: true,
        province: true,
        provinceId: true,
        district: true,
        districtId: true,
        ward: true,
        wardCode: true,
        addressLevel: true,
      },
    })
    if (!existing) {
      return apiError('Chi nhánh không tồn tại', 404)
    }

    const branch = await prisma.branch.update({
      where: { systemId },
      data: {
        name: body.name,
        address: body.address,
        phone: body.phone,
        isDefault: body.isDefault,
        managerId: body.managerId ?? null,
        province: body.province ?? null,
        provinceId: body.provinceId ?? null,
        district: body.district ?? null,
        districtId: body.districtId ?? null,
        ward: body.ward ?? null,
        wardCode: body.wardCode ?? null,
        addressLevel: body.addressLevel ?? null,
      },
    })

    // Invalidate branches cache (memory + Next.js)
    cache.deletePattern('^branches:')
    revalidatePath('/api/branches')

    // Activity log with change detection
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existing.name) changes['Tên'] = { from: existing.name, to: body.name }
    if (body.address !== undefined && body.address !== existing.address) changes['Địa chỉ'] = { from: existing.address ?? '', to: body.address ?? '' }
    if (body.phone !== undefined && body.phone !== existing.phone) changes['Điện thoại'] = { from: existing.phone ?? '', to: body.phone ?? '' }
    if (body.isDefault !== undefined && body.isDefault !== existing.isDefault) changes['Mặc định'] = { from: existing.isDefault ? 'Có' : 'Không', to: body.isDefault ? 'Có' : 'Không' }
    if (body.managerId !== undefined && body.managerId !== existing.managerId) changes['Quản lý'] = { from: existing.managerId ?? '', to: body.managerId ?? '' }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'branch',
        entityId: systemId,
        action: `Cập nhật chi nhánh: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.employee?.fullName || session.user?.email || 'System',
      }).catch(e => logError('[branches] activity log failed', e))
    }

    return apiSuccess(branch)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Chi nhánh')
    }
    logError('Error updating branch', error)
    return apiError('Failed to update branch', 500)
  }
}

// DELETE /api/branches/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Soft delete
    await prisma.branch.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    // Invalidate branches cache (memory + Next.js)
    cache.deletePattern('^branches:')
    revalidatePath('/api/branches')

    createActivityLog({
      entityType: 'branch',
      entityId: systemId,
      action: 'deleted',
      actionType: 'delete',
      createdBy: session.user?.employee?.fullName || session.user?.email || 'System',
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Chi nhánh')
    }
    logError('Error deleting branch', error)
    return apiError('Failed to delete branch', 500)
  }
}
