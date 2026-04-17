/**
 * API Route: GET /api/employees/stats
 * Returns employee statistics (direct query, no server cache)
 */

import { prisma } from '@/lib/prisma'
import { apiSuccess } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'

export const dynamic = 'force-dynamic'

export const GET = apiHandler(async () => {
  const [total, active, onLeave, resigned, deleted] = await Promise.all([
    prisma.employee.count({ where: { isDeleted: false } }),
    prisma.employee.count({ where: { isDeleted: false, employmentStatus: 'ACTIVE' } }),
    prisma.employee.count({ where: { isDeleted: false, employmentStatus: 'ON_LEAVE' } }),
    prisma.employee.count({ where: { isDeleted: false, employmentStatus: 'TERMINATED' } }),
    prisma.employee.count({ where: { isDeleted: true, permanentlyDeletedAt: null } }),
  ])

  return apiSuccess({ total, active, onLeave, resigned, deleted })
})
