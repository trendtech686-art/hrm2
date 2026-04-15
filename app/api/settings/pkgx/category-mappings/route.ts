import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { v4 as uuidv4 } from 'uuid'
import { createCategoryMappingSchema } from './validation'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

// GET /api/settings/pkgx/category-mappings - List all category mappings
export async function GET(_request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const mappings = await prisma.pkgxCategoryMapping.findMany({
      where: { isActive: true },
      include: {
        pkgxCategory: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return apiSuccess({ 
      data: mappings,
      total: mappings.length,
    })
  } catch (error) {
    logError('Error fetching category mappings', error)
    return apiError('Failed to fetch category mappings', 500)
  }
}

// POST /api/settings/pkgx/category-mappings - Create a new category mapping
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createCategoryMappingSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }

  try {
    const { hrmCategoryId, hrmCategoryName, pkgxCategoryId, pkgxCategoryName } = validation.data

    // Check if mapping already exists
    const existing = await prisma.pkgxCategoryMapping.findFirst({
      where: {
        OR: [
          { hrmCategoryId },
          { pkgxCategoryId },
        ],
      },
    })

    if (existing) {
      return apiError('Mapping already exists for this HRM category or PKGX category', 409)
    }

    const mapping = await prisma.pkgxCategoryMapping.create({
      data: {
        systemId: uuidv4(),
        hrmCategoryId,
        hrmCategoryName: hrmCategoryName || '',
        pkgxCategoryId,
        pkgxCategoryName: pkgxCategoryName || '',
        createdBy: session.user?.id,
      },
      include: {
        pkgxCategory: true,
      },
    })

    createActivityLog({
      entityType: 'pkgx_settings',
      entityId: mapping.systemId,
      action: `Thêm mapping danh mục: ${hrmCategoryName || ''} ↔ ${pkgxCategoryName || ''}`,
      actionType: 'create',
      createdBy: session.user?.id ?? '',
    }).catch(e => logError('category-mapping activity log failed', e))

    return apiSuccess({ data: mapping }, 201)
  } catch (error) {
    logError('Error creating category mapping', error)
    return apiError('Failed to create category mapping', 500)
  }
}

// DELETE /api/settings/pkgx/category-mappings - Delete a category mapping
export async function DELETE(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const systemId = searchParams.get('systemId')
    const hrmCategoryId = searchParams.get('hrmCategoryId')

    if (!systemId && !hrmCategoryId) {
      return apiError('systemId or hrmCategoryId is required', 400)
    }

    // Read before delete for logging
    const existing = await prisma.pkgxCategoryMapping.findFirst({
      where: systemId ? { systemId } : { hrmCategoryId: hrmCategoryId! },
    })

    const deleted = await prisma.pkgxCategoryMapping.deleteMany({
      where: systemId 
        ? { systemId }
        : { hrmCategoryId: hrmCategoryId! },
    })

    if (existing) {
      createActivityLog({
        entityType: 'pkgx_settings',
        entityId: existing.systemId,
        action: `Xóa mapping danh mục: ${existing.hrmCategoryName} ↔ ${existing.pkgxCategoryName}`,
        actionType: 'delete',
        createdBy: session.user?.id ?? '',
      }).catch(e => logError('category-mapping delete activity log failed', e))
    }

    return apiSuccess({ deleted: deleted.count })
  } catch (error) {
    logError('Error deleting category mapping', error)
    return apiError('Failed to delete category mapping', 500)
  }
}
