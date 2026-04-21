import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'

export const dynamic = 'force-dynamic'

/**
 * POST /api/products/bulk
 * Bulk operations: delete (soft), restore, updateStatus
 * 
 * Body: { action: 'delete' | 'restore' | 'updateStatus', systemIds: string[], status?: string }
 */
export const POST = apiHandler(async (request, { session }) => {
    const body = await request.json()
    const { action, systemIds, status } = body as {
      action: 'delete' | 'restore' | 'updateStatus'
      systemIds: string[]
      status?: string
    }

    if (!action || !Array.isArray(systemIds) || systemIds.length === 0) {
      return apiError('Thiếu action hoặc systemIds', 400)
    }

    // Pre-fetch product names for activity log
    const products = await prisma.product.findMany({
      where: { systemId: { in: systemIds } },
      select: { systemId: true, name: true, id: true },
    })
    const productNames = products.map(p => p.name || p.id).slice(0, 5)

    let updatedCount = 0

    switch (action) {
      case 'delete': {
        // Transaction: khi soft-delete product, đồng thời "unlink" PKGX side
        // (PkgxProduct.hrmProductId) để UI "Đã liên kết" không còn coi là linked.
        // Lưu ý: KHÔNG clear `product.pkgxId` — giữ lại để lúc restore auto-relink được.
        const deleteResult = await prisma.$transaction(async (tx) => {
          await tx.pkgxProduct.updateMany({
            where: { hrmProductId: { in: systemIds } },
            data: { hrmProductId: null },
          })
          return tx.product.updateMany({
            where: { systemId: { in: systemIds } },
            data: { isDeleted: true, updatedAt: new Date() },
          })
        })
        updatedCount = deleteResult.count
        break
      }

      case 'restore': {
        // Transaction: khi restore, re-link PKGX side dựa vào `product.pkgxId`.
        const restoreResult = await prisma.$transaction(async (tx) => {
          const restored = await tx.product.findMany({
            where: { systemId: { in: systemIds }, pkgxId: { not: null } },
            select: { systemId: true, pkgxId: true },
          })
          for (const p of restored) {
            if (p.pkgxId != null) {
              await tx.pkgxProduct.updateMany({
                where: { id: p.pkgxId, hrmProductId: null },
                data: { hrmProductId: p.systemId },
              })
            }
          }
          return tx.product.updateMany({
            where: { systemId: { in: systemIds } },
            data: { isDeleted: false, updatedAt: new Date() },
          })
        })
        updatedCount = restoreResult.count
        break
      }

      case 'updateStatus': {
        if (!status) return apiError('Thiếu trạng thái cho hành động updateStatus', 400)
        const statusResult = await prisma.product.updateMany({
          where: { systemId: { in: systemIds }, isDeleted: false },
          data: { status: status as 'ACTIVE' | 'INACTIVE', updatedAt: new Date() },
        })
        updatedCount = statusResult.count
        break
      }

      default:
        return apiError(`Hành động không hợp lệ: ${action}`, 400)
    }

    // Fire-and-forget activity log
    const actionLabels: Record<string, string> = {
      delete: 'Xóa hàng loạt', restore: 'Khôi phục hàng loạt', updateStatus: 'Cập nhật trạng thái hàng loạt',
    }
    const suffix = products.length > 5 ? ` và ${products.length - 5} sản phẩm khác` : ''
    prisma.activityLog.create({
      data: {
        entityType: 'product',
        entityId: systemIds[0],
        action: action === 'delete' ? 'deleted' : 'updated',
        actionType: action === 'delete' ? 'delete' : 'update',
        note: `${actionLabels[action] || action}: ${productNames.join(', ')}${suffix} (${updatedCount} sản phẩm)`,
        createdBy: getSessionUserName(session),
      },
    }).catch(e => logError('Activity log failed', e))

    return apiSuccess({ success: true, updatedCount })
}, { permission: 'delete_products' })
