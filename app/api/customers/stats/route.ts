/**
 * Customer Stats API
 *
 * GET /api/customers/stats — Lightweight aggregation for summary cards + deleted count
 */

import { prisma } from '@/lib/prisma'
import { apiSuccess } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'

export const dynamic = 'force-dynamic'

export const GET = apiHandler(async () => {
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const now = new Date()
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    const [
      totalCustomers,
      customersOweUs,
      weOweCustomers,
      receivableAgg,
      payableAgg,
      hasDebt,
      newCustomersThisMonth,
      deletedCount,
      overdueCustomerIds,
      dueSoonCustomerIds,
      activeCount,
      inactiveCount,
    ] = await Promise.all([
      prisma.customer.count({ where: { isDeleted: false } }),
      // Phải thu: khách nợ mình (currentDebt > 0)
      prisma.customer.count({
        where: { isDeleted: false, currentDebt: { gt: 0 } },
      }),
      // Phải trả: mình nợ khách (currentDebt < 0)
      prisma.customer.count({
        where: { isDeleted: false, currentDebt: { lt: 0 } },
      }),
      // Tổng phải thu
      prisma.customer.aggregate({
        where: { isDeleted: false, currentDebt: { gt: 0 } },
        _sum: { currentDebt: true },
      }),
      // Tổng phải trả (giá trị âm)
      prisma.customer.aggregate({
        where: { isDeleted: false, currentDebt: { lt: 0 } },
        _sum: { currentDebt: true },
      }),
      // Có công nợ (bất kỳ chiều nào)
      prisma.customer.count({
        where: { isDeleted: false, currentDebt: { not: 0 } },
      }),
      prisma.customer.count({
        where: { isDeleted: false, createdAt: { gte: monthStart } },
      }),
      prisma.customer.count({ where: { isDeleted: true } }),
      // Quá hạn thanh toán
      prisma.$queryRaw<{ customerId: string }[]>`
        SELECT DISTINCT o."customerId" as "customerId"
        FROM orders o
        JOIN customers c ON o."customerId" = c."systemId"
        WHERE o.status != 'CANCELLED'
          AND (o.status = 'COMPLETED' OR o."deliveryStatus" = 'DELIVERED' OR o."stockOutStatus" = 'FULLY_STOCKED_OUT')
          AND o."paymentStatus" != 'PAID'
          AND c."currentDebt" != 0
          AND c."isDeleted" = false
          AND o."orderDate" + (
            CASE 
              WHEN c."paymentTerms" = 'NET60' THEN INTERVAL '60 days'
              WHEN c."paymentTerms" = 'NET15' THEN INTERVAL '15 days'
              WHEN c."paymentTerms" = 'COD' THEN INTERVAL '0 days'
              ELSE INTERVAL '30 days'
            END
          ) < ${now}
      `,
      // Sắp đến hạn (trong 3 ngày tới)
      prisma.$queryRaw<{ customerId: string }[]>`
        SELECT DISTINCT o."customerId" as "customerId"
        FROM orders o
        JOIN customers c ON o."customerId" = c."systemId"
        WHERE o.status != 'CANCELLED'
          AND (o.status = 'COMPLETED' OR o."deliveryStatus" = 'DELIVERED' OR o."stockOutStatus" = 'FULLY_STOCKED_OUT')
          AND o."paymentStatus" != 'PAID'
          AND c."currentDebt" != 0
          AND c."isDeleted" = false
          AND o."orderDate" + (
            CASE 
              WHEN c."paymentTerms" = 'NET60' THEN INTERVAL '60 days'
              WHEN c."paymentTerms" = 'NET15' THEN INTERVAL '15 days'
              WHEN c."paymentTerms" = 'COD' THEN INTERVAL '0 days'
              ELSE INTERVAL '30 days'
            END
          ) BETWEEN ${now} AND ${threeDaysLater}
      `,
      // Đang giao dịch
      prisma.customer.count({
        where: { isDeleted: false, status: 'ACTIVE' },
      }),
      // Ngừng giao dịch
      prisma.customer.count({
        where: { isDeleted: false, status: 'INACTIVE' },
      }),
    ])

    return apiSuccess({
      totalCustomers,
      // Backward compat
      customersWithDebt: hasDebt,
      totalDebtAmount: Number(receivableAgg._sum?.currentDebt ?? 0) + Number(payableAgg._sum?.currentDebt ?? 0),
      // Tách theo kế toán
      customersOweUs,
      weOweCustomers,
      totalReceivable: Number(receivableAgg._sum?.currentDebt ?? 0),
      totalPayable: Math.abs(Number(payableAgg._sum?.currentDebt ?? 0)),
      // Workflow cards
      hasDebt,
      noDebt: totalCustomers - hasDebt,
      overdue: overdueCustomerIds.length,
      dueSoon: dueSoonCustomerIds.length,
      activeCount,
      inactiveCount,
      newCustomersThisMonth,
      deletedCount,
    })
})
