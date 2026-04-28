/**
 * Prisma fallback search for employees when Meilisearch is unavailable.
 *
 * Search by: fullName, employeeId, workEmail, phone
 * Filters: departmentId, employmentStatus, employeeType
 */

import { prisma } from '@/lib/prisma'
import { buildSearchWhere } from './build-search-where'

export interface PrismaEmployeeHit {
  systemId: string
  id: string
  fullName: string
  email: string | null
  phone: string | null
  department: string | null
  position: string | null
  status: string
}

export async function prismaEmployeeSearch({
  query,
  limit = 20,
  offset = 0,
  departmentId,
  status,
}: {
  query: string
  limit?: number
  offset?: number
  departmentId?: string | null
  status?: string | null
}): Promise<{ hits: PrismaEmployeeHit[]; estimatedTotal: number }> {
  const where: Record<string, unknown> = {}

  const searchWhere = buildSearchWhere(query, ['fullName', 'id', 'workEmail', 'phone'])
  if (searchWhere) {
    Object.assign(where, searchWhere)
  }

  if (departmentId) {
    where.departmentId = departmentId
  }

  if (status) {
    where.employmentStatus = status
  }

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { fullName: 'asc' },
      include: {
        department: { select: { name: true } },
        jobTitle: { select: { name: true } },
      },
    }),
    prisma.employee.count({ where }),
  ])

  const hits: PrismaEmployeeHit[] = employees.map((e) => ({
    systemId: e.systemId,
    id: e.id,
    fullName: e.fullName,
    email: e.workEmail,
    phone: e.phone,
    department: e.department?.name || null,
    position: e.jobTitle?.name || null,
    status: e.employmentStatus,
  }))

  return { hits, estimatedTotal: total }
}
