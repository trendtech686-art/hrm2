/**
 * Confirm Reconciliation Sheet
 *
 * POST /api/reconciliation-sheets/[systemId]/confirm
 * - Changes status from DRAFT → CONFIRMED
 * - Updates packaging reconciliationStatus to 'Đã đối soát' for all items
 */

import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, serializeDecimals } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { createNotification } from '@/lib/notifications'

export const POST = apiHandler(async (_req, { session, params }) => {
  try {
    const { systemId } = params

    const sheet = await prisma.reconciliationSheet.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        carrier: true,
        status: true,
        items: {
          select: {
            packagingId: true,
          },
        },
        createdBy: true,
      },
    })

    if (!sheet) {
      return apiError('Phiếu đối soát không tồn tại', 404)
    }

    if (sheet.status !== 'DRAFT') {
      return apiError('Chỉ có thể xác nhận phiếu ở trạng thái Nháp', 400)
    }

    if (sheet.items.length === 0) {
      return apiError('Phiếu đối soát không có vận đơn nào', 400)
    }

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update sheet status
      const confirmed = await tx.reconciliationSheet.update({
        where: { systemId },
        data: {
          status: 'CONFIRMED',
          confirmedAt: new Date(),
          confirmedBy: session?.user?.id,
          updatedBy: session?.user?.id,
        },
        select: {
          items: {
            select: {
              systemId: true,
              packagingId: true,
              trackingCode: true,
              orderId: true,
              orderSystemId: true,
              customerName: true,
              codSystem: true,
              codPartner: true,
              codDifference: true,
              feeSystem: true,
              feePartner: true,
              feeDifference: true,
              note: true,
            },
          },
          branch: { select: { systemId: true, name: true } },
        },
      })

      // 2. Mark all packaging items as reconciled
      const packagingIds = sheet.items.map(i => i.packagingId)
      await tx.packaging.updateMany({
        where: { systemId: { in: packagingIds } },
        data: { reconciliationStatus: 'Đã đối soát' },
      })

      return confirmed
    })

    await createActivityLog({
      entityType: 'reconciliation_sheet',
      entityId: systemId,
      action: `Xác nhận phiếu đối soát ${sheet.id} — ${sheet.items.length} vận đơn`,
      createdBy: session?.user?.id,
    })

    // Notify creator if different from confirmer
    if (sheet.createdBy && sheet.createdBy !== session?.user?.id) {
      createNotification({
        type: 'reconciliation',
        settingsKey: 'reconciliation:updated',
        title: 'Phiếu đối soát đã xác nhận',
        message: `Phiếu ${sheet.id} — ${sheet.carrier} đã được xác nhận`,
        link: `/reconciliation/${systemId}`,
        recipientId: sheet.createdBy,
        senderId: session?.user?.employeeId,
        senderName: session?.user?.name,
      }).catch(e => logError('[Reconciliation Confirm] notification failed', e))
    }

    return apiSuccess(serializeDecimals(updated))
  } catch (error) {
    logError('Error confirming reconciliation sheet', error)
    return apiError('Không thể xác nhận phiếu đối soát', 500)
  }
}, { permission: 'approve_reconciliation' })
