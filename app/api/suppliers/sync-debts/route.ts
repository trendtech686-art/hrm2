/**
 * Sync Supplier Debts API
 * 
 * POST /api/suppliers/sync-debts
 * 
 * Recalculates and updates currentDebt for all suppliers based on:
 * - POs with deliveryStatus 'Đã nhập' (creates debt)
 * - Payments to supplier (reduces debt)
 * - Receipts from supplier (reduces debt - refunds)
 * - Purchase returns (reduces debt)
 * 
 * Formula: currentDebt = Σ(PO subtotal - discount) - Σ(Payments) - Σ(Receipts) - Σ(Returns)
 */

import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

export const POST = apiHandler(async () => {
  const suppliers = await prisma.supplier.findMany({
      where: { isDeleted: false },
      select: { systemId: true, name: true, currentDebt: true },
    })

    const results: Array<{
      systemId: string
      name: string
      oldDebt: number
      newDebt: number
      changed: boolean
    }> = []

    let updated = 0
    let unchanged = 0

    for (const supplier of suppliers) {
      // 1. POs with goods received (deliveryStatus = 'Đã nhập')
      const posForDebt = await prisma.purchaseOrder.findMany({
        where: {
          OR: [
            { supplierSystemId: supplier.systemId },
            { supplierId: supplier.systemId },
          ],
          isDeleted: false,
          status: { not: 'CANCELLED' },
          deliveryStatus: 'Đã nhập',
        },
        select: { systemId: true, subtotal: true, discount: true, discountType: true },
      })

      const totalPurchases = posForDebt.reduce((sum, po) => {
        const subtotal = Number(po.subtotal ?? 0)
        const discount = Number(po.discount ?? 0)
        const discountValue = po.discountType === 'percentage'
          ? (subtotal * discount / 100)
          : discount
        return sum + (subtotal - discountValue)
      }, 0)

      // 2. Payments to supplier (reduces debt)
      const paymentResult = await prisma.payment.aggregate({
        where: {
          status: { not: 'cancelled' },
          OR: [
            { supplierId: supplier.systemId },
            { recipientSystemId: supplier.systemId },
          ],
        },
        _sum: { amount: true },
      })
      const totalPayments = Number(paymentResult._sum.amount || 0)

      // 3. Receipts from supplier (refunds, reduces debt)
      const receiptResult = await prisma.receipt.aggregate({
        where: {
          payerSystemId: supplier.systemId,
          status: { not: 'cancelled' },
        },
        _sum: { amount: true },
      })
      const totalReceipts = Number(receiptResult._sum.amount || 0)

      // 4. Purchase returns (reduces debt)
      const poSystemIds = posForDebt.map(p => p.systemId)
      const returnResult = await prisma.purchaseReturn.aggregate({
        where: {
          OR: [
            { supplierSystemId: supplier.systemId },
            { supplierId: supplier.systemId },
            ...(poSystemIds.length > 0 ? [{ purchaseOrderSystemId: { in: poSystemIds } }] : []),
          ],
          status: { not: 'CANCELLED' },
        },
        _sum: { totalReturnValue: true },
      })
      const totalReturns = Number(returnResult._sum.totalReturnValue || 0)

      // Calculate correct debt
      const calculatedDebt = totalPurchases - totalPayments - totalReceipts - totalReturns
      const oldDebt = Number(supplier.currentDebt ?? 0)
      const changed = Math.abs(oldDebt - calculatedDebt) > 0.01

      if (changed) {
        await prisma.supplier.update({
          where: { systemId: supplier.systemId },
          data: { currentDebt: calculatedDebt },
        })
        updated++
      } else {
        unchanged++
      }

      if (changed || calculatedDebt !== 0) {
        results.push({
          systemId: supplier.systemId,
          name: supplier.name,
          oldDebt,
          newDebt: calculatedDebt,
          changed,
        })
      }
    }

    return apiSuccess({
      message: `Đã đồng bộ ${updated} nhà cung cấp, ${unchanged} không thay đổi`,
      updated,
      unchanged,
      total: suppliers.length,
      details: results,
    })
}, { permission: 'edit_suppliers' })
