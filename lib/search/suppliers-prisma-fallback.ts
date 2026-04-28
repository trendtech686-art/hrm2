/**
 * Prisma fallback search for suppliers when Meilisearch is unavailable.
 *
 * Search by: name, phone, email, id
 * Filters: isActive, isDeleted
 */

import { prisma } from '@/lib/prisma'
import { buildSearchWhere } from './build-search-where'

export interface PrismaSupplierHit {
  systemId: string
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
  taxCode: string | null
  contactPerson: string | null
  totalOrders: number
  totalPurchased: number
  totalDebt: number
  isActive: boolean
  status: string
}

export async function prismaSupplierSearch({
  query,
  limit = 20,
  offset = 0,
  isActive,
}: {
  query: string
  limit?: number
  offset?: number
  isActive?: boolean | null
}): Promise<{ hits: PrismaSupplierHit[]; estimatedTotal: number }> {
  const where: Record<string, unknown> = {
    isDeleted: false,
  }

  const searchWhere = buildSearchWhere(query, ['name', 'phone', 'email', 'id'])
  if (searchWhere) {
    Object.assign(where, searchWhere)
  }

  if (isActive !== null && isActive !== undefined) {
    where.isActive = isActive
  }

  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      select: {
        systemId: true,
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        taxCode: true,
        contactPerson: true,
        totalOrders: true,
        totalPurchased: true,
        totalDebt: true,
        isActive: true,
      },
    }),
    prisma.supplier.count({ where }),
  ])

  const hits: PrismaSupplierHit[] = suppliers.map((s) => ({
    systemId: s.systemId,
    id: s.id,
    name: s.name,
    phone: s.phone,
    email: s.email,
    address: s.address,
    taxCode: s.taxCode,
    contactPerson: s.contactPerson,
    totalOrders: s.totalOrders ?? 0,
    totalPurchased: s.totalPurchased ? Number(s.totalPurchased) : 0,
    totalDebt: s.totalDebt ? Number(s.totalDebt) : 0,
    isActive: s.isActive,
    status: s.isActive ? 'ACTIVE' : 'INACTIVE',
  }))

  return { hits, estimatedTotal: total }
}
