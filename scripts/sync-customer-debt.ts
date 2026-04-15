/**
 * Script to sync customer.currentDebt based on actual transactions
 * 
 * Formula (matching /api/customers/[systemId]/debt):
 * Công nợ KH = Σ(Orders delivered) - Σ(SalesReturns received) - Σ(Receipts affectsDebt) + Σ(Refund payments from SR) + Σ(Regular payments affectsDebt)
 * 
 * Run: npx tsx scripts/sync-customer-debt.ts
 */

import { config } from 'dotenv'
config()

async function syncCustomerDebt() {
  const { prisma } = await import('../lib/prisma')

  console.log('🔄 Starting customer debt synchronization...\n')

  try {
    const customers = await prisma.customer.findMany({
      where: { isDeleted: false },
      select: { systemId: true, name: true, currentDebt: true },
    })

    console.log(`Found ${customers.length} customers to process\n`)

    let updatedCount = 0
    let unchangedCount = 0
    let withDebtCount = 0
    const errors: string[] = []

    for (const customer of customers) {
      try {
        const [deliveredOrdersSum, salesReturnSum, receiptSum, paymentsRaw, refundSum] = await Promise.all([
          // Delivered orders (creates debt)
          prisma.order.aggregate({
            where: {
              customerId: customer.systemId,
              status: { not: 'CANCELLED' },
              OR: [
                { status: 'COMPLETED' },
                { deliveryStatus: 'DELIVERED' },
                { stockOutStatus: 'FULLY_STOCKED_OUT' },
              ],
            },
            _sum: { grandTotal: true },
          }),
          // Sales returns received (reduces debt)
          prisma.salesReturn.aggregate({
            where: {
              customerSystemId: customer.systemId,
              isReceived: true,
              status: { not: 'REJECTED' },
            },
            _sum: { totalReturnValue: true },
          }),
          // Receipts that affect debt (reduces debt)
          prisma.receipt.aggregate({
            where: {
              status: { not: 'cancelled' },
              affectsDebt: true,
              OR: [
                { customerSystemId: customer.systemId },
                { payerSystemId: customer.systemId },
                ...(customer.name ? [{ payerTypeName: 'Khách hàng' as const, payerName: customer.name }] : []),
              ],
            },
            _sum: { amount: true },
          }),
          // Regular payments (non-refund, non-complaint, affectsDebt) → increases debt
          prisma.payment.findMany({
            where: {
              status: { not: 'cancelled' },
              affectsDebt: true,
              linkedSalesReturnSystemId: null,
              linkedComplaintSystemId: null,
              OR: [
                { customerSystemId: customer.systemId },
                { recipientSystemId: customer.systemId },
                ...(customer.name ? [{ recipientTypeName: 'Khách hàng' as const, recipientName: customer.name }] : []),
              ],
            },
            select: { amount: true },
          }),
          // Sales return refunds → increases debt (from negative to 0)
          prisma.payment.aggregate({
            where: {
              status: { not: 'cancelled' },
              linkedSalesReturnSystemId: { not: null },
              OR: [
                { customerSystemId: customer.systemId },
                { recipientSystemId: customer.systemId },
                ...(customer.name ? [{ recipientTypeName: 'Khách hàng' as const, recipientName: customer.name }] : []),
              ],
            },
            _sum: { amount: true },
          }),
        ])

        let regularPaymentTotal = 0
        for (const p of paymentsRaw) {
          regularPaymentTotal += Number(p.amount) || 0
        }

        const orders = Number(deliveredOrdersSum._sum.grandTotal ?? 0)
        const returns = Number(salesReturnSum._sum.totalReturnValue ?? 0)
        const receipts = Number(receiptSum._sum.amount ?? 0)
        const refunds = Number(refundSum._sum.amount ?? 0)

        // Công nợ = Orders - Returns - Receipts + Refunds + Regular Payments
        const correctDebt = orders - returns - receipts + refunds + regularPaymentTotal
        const currentDebt = Number(customer.currentDebt || 0)

        if (Math.abs(correctDebt) > 0.01) withDebtCount++

        if (Math.abs(correctDebt - currentDebt) > 0.01) {
          // Only log customers that change
          console.log(`📊 ${customer.name} (${customer.systemId}):`)
          console.log(`   Orders: +${orders.toLocaleString('vi-VN')} đ`)
          console.log(`   Returns: -${returns.toLocaleString('vi-VN')} đ`)
          console.log(`   Receipts: -${receipts.toLocaleString('vi-VN')} đ`)
          console.log(`   Refunds: +${refunds.toLocaleString('vi-VN')} đ`)
          console.log(`   Payments: +${regularPaymentTotal.toLocaleString('vi-VN')} đ`)
          console.log(`   DB: ${currentDebt.toLocaleString('vi-VN')} → ${correctDebt.toLocaleString('vi-VN')} đ`)
          console.log(`   ✅ UPDATED\n`)

          await prisma.customer.update({
            where: { systemId: customer.systemId },
            data: { currentDebt: correctDebt, updatedAt: new Date() },
          })
          updatedCount++
        } else {
          unchangedCount++
        }
      } catch (error) {
        const msg = `Error processing ${customer.name}: ${error instanceof Error ? error.message : String(error)}`
        console.error(`   ❌ ${msg}\n`)
        errors.push(msg)
      }
    }

    console.log('━'.repeat(50))
    console.log('📈 Summary:')
    console.log(`   Total customers: ${customers.length}`)
    console.log(`   Customers with debt: ${withDebtCount}`)
    console.log(`   Updated: ${updatedCount}`)
    console.log(`   Unchanged: ${unchangedCount}`)
    if (errors.length > 0) {
      console.log(`   Errors: ${errors.length}`)
      errors.forEach(e => console.log(`      - ${e}`))
    }
    console.log('━'.repeat(50))
    console.log('\n✅ Customer debt synchronization completed!')

    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

syncCustomerDebt()
