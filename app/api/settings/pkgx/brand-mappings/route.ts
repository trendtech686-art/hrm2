import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { v4 as uuidv4 } from 'uuid'
import { createBrandMappingSchema } from './validation'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { enrichBrandMappingsWithOrphanFlag } from '@/lib/pkgx/orphan-helpers'

// GET /api/settings/pkgx/brand-mappings - List all brand mappings
export async function GET(_request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const mappings = await prisma.pkgxBrandMapping.findMany({
      where: { isActive: true },
      select: {
        systemId: true,
        hrmBrandId: true,
        hrmBrandName: true,
        pkgxBrandId: true,
        pkgxBrandName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true,
        pkgxBrand: {
          select: {
            id: true,
            name: true,
            logo: true,
            description: true,
            siteUrl: true,
            sortOrder: true,
            isShow: true,
            keywords: true,
            metaTitle: true,
            metaDesc: true,
            shortDescription: true,
            longDescription: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Đánh cờ `hrmEntityMissing` cho mapping trỏ vào Brand HRM đã xoá/soft-delete.
    // UI sẽ render badge cảnh báo + nút "Dọn".
    const enriched = await enrichBrandMappingsWithOrphanFlag(mappings)

    return apiSuccess({
      data: enriched,
      total: enriched.length,
      orphanCount: enriched.filter((m) => m.hrmEntityMissing).length,
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
    const { searchParams } = new URL(request.url)
    // Nếu client xác nhận thay thế mapping orphan cũ (qua dialog confirm).
    const replaceOrphan = searchParams.get('replaceOrphan') === '1'

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
      // Nếu mapping cũ trỏ vào Brand HRM đã xoá ⇒ orphan ⇒ cho phép thay thế.
      const oldBrand = await prisma.brand.findUnique({
        where: { systemId: existing.hrmBrandId },
        select: { systemId: true, name: true, isDeleted: true },
      })
      const isOrphan = !oldBrand || oldBrand.isDeleted === true

      if (isOrphan && replaceOrphan) {
        // Transaction: xoá mapping orphan rồi tạo mapping mới.
        const mapping = await prisma.$transaction(async (tx) => {
          await tx.pkgxBrandMapping.delete({ where: { systemId: existing.systemId } })
          return tx.pkgxBrandMapping.create({
            data: {
              systemId: uuidv4(),
              hrmBrandId,
              hrmBrandName: hrmBrandName || '',
              pkgxBrandId,
              pkgxBrandName: pkgxBrandName || '',
              createdBy: session.user?.id,
            },
            select: {
              systemId: true,
              hrmBrandId: true,
              hrmBrandName: true,
              pkgxBrandId: true,
              pkgxBrandName: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
              createdBy: true,
              updatedBy: true,
              pkgxBrand: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                  description: true,
                  siteUrl: true,
                  sortOrder: true,
                  isShow: true,
                  keywords: true,
                  metaTitle: true,
                  metaDesc: true,
                  shortDescription: true,
                  longDescription: true,
                },
              },
            },
          })
        })
        createActivityLog({
          entityType: 'pkgx_settings',
          entityId: mapping.systemId,
          action: `Thay thế mapping thương hiệu orphan: ${existing.hrmBrandName} → ${hrmBrandName || ''}`,
          actionType: 'update',
          createdBy: session.user?.id ?? '',
        }).catch(e => logError('brand-mapping replace activity log failed', e))
        return apiSuccess({ data: mapping, replacedOrphan: true }, 201)
      }

      // Duplicate thật (brand cũ còn sống) hoặc orphan nhưng user chưa xác nhận.
      // Dùng NextResponse.json trực tiếp để đảm bảo payload `canReplace` / `existing`
      // đến được client ở cả dev lẫn production (apiError() strip details ở prod).
      const message = isOrphan
        ? 'Mapping cũ trỏ vào thương hiệu HRM đã xoá. Xác nhận thay thế bằng mapping mới?'
        : 'Mapping already exists for this HRM brand or PKGX brand'
      return NextResponse.json(
        {
          success: false,
          error: message,
          message,
          code: isOrphan ? 'MAPPING_ORPHAN_CONFLICT' : 'MAPPING_DUPLICATE',
          canReplace: isOrphan,
          existing: {
            systemId: existing.systemId,
            hrmBrandId: existing.hrmBrandId,
            hrmBrandName: existing.hrmBrandName,
            pkgxBrandId: existing.pkgxBrandId,
            pkgxBrandName: existing.pkgxBrandName,
            hrmEntityMissing: isOrphan,
          },
        },
        { status: 409 },
      )
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
      select: {
        systemId: true,
        hrmBrandId: true,
        hrmBrandName: true,
        pkgxBrandId: true,
        pkgxBrandName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true,
        pkgxBrand: {
          select: {
            id: true,
            name: true,
            logo: true,
            description: true,
            siteUrl: true,
            sortOrder: true,
            isShow: true,
            keywords: true,
            metaTitle: true,
            metaDesc: true,
            shortDescription: true,
            longDescription: true,
          },
        },
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
