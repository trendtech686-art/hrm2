/**
 * Prisma fallback search for shipments when Meilisearch is unavailable.
 *
 * Search by: trackingCode, trackingNumber, recipientName, recipientPhone
 * Filters: status, carrier, printStatus, deliveryStatus
 */

import { prisma } from '@/lib/prisma'
import { buildSearchWhere } from './build-search-where'

export interface PrismaShipmentHit {
  systemId: string
  trackingCode: string | null
  trackingNumber: string | null
  carrier: string
  status: string
  service: string | null
  orderId: string | null
  orderBusinessId: string | null
  recipientName: string | null
  recipientPhone: string | null
  recipientAddress: string | null
  shippingFee: number
  weight: number | null
  createdAt: string | null
  pickedAt: string | null
  deliveredAt: string | null
  returnedAt: string | null
  printStatus: string
  deliveryStatus: string | null
}

export async function prismaShipmentSearch({
  query,
  limit = 20,
  offset = 0,
  status,
  carrier,
  printStatus,
  deliveryStatus,
}: {
  query: string
  limit?: number
  offset?: number
  status?: string | null
  carrier?: string | null
  printStatus?: string | null
  deliveryStatus?: string | null
}): Promise<{ hits: PrismaShipmentHit[]; estimatedTotal: number }> {
  const where: Record<string, unknown> = {}

  const searchWhere = buildSearchWhere(query, ['trackingCode', 'trackingNumber', 'recipientName', 'recipientPhone'])
  if (searchWhere) {
    Object.assign(where, searchWhere)
  }

  if (status) {
    where.status = status
  }

  if (carrier) {
    where.carrier = carrier
  }

  if (printStatus) {
    where.printStatus = printStatus
  }

  if (deliveryStatus) {
    where.deliveryStatus = deliveryStatus
  }

  const [shipments, total] = await Promise.all([
    prisma.shipment.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      select: {
        systemId: true,
        trackingCode: true,
        trackingNumber: true,
        carrier: true,
        status: true,
        service: true,
        orderSystemId: true,
        orderBusinessId: true,
        recipientName: true,
        recipientPhone: true,
        recipientAddress: true,
        shippingFee: true,
        weight: true,
        createdAt: true,
        pickedAt: true,
        deliveredAt: true,
        returnedAt: true,
        printStatus: true,
        deliveryStatus: true,
      },
    }),
    prisma.shipment.count({ where }),
  ])

  const hits: PrismaShipmentHit[] = shipments.map((s) => ({
    systemId: s.systemId,
    trackingCode: s.trackingCode,
    trackingNumber: s.trackingNumber,
    carrier: s.carrier,
    status: s.status,
    service: s.service,
    orderId: s.orderSystemId,
    orderBusinessId: s.orderBusinessId,
    recipientName: s.recipientName,
    recipientPhone: s.recipientPhone,
    recipientAddress: s.recipientAddress,
    shippingFee: s.shippingFee ? Number(s.shippingFee) : 0,
    weight: s.weight ? Number(s.weight) : null,
    createdAt: s.createdAt ? s.createdAt.toISOString() : null,
    pickedAt: s.pickedAt ? s.pickedAt.toISOString() : null,
    deliveredAt: s.deliveredAt ? s.deliveredAt.toISOString() : null,
    returnedAt: s.returnedAt ? s.returnedAt.toISOString() : null,
    printStatus: s.printStatus,
    deliveryStatus: s.deliveryStatus,
  }))

  return { hits, estimatedTotal: total }
}
