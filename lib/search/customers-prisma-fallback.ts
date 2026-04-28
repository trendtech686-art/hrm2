/**
 * Prisma fallback search for customers when Meilisearch is unavailable.
 *
 * Search by: name, phone, email
 * Filters: isDeleted, status, type, customerGroup
 */

import { prisma } from '@/lib/prisma'
import { buildSearchWhere } from './build-search-where'

export interface PrismaCustomerHit {
  systemId: string
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  district: string | null
  totalOrders: number
  totalSpent: number
}

export async function prismaCustomerSearch({
  query,
  limit = 20,
  offset = 0,
  status,
  type,
  customerGroup,
}: {
  query: string
  limit?: number
  offset?: number
  status?: string | null
  type?: string | null
  customerGroup?: string | null
}): Promise<{ hits: PrismaCustomerHit[]; estimatedTotal: number }> {
  const where: Record<string, unknown> = {
    isDeleted: false,
  }

  const searchWhere = buildSearchWhere(query, ['name', 'phone', 'id'])
  if (searchWhere) {
    Object.assign(where, searchWhere)
  }

  if (status) {
    where.status = status
  }

  if (type) {
    where.type = type
  }

  if (customerGroup) {
    where.customerGroup = customerGroup
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
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
        province: true,
        district: true,
        totalOrders: true,
        totalSpent: true,
      },
    }),
    prisma.customer.count({ where }),
  ])

  const hits: PrismaCustomerHit[] = customers.map((c) => ({
    systemId: c.systemId,
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email,
    address: c.address,
    city: c.province,
    district: c.district,
    totalOrders: c.totalOrders ?? 0,
    totalSpent: c.totalSpent ? Number(c.totalSpent) : 0,
  }))

  return { hits, estimatedTotal: total }
}
