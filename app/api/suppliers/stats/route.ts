import { apiHandler } from '@/lib/api-handler'
import { apiSuccess } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const GET = apiHandler(async () => {
  const [total, activeCount, debitResult, creditResult, totalPurchasedResult, totalPaidResult, deletedCount] = await Promise.all([
    prisma.supplier.count({ where: { isDeleted: false } }),
    prisma.supplier.count({ where: { status: 'Đang Giao Dịch', isDeleted: false } }),
    prisma.supplier.aggregate({ _sum: { currentDebt: true }, where: { currentDebt: { gt: 0 }, isDeleted: false } }),
    prisma.supplier.aggregate({ _sum: { currentDebt: true }, where: { currentDebt: { lt: 0 }, isDeleted: false } }),
    prisma.supplier.aggregate({ _sum: { totalPurchased: true }, where: { isDeleted: false } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { supplierId: { not: null }, status: { not: 'cancelled' } } }),
    prisma.supplier.count({ where: { isDeleted: true } }),
  ])

  return apiSuccess({
    totalSuppliers: total,
    activeSuppliers: activeCount,
    totalDebit: Number(debitResult._sum?.currentDebt || 0),
    totalCredit: Math.abs(Number(creditResult._sum?.currentDebt || 0)),
    totalPurchased: Number(totalPurchasedResult._sum?.totalPurchased || 0),
    totalPaid: Number(totalPaidResult._sum?.amount || 0),
    deletedCount,
  })
})
