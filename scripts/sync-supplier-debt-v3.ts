/**
 * Script to sync supplier.currentDebt based on actual transactions
 * 
 * Formula (matching /api/suppliers/[systemId]/stats):
 * Công nợ NCC = Σ(PO.subtotal - discount, only 'Đã nhập') - Σ(Payments) - Σ(Receipts from supplier) - Σ(PurchaseReturns)
 * 
 * Run: npx tsx scripts/sync-supplier-debt-v3.ts
 */

import { config } from 'dotenv'
config() // Load environment variables first

async function syncSupplierDebt() {
  // Dynamic import after env is loaded
  const { prisma } = await import('../lib/prisma')
  
  console.log('🔄 Starting supplier debt synchronization...\n')

  try {
    // Get all suppliers
    const suppliers = await prisma.supplier.findMany({
      where: { isDeleted: false },
      select: { systemId: true, name: true, currentDebt: true },
    })

    console.log(`Found ${suppliers.length} suppliers to process\n`)

    let updatedCount = 0
    let unchangedCount = 0
    const errors: string[] = []

    for (const supplier of suppliers) {
      try {
        // Calculate debt from POs - matching stats API formula
        // Only count POs where goods are received (deliveryStatus: 'Đã nhập')
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
          select: { subtotal: true, discount: true, discountType: true },
        })
        
        // Calculate totalPurchases = sum of (subtotal - discount)
        const totalPurchases = posForDebt.reduce((sum, po) => {
          const subtotal = Number(po.subtotal ?? 0)
          const discount = Number(po.discount ?? 0)
          const discountValue = po.discountType === 'percentage'
            ? (subtotal * discount / 100)
            : discount
          return sum + (subtotal - discountValue)
        }, 0)

        // Calculate payments (reduces debt)
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

        // Calculate receipts from supplier (refunds to us, reduces debt)
        const receiptResult = await prisma.receipt.aggregate({
          where: {
            payerSystemId: supplier.systemId,
            status: { not: 'cancelled' },
          },
          _sum: { amount: true },
        })
        const totalReceipts = Number(receiptResult._sum.amount || 0)

        // Calculate purchase returns (reduces debt)
        // Get PO systemIds for this supplier
        const poSystemIds = posForDebt.length > 0 
          ? await prisma.purchaseOrder.findMany({
              where: {
                OR: [
                  { supplierSystemId: supplier.systemId },
                  { supplierId: supplier.systemId },
                ],
                isDeleted: false,
              },
              select: { systemId: true },
            }).then(pos => pos.map(p => p.systemId))
          : []
        
        const returnResult = await prisma.purchaseReturn.aggregate({
          where: {
            OR: [
              { supplierSystemId: supplier.systemId },
              { supplierId: supplier.systemId },
              { suppliers: { systemId: supplier.systemId } },
              ...(poSystemIds.length > 0 ? [{ purchaseOrderSystemId: { in: poSystemIds } }] : []),
            ],
            status: { not: 'CANCELLED' },
          },
          _sum: { totalReturnValue: true },
        })
        const totalReturns = Number(returnResult._sum.totalReturnValue || 0)

        // Calculate correct debt (same formula as stats API)
        const correctDebt = totalPurchases - totalPayments - totalReceipts - totalReturns
        const currentDebt = Number(supplier.currentDebt || 0)

        // Log calculation details
        console.log(`📊 ${supplier.name} (${supplier.systemId}):`)
        console.log(`   Purchases (Đã nhập): ${totalPurchases.toLocaleString('vi-VN')} đ`)
        console.log(`   Payments: -${totalPayments.toLocaleString('vi-VN')} đ`)
        console.log(`   Receipts: -${totalReceipts.toLocaleString('vi-VN')} đ`)
        console.log(`   Returns: -${totalReturns.toLocaleString('vi-VN')} đ`)
        console.log(`   Calculated: ${correctDebt.toLocaleString('vi-VN')} đ`)
        console.log(`   Current DB: ${currentDebt.toLocaleString('vi-VN')} đ`)

        // Update if different
        if (Math.abs(correctDebt - currentDebt) > 0.01) {
          await prisma.supplier.update({
            where: { systemId: supplier.systemId },
            data: {
              currentDebt: correctDebt,
              updatedAt: new Date(),
            },
          })
          console.log(`   ✅ UPDATED: ${currentDebt.toLocaleString('vi-VN')} → ${correctDebt.toLocaleString('vi-VN')} đ`)
          updatedCount++
        } else {
          console.log(`   ⏭️ No change needed`)
          unchangedCount++
        }
        console.log('')

      } catch (error) {
        const errorMsg = `Error processing ${supplier.name}: ${error instanceof Error ? error.message : String(error)}`
        console.error(`   ❌ ${errorMsg}\n`)
        errors.push(errorMsg)
      }
    }

    console.log('━'.repeat(50))
    console.log('📈 Summary:')
    console.log(`   Total suppliers: ${suppliers.length}`)
    console.log(`   Updated: ${updatedCount}`)
    console.log(`   Unchanged: ${unchangedCount}`)
    if (errors.length > 0) {
      console.log(`   Errors: ${errors.length}`)
      errors.forEach(e => console.log(`      - ${e}`))
    }
    console.log('━'.repeat(50))

    console.log('\n✅ Supplier debt synchronization completed!')

  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the script
syncSupplierDebt()
