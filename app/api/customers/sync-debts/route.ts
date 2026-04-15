/**
 * Sync Customer Debts API
 * 
 * POST /api/customers/sync-debts
 * 
 * Recalculates and updates currentDebt for all customers based on:
 * - Delivered orders (creates debt)
 * - Receipts (reduces debt - customer pays us)
 * - Payments to customer (increases debt - we refund customer)
 */

import { prisma } from '@/lib/prisma'
import { apiSuccess } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'

export const dynamic = 'force-dynamic'

export const POST = apiHandler(async () => {
    // Only sync customers that have orders (to save time)
    const customersWithOrders = await prisma.$queryRaw<Array<{systemId: string, name: string, currentDebt: number}>>`
      SELECT DISTINCT c."systemId", c."name", c."currentDebt"::numeric as "currentDebt"
      FROM customers c
      JOIN orders o ON o."customerId" = c."systemId"
      WHERE c."isDeleted" = false
    `;

    const results: Array<{
      systemId: string
      name: string
      oldDebt: number
      newDebt: number
      changed: boolean
    }> = []

    let updated = 0
    let unchanged = 0

    for (const customer of customersWithOrders) {
      // Calculate debt using EXACT same logic as debt transactions API (/api/customers/[systemId]/debt)
      const [deliveredOrdersSum, salesReturnSumForDebt, debtReceiptSum, debtPaymentsRaw, salesReturnRefundsSum] = await Promise.all([
        // Sum of grandTotal from "delivered" orders
        prisma.order.aggregate({
          where: {
            customerId: customer.systemId,
            status: { not: 'CANCELLED' },
            OR: [
              { status: 'COMPLETED' },
              { status: 'DELIVERED' },
              { deliveryStatus: 'DELIVERED' },
              { stockOutStatus: 'FULLY_STOCKED_OUT' },
            ],
          },
          _sum: { grandTotal: true },
        }),
        // Sales returns that reduce debt (isReceived + not rejected)
        prisma.salesReturn.aggregate({
          where: {
            customerSystemId: customer.systemId,
            isReceived: true,
            status: { not: 'REJECTED' },
          },
          _sum: { totalReturnValue: true },
        }),
        // Sum of receipts that affect debt (match by systemId or name)
        prisma.receipt.aggregate({
          where: {
            OR: [
              { customerSystemId: customer.systemId },
              { payerSystemId: customer.systemId },
              ...(customer.name ? [{ payerTypeName: 'Khách hàng', payerName: customer.name }] : []),
            ],
            affectsDebt: true,
            status: { not: 'cancelled' },
          },
          _sum: { amount: true },
        }),
        // Payments that affect debt (non-refund, non-complaint, match by systemId or name)
        prisma.payment.findMany({
          where: {
            status: { not: 'cancelled' },
            affectsDebt: true,
            linkedSalesReturnSystemId: null,
            linkedComplaintSystemId: null,
            OR: [
              { customerSystemId: customer.systemId },
              { recipientSystemId: customer.systemId },
              ...(customer.name ? [{ recipientTypeName: 'Khách hàng', recipientName: customer.name }] : []),
            ],
          },
          select: {
            amount: true,
            paymentReceiptTypeName: true,
            category: true,
          },
        }),
        // Sales return refunds (increase debt from negative to 0)
        prisma.payment.aggregate({
          where: {
            status: { not: 'cancelled' },
            linkedSalesReturnSystemId: { not: null },
            OR: [
              { customerSystemId: customer.systemId },
              { recipientSystemId: customer.systemId },
              ...(customer.name ? [{ recipientTypeName: 'Khách hàng', recipientName: customer.name }] : []),
            ],
          },
          _sum: { amount: true },
        }),
      ])

      // Process payments: tất cả phiếu chi đều tăng công nợ (trả tiền cho khách → từ âm về 0)
      let debtPaymentTotal = 0
      for (const p of debtPaymentsRaw) {
        debtPaymentTotal += Number(p.amount) || 0
      }

      // Công nợ = Đơn hàng - Hàng trả - Phiếu thu + PC hoàn từ SR + Phiếu chi khác
      const calculatedDebt =
        Number(deliveredOrdersSum._sum.grandTotal ?? 0) -
        Number(salesReturnSumForDebt._sum.totalReturnValue ?? 0) -
        Number(debtReceiptSum._sum.amount ?? 0) +
        Number(salesReturnRefundsSum._sum.amount ?? 0) +
        debtPaymentTotal

      const oldDebt = Number(customer.currentDebt ?? 0)
      const changed = Math.abs(oldDebt - calculatedDebt) > 0.01

      if (changed) {
        await prisma.customer.update({
          where: { systemId: customer.systemId },
          data: { currentDebt: calculatedDebt }
        })
        updated++
      } else {
        unchanged++
      }

      // Only include in results if changed or has debt
      if (changed || calculatedDebt !== 0) {
        results.push({
          systemId: customer.systemId,
          name: customer.name,
          oldDebt,
          newDebt: calculatedDebt,
          changed,
        })
      }
    }

    return apiSuccess({
      message: `Synced ${updated} customers, ${unchanged} unchanged`,
      updated,
      unchanged,
      total: customersWithOrders.length,
      details: results,
    })
}, { permission: 'edit_customers' })
