/**
 * Reconciliation Sheets API
 * 
 * GET  /api/reconciliation-sheets — List sheets with pagination + filters
 * POST /api/reconciliation-sheets — Create new sheet
 */

import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, serializeDecimals } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { generateNextIds } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { createNotification } from '@/lib/notifications'
import type { Prisma } from '@/generated/prisma/client'
import { buildSearchWhere } from '@/lib/search/build-search-where'

export const GET = apiHandler(async (req, { session: _session }) => {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page')) || 1
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 100)
  const skip = (page - 1) * limit
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const carrier = searchParams.get('carrier') || ''

  const where: Prisma.ReconciliationSheetWhereInput = {}

  if (status) {
    where.status = status as Prisma.EnumReconciliationSheetStatusFilter
  }
  if (carrier) {
    where.carrier = carrier
  }
  const searchWhere = buildSearchWhere<Prisma.ReconciliationSheetWhereInput>(search, [
    'id',
    'carrier',
    'note',
  ])
  if (searchWhere) Object.assign(where, searchWhere)

  const [data, total] = await Promise.all([
    prisma.reconciliationSheet.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        branch: { select: { systemId: true, name: true } },
        _count: { select: { items: true } },
      },
    }),
    prisma.reconciliationSheet.count({ where }),
  ])

  return apiSuccess({
    data: serializeDecimals(data),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}, { permission: 'view_reconciliation' })

export const POST = apiHandler(async (req, { session }) => {
  try {
    const body = await req.json()
    const { carrier, branchId, note, tags, items } = body as {
      carrier: string
      branchId?: string
      note?: string
      tags?: string[]
      items: Array<{
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

    if (!carrier) {
      return apiError('Đối tác vận chuyển là bắt buộc', 400)
    }
    if (!items || items.length === 0) {
      return apiError('Phiếu đối soát phải có ít nhất 1 vận đơn', 400)
    }

    const { systemId, businessId } = await generateNextIds('reconciliation')

    // Calculate totals
    let totalCodSystem = 0, totalCodPartner = 0, totalFeeSystem = 0, totalFeePartner = 0
    for (const item of items) {
      totalCodSystem += item.codSystem || 0
      totalCodPartner += item.codPartner || 0
      totalFeeSystem += item.feeSystem || 0
      totalFeePartner += item.feePartner || 0
    }

    const sheet = await prisma.reconciliationSheet.create({
      data: {
        systemId,
        id: businessId,
        carrier,
        branchId: branchId || null,
        note: note || null,
        tags: tags || [],
        totalCodSystem,
        totalCodPartner,
        totalFeeSystem,
        totalFeePartner,
        codDifference: totalCodPartner - totalCodSystem,
        feeDifference: totalFeePartner - totalFeeSystem,
        createdBy: session?.user?.id,
        createdByName: session?.user?.name || undefined,
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
      include: {
        items: true,
        branch: { select: { systemId: true, name: true } },
      },
    })

    await createActivityLog({
      entityType: 'reconciliation_sheet',
      entityId: systemId,
      action: `Tạo phiếu đối soát ${businessId} — ${carrier} — ${items.length} vận đơn`,
      createdBy: session?.user?.id,
    })

    // Notify: fire-and-forget
    if (session?.user?.employeeId) {
      createNotification({
        type: 'reconciliation',
        settingsKey: 'reconciliation:updated',
        title: 'Phiếu đối soát mới',
        message: `Phiếu ${businessId} — ${carrier} — ${items.length} vận đơn cần xác nhận`,
        link: `/reconciliation/${systemId}`,
        recipientId: session.user.employeeId,
        senderId: session.user.employeeId,
        senderName: session.user.name,
      }).catch(e => logError('[Reconciliation POST] notification failed', e))
    }

    return apiSuccess(serializeDecimals(sheet), 201)
  } catch (error) {
    logError('Error creating reconciliation sheet', error)
    return apiError('Không thể tạo phiếu đối soát', 500)
  }
}, { permission: 'create_reconciliation' })
