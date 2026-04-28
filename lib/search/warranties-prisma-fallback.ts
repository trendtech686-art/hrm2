/**
 * Prisma fallback search for warranties when Meilisearch is unavailable.
 *
 * Search by: warrantyId, warrantyCode, title, customerName, customerPhone, productName
 * Filters: status, priority, isUnderWarranty, branchId
 */

import { prisma } from '@/lib/prisma'
import { buildSearchWhere } from './build-search-where'

export interface PrismaWarrantyHit {
  systemId: string
  warrantyId: string
  warrantyCode: string
  title: string
  customerName: string
  customerPhone: string
  customerEmail: string | null
  customerAddress: string | null
  productName: string
  serialNumber: string | null
  status: string
  priority: string
  branchName: string | null
  assigneeName: string | null
  orderId: string | null
  isUnderWarranty: boolean
  totalCost: number
  createdAt: string | null
  receivedAt: string | null
  completedAt: string | null
}

export async function prismaWarrantySearch({
  query,
  limit = 20,
  offset = 0,
  status,
  priority,
  isUnderWarranty,
  branchId,
}: {
  query: string
  limit?: number
  offset?: number
  status?: string | null
  priority?: string | null
  isUnderWarranty?: boolean | null
  branchId?: string | null
}): Promise<{ hits: PrismaWarrantyHit[]; estimatedTotal: number }> {
  const where: Record<string, unknown> = {}

  const searchWhere = buildSearchWhere(query, ['id', 'customerName', 'customerPhone', 'productName', 'title'])
  if (searchWhere) {
    Object.assign(where, searchWhere)
  }

  if (status) {
    where.status = status
  }

  if (priority) {
    where.priority = priority
  }

  if (isUnderWarranty !== null && isUnderWarranty !== undefined) {
    where.isUnderWarranty = isUnderWarranty
  }

  if (branchId) {
    where.branchId = branchId
  }

  const [warranties, total] = await Promise.all([
    prisma.warranty.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { receivedAt: 'desc' },
      include: {
        // Note: branch and assignee are stored as scalar fields (branchSystemId, branchName, employeeSystemId, employeeName)
        // Not as relations, so we don't need to include them here
      },
    }),
    prisma.warranty.count({ where }),
  ])

  const hits: PrismaWarrantyHit[] = warranties.map((w) => ({
    systemId: w.systemId,
    warrantyId: w.id,
    warrantyCode: w.id,
    title: w.title,
    customerName: w.customerName,
    customerPhone: w.customerPhone,
    customerEmail: w.customerEmail,
    customerAddress: w.description,
    productName: w.productName,
    serialNumber: w.serialNumber,
    status: w.status,
    priority: w.priority,
    branchName: w.branchName || null,
    assigneeName: w.employeeName || null,
    orderId: w.orderId,
    isUnderWarranty: w.isUnderWarranty,
    totalCost: w.totalCost ? Number(w.totalCost) : 0,
    createdAt: w.receivedAt ? w.receivedAt.toISOString() : null,
    receivedAt: w.receivedAt ? w.receivedAt.toISOString() : null,
    completedAt: w.completedAt ? w.completedAt.toISOString() : null,
  }))

  return { hits, estimatedTotal: total }
}
