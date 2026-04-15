import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { v4 as uuidv4 } from 'uuid'
import { createBrandMappingSchema } from './validation'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

// GET /api/settings/pkgx/brand-mappings - List all brand mappings
export async function GET(_request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const mappings = await prisma.pkgxBrandMapping.findMany({
      where: { isActive: true },
      include: {
        pkgxBrand: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return apiSuccess({ 
      data: mappings,
      total: mappings.length,
    })
  } catch (error) {
    logError('Error fetching brand mappings', error)
    return apiError('Failed to fetch brand mappings', 500)
  }
}

// POST /api/settings/pkgx/brand-mappings - Create a new brand mapping
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createBrandMappingSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }

  try {
    const { hrmBrandId, hrmBrandName, pkgxBrandId, pkgxBrandName } = validation.data

    // Check if mapping already exists
    const existing = await prisma.pkgxBrandMapping.findFirst({
      where: {
        OR: [
          { hrmBrandId },
          { pkgxBrandId },
        ],
      },
    })

    if (existing) {
      return apiError('Mapping already exists for this HRM brand or PKGX brand', 409)
    }

    const mapping = await prisma.pkgxBrandMapping.create({
      data: {
        systemId: uuidv4(),
        hrmBrandId,
        hrmBrandName: hrmBrandName || '',
        pkgxBrandId,
        pkgxBrandName: pkgxBrandName || '',
        createdBy: session.user?.id,
      },
      include: {
        pkgxBrand: true,
      },
    })

    createActivityLog({
      entityType: 'pkgx_settings',
      entityId: mapping.systemId,
      action: `Thêm mapping thương hiệu: ${hrmBrandName || ''} ↔ ${pkgxBrandName || ''}`,
      actionType: 'create',
      createdBy: session.user?.id ?? '',
    }).catch(e => logError('brand-mapping activity log failed', e))

    return apiSuccess({ data: mapping }, 201)
  } catch (error) {
    logError('Error creating brand mapping', error)
    return apiError('Failed to create brand mapping', 500)
  }
}

// DELETE /api/settings/pkgx/brand-mappings - Delete a brand mapping
export async function DELETE(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const systemId = searchParams.get('systemId')
    const hrmBrandId = searchParams.get('hrmBrandId')

    if (!systemId && !hrmBrandId) {
      return apiError('systemId or hrmBrandId is required', 400)
    }

    // Read before delete for logging
    const existing = await prisma.pkgxBrandMapping.findFirst({
      where: systemId ? { systemId } : { hrmBrandId: hrmBrandId! },
    })

    const deleted = await prisma.pkgxBrandMapping.deleteMany({
      where: systemId 
        ? { systemId }
        : { hrmBrandId: hrmBrandId! },
    })

    if (existing) {
      createActivityLog({
        entityType: 'pkgx_settings',
        entityId: existing.systemId,
        action: `Xóa mapping thương hiệu: ${existing.hrmBrandName} ↔ ${existing.pkgxBrandName}`,
        actionType: 'delete',
        createdBy: session.user?.id ?? '',
      }).catch(e => logError('brand-mapping delete activity log failed', e))
    }

    return apiSuccess({ deleted: deleted.count })
  } catch (error) {
    logError('Error deleting brand mapping', error)
    return apiError('Failed to delete brand mapping', 500)
  }
}
