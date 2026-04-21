import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'
import { cache } from '@/lib/cache'
import { logError } from '@/lib/logger'

export const dynamic = 'force-dynamic'

/**
 * POST /api/brands/bulk
 * Bulk operations: delete (soft), activate, deactivate
 *
 * Body: { action: 'delete' | 'activate' | 'deactivate', systemIds: string[] }
 */
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { action, systemIds } = body as {
      action: 'delete' | 'activate' | 'deactivate'
      systemIds: string[]
    }

    if (!action || !Array.isArray(systemIds) || systemIds.length === 0) {
      return apiError('Thiếu action hoặc systemIds', 400)
    }

    let updatedCount = 0

    switch (action) {
      case 'delete': {
        // Transaction: dọn mapping PKGX trước để không để lại orphan (zombie)
        // khi brand bị soft-delete. Khớp với logic của DELETE /api/brands/[systemId].
        const result = await prisma.$transaction(async (tx) => {
          await tx.pkgxBrandMapping.deleteMany({
            where: { hrmBrandId: { in: systemIds } },
          })
          return tx.brand.updateMany({
            where: { systemId: { in: systemIds } },
            data: { isDeleted: true, updatedAt: new Date() },
          })
        })
        updatedCount = result.count
        break
      }

      case 'activate': {
        const result = await prisma.brand.updateMany({
          where: { systemId: { in: systemIds }, isDeleted: false },
          data: { isActive: true, updatedAt: new Date() },
        })
        updatedCount = result.count
        break
      }

      case 'deactivate': {
        const result = await prisma.brand.updateMany({
          where: { systemId: { in: systemIds }, isDeleted: false },
          data: { isActive: false, updatedAt: new Date() },
        })
        updatedCount = result.count
        break
      }

      default:
        return apiError(`Thao tác không hợp lệ: ${action}`, 400)
    }

    // Invalidate brands cache
    cache.deletePattern('^brands:')

    return apiSuccess({ success: true, updatedCount })
  } catch (error) {
    logError('Bulk brands error', error)
    return apiError('Không thể thực hiện thao tác hàng loạt', 500)
  }
}
