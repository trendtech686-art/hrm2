/**
 * Reconciliation Sheet Detail API
 * 
 * GET    /api/reconciliation-sheets/[systemId] — Get sheet with items
 * PUT    /api/reconciliation-sheets/[systemId] — Update sheet (items, note, tags)
 * DELETE /api/reconciliation-sheets/[systemId] — Delete draft sheet
 */

import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, serializeDecimals } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { createNotification } from '@/lib/notifications'

export const GET = apiHandler(async (_req, { params }) => {
  const { systemId } = params

  const sheet = await prisma.reconciliationSheet.findUnique({
    where: { systemId },
    select: {
      systemId: true,
      id: true,
      businessId: true,
      carrier: true,
      branchId: true,
      status: true,
      totalCodSystem: true,
      totalCodPartner: true,
      codDifference: true,
      totalFeeSystem: true,
      totalFeePartner: true,
      feeDifference: true,
      note: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
      createdBy: true,
      confirmedAt: true,
      confirmedBy: true,
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
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      },
      branch: { select: { systemId: true, name: true } },
    },
  })

  if (!sheet) {
    return apiError('Phiếu đối soát không tồn tại', 404)
  }

  return apiSuccess(serializeDecimals(sheet))
}, { permission: 'view_reconciliation' })

export const PUT = apiHandler(async (req, { session, params }) => {
  try {
    const { systemId } = params

    const sheet = await prisma.reconciliationSheet.findUnique({
      where: { systemId },
    })

    if (!sheet) {
      return apiError('Phiếu đối soát không tồn tại', 404)
    }

    if (sheet.status !== 'DRAFT') {
      return apiError('Chỉ có thể sửa phiếu ở trạng thái Nháp', 400)
    }

    const body = await req.json()
    const { note, tags, items } = body as {
      note?: string
      tags?: string[]
      items?: Array<{
        packagingId: string
        trackingCode: string
        orderId: string
        orderSystemId: string
        customerName?: string
        codSystem: number
        codPartner: number
        feeSystem: number
        feePartner: number
        note?: string
      }>
    }

    // If items provided, recalculate totals and replace all items
    if (items) {
      let totalCodSystem = 0, totalCodPartner = 0, totalFeeSystem = 0, totalFeePartner = 0
      for (const item of items) {
        totalCodSystem += item.codSystem || 0
        totalCodPartner += item.codPartner || 0
        totalFeeSystem += item.feeSystem || 0
        totalFeePartner += item.feePartner || 0
      }

      const updated = await prisma.$transaction(async (tx) => {
        // Delete old items
        await tx.reconciliationSheetItem.deleteMany({ where: { sheetId: systemId } })

        // Update sheet + create new items
        return tx.reconciliationSheet.update({
          where: { systemId },
          data: {
            note: note ?? sheet.note,
            tags: tags ?? sheet.tags,
            totalCodSystem,
            totalCodPartner,
            totalFeeSystem,
            totalFeePartner,
            codDifference: totalCodPartner - totalCodSystem,
            feeDifference: totalFeePartner - totalFeeSystem,
            updatedBy: session?.user?.id,
            items: {
              create: items.map(item => ({
                packagingId: item.packagingId,
                trackingCode: item.trackingCode,
                orderId: item.orderId,
                orderSystemId: item.orderSystemId,
                customerName: item.customerName || null,
                codSystem: item.codSystem || 0,
                codPartner: item.codPartner || 0,
                codDifference: (item.codPartner || 0) - (item.codSystem || 0),
                feeSystem: item.feeSystem || 0,
                feePartner: item.feePartner || 0,
                feeDifference: (item.feePartner || 0) - (item.feeSystem || 0),
                note: item.note || null,
              })),
            },
          },
          select: {
            systemId: true,
            id: true,
            businessId: true,
            carrier: true,
            branchId: true,
            status: true,
            totalCodSystem: true,
            totalCodPartner: true,
            codDifference: true,
            totalFeeSystem: true,
            totalFeePartner: true,
            feeDifference: true,
            note: true,
            tags: true,
            createdAt: true,
            updatedAt: true,
            createdBy: true,
            confirmedAt: true,
            confirmedBy: true,
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
      })

      return apiSuccess(serializeDecimals(updated))
    }

    // Just update note/tags
    const updated = await prisma.reconciliationSheet.update({
      where: { systemId },
      data: {
        ...(note !== undefined && { note }),
        ...(tags !== undefined && { tags }),
        updatedBy: session?.user?.id,
      },
      select: {
        systemId: true,
        id: true,
        businessId: true,
        carrier: true,
        branchId: true,
        status: true,
        totalCodSystem: true,
        totalCodPartner: true,
        codDifference: true,
        totalFeeSystem: true,
        totalFeePartner: true,
        feeDifference: true,
        note: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        confirmedAt: true,
        confirmedBy: true,
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

    return apiSuccess(serializeDecimals(updated))
  } catch (error) {
    logError('Error updating reconciliation sheet', error)
    return apiError('Không thể cập nhật phiếu đối soát', 500)
  }
}, { permission: 'create_reconciliation' })

export const DELETE = apiHandler(async (_req, { session, params }) => {
  try {
    const { systemId } = params

    const sheet = await prisma.reconciliationSheet.findUnique({
      where: { systemId },
    })

    if (!sheet) {
      return apiError('Phiếu đối soát không tồn tại', 404)
    }

    if (sheet.status !== 'DRAFT') {
      return apiError('Chỉ có thể xóa phiếu ở trạng thái Nháp', 400)
    }

    // Cascade delete items via onDelete: Cascade
    await prisma.reconciliationSheet.delete({ where: { systemId } })

    await createActivityLog({
      entityType: 'reconciliation_sheet',
      entityId: systemId,
      action: `Xóa phiếu đối soát ${sheet.id}`,
      createdBy: session?.user?.id,
    })

    // Notify creator if different from deleter
    if (sheet.createdBy && sheet.createdBy !== session?.user?.id) {
      createNotification({
        type: 'reconciliation',
        settingsKey: 'reconciliation:updated',
        title: 'Phiếu đối soát bị xóa',
        message: `Phiếu ${sheet.id} — ${sheet.carrier} đã bị xóa`,
        link: `/reconciliation`,
        recipientId: sheet.createdBy,
        senderId: session?.user?.employeeId,
        senderName: session?.user?.name,
      }).catch(e => logError('[Reconciliation DELETE] notification failed', e))
    }

    return apiSuccess({ deleted: true })
  } catch (error) {
    logError('Error deleting reconciliation sheet', error)
    return apiError('Không thể xóa phiếu đối soát', 500)
  }
}, { permission: 'create_reconciliation' })
