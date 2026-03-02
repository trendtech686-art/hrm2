/**
 * Customer Stats API
 *
 * GET /api/customers/stats — Lightweight aggregation for summary cards + deleted count
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    const [totalCustomers, customersWithDebt, totalDebtAgg, newCustomersThisMonth, deletedCount] = await Promise.all([
      prisma.customer.count({ where: { isDeleted: false } }),
      prisma.customer.count({ where: { isDeleted: false, currentDebt: { gt: 0 } } }),
      prisma.customer.aggregate({
        where: { isDeleted: false },
        _sum: { currentDebt: true },
      }),
      prisma.customer.count({
        where: { isDeleted: false, createdAt: { gte: monthStart } },
      }),
      prisma.customer.count({ where: { isDeleted: true } }),
    ])

    return apiSuccess({
      totalCustomers,
      customersWithDebt,
      totalDebtAmount: Number(totalDebtAgg._sum?.currentDebt ?? 0),
      newCustomersThisMonth,
      deletedCount,
    })
  } catch (error) {
    console.error('Error fetching customer stats:', error)
    return apiError('Failed to fetch customer stats', 500)
  }
}
