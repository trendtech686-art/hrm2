/**
 * Available Shipments for Reconciliation Sheets
 * 
 * GET /api/reconciliation-sheets/available-shipments
 * Returns packagings with:
 * - codAmount > 0
 * - trackingCode exists
 * - deliveryStatus = DELIVERED (đã giao mới cần đối soát)
 * - NOT already in a DRAFT or CONFIRMED reconciliation sheet
 * - Optional carrier filter
 */

import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, serializeDecimals } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'

export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url)
  const carrier = searchParams.get('carrier') || ''
  const search = searchParams.get('search') || ''
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 200)
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0)

  // Find packaging IDs already in active reconciliation sheets
  const existingItems = await prisma.reconciliationSheetItem.findMany({
    where: {
      sheet: { status: { in: ['DRAFT', 'CONFIRMED'] } },
    },
    select: { packagingId: true },
  })
  const usedPackagingIds = new Set(existingItems.map(i => i.packagingId))

  const where: Prisma.PackagingWhereInput = {
    codAmount: { gt: 0 },
    trackingCode: { not: null },
    sourceType: 'ORDER',
    deliveryStatus: 'DELIVERED',
    // Exclude packagings already in active reconciliation sheets
    systemId: usedPackagingIds.size > 0 ? { notIn: [...usedPackagingIds] } : undefined,
  }

  if (carrier) {
    where.carrier = { contains: carrier, mode: 'insensitive' }
  }

  if (search) {
    where.OR = [
      { trackingCode: { contains: search, mode: 'insensitive' } },
      { id: { contains: search, mode: 'insensitive' } },
      { order: { id: { contains: search, mode: 'insensitive' } } },
      { order: { customerName: { contains: search, mode: 'insensitive' } } },
    ]
  }

  const selectFields = {
    systemId: true,
    id: true,
    trackingCode: true,
    carrier: true,
    codAmount: true,
    shippingFeeToPartner: true,
    deliveredDate: true,
    deliveryStatus: true,
    reconciliationStatus: true,
    orderId: true,
    order: {
      select: {
        systemId: true,
        id: true,
        customerName: true,
      },
    },
  } satisfies Prisma.PackagingSelect

  // Parallel: count total + fetch page
  const [total, packagings] = await Promise.all([
    prisma.packaging.count({ where }),
    prisma.packaging.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: selectFields,
    }),
  ])

  return apiSuccess({
    data: serializeDecimals(packagings),
    total,
    hasMore: offset + packagings.length < total,
  })
}, { permission: 'view_reconciliation' })
