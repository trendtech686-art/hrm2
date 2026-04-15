import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/brands/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const brand = await prisma.brand.findUnique({
      where: { systemId },
      include: {
        products: {
          where: { isDeleted: false },
          take: 10,
          select: {
            systemId: true,
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        _count: { select: { products: true } },
      },
    })

    if (!brand) {
      return apiNotFound('Thương hiệu')
    }

    return apiSuccess(brand)
  } catch (error) {
    logError('Error fetching brand', error)
    return apiError('Không thể tải thương hiệu', 500)
  }
}

// PUT /api/brands/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    const existing = await prisma.brand.findUnique({ where: { systemId } })
    if (!existing) return apiNotFound('Thương hiệu')

    const brand = await prisma.brand.update({
      where: { systemId },
      data: {
        name: body.name,
        description: body.description,
        logoUrl: body.logo || body.logoUrl,
        website: body.website,
      },
    })

    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existing.name) changes['Tên'] = { from: existing.name, to: body.name }
    if (body.description !== undefined && body.description !== existing.description) changes['Mô tả'] = { from: existing.description, to: body.description }
    if (body.website !== undefined && body.website !== existing.website) changes['Website'] = { from: existing.website, to: body.website }
    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'brand',
        entityId: systemId,
        action: `Cập nhật thương hiệu: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session?.user.id ?? '',
      }).catch(e => logError('[brands] activity log failed', e))
    }

    return apiSuccess(brand)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Thương hiệu')
    }
    logError('Error updating brand', error)
    return apiError('Không thể cập nhật thương hiệu', 500)
  }
}

// PATCH /api/brands/[systemId] - Same as PUT for partial updates
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    const existing = await prisma.brand.findUnique({ where: { systemId } })
    if (!existing) return apiNotFound('Thương hiệu')

    const brand = await prisma.brand.update({
      where: { systemId },
      data: {
        ...(body.id !== undefined && { id: body.id }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.logo !== undefined && { logoUrl: body.logo }),
        ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
        ...(body.website !== undefined && { website: body.website }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.seoTitle !== undefined && { seoTitle: body.seoTitle }),
        ...(body.metaDescription !== undefined && { metaDescription: body.metaDescription }),
        ...(body.shortDescription !== undefined && { shortDescription: body.shortDescription }),
        ...(body.longDescription !== undefined && { longDescription: body.longDescription }),
        ...(body.websiteSeo !== undefined && { websiteSeo: body.websiteSeo }),
      },
    })

    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existing.name) changes['Tên'] = { from: existing.name, to: body.name }
    if (body.description !== undefined && body.description !== existing.description) changes['Mô tả'] = { from: existing.description, to: body.description }
    if (body.website !== undefined && body.website !== existing.website) changes['Website'] = { from: existing.website, to: body.website }
    if (body.isActive !== undefined && body.isActive !== existing.isActive) changes['Trạng thái'] = { from: existing.isActive ? 'Hoạt động' : 'Ngừng', to: body.isActive ? 'Hoạt động' : 'Ngừng' }
    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'brand',
        entityId: systemId,
        action: `Cập nhật thương hiệu: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session?.user.id ?? '',
      }).catch(e => logError('[brands] activity log failed', e))
    }

    return apiSuccess(brand)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Thương hiệu')
    }
    logError('Error updating brand', error)
    return apiError('Không thể cập nhật thương hiệu', 500)
  }
}

// DELETE /api/brands/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const existing = await prisma.brand.findUnique({ where: { systemId } })

    // Use transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      // 1. Delete PKGX mapping for this brand
      await tx.pkgxBrandMapping.deleteMany({
        where: { hrmBrandId: systemId },
      })

      // 2. Soft delete the brand
      await tx.brand.update({
        where: { systemId },
        data: { isDeleted: true },
      })
    })

    if (existing) {
      createActivityLog({
        entityType: 'brand',
        entityId: systemId,
        action: `Xóa thương hiệu: ${existing.name}`,
        actionType: 'delete',
        createdBy: session?.user.id ?? '',
      }).catch(e => logError('[brands] activity log failed', e))
    }

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Thương hiệu')
    }
    logError('Error deleting brand', error)
    return apiError('Không thể xóa thương hiệu', 500)
  }
}
