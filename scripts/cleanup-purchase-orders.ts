/**
 * Xóa tất cả đơn nhập hàng (PurchaseOrder + PurchaseOrderItem)
 * và InventoryReceipt liên quan
 * Run: npx tsx scripts/cleanup-purchase-orders.ts
 */

import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL!
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

async function main() {
  console.log('🗑️  Bắt đầu xóa dữ liệu đơn nhập hàng...\n')

  // 1. Count before delete
  const poCount = await prisma.purchaseOrder.count()
  const poItemCount = await prisma.purchaseOrderItem.count()
  const irCount = await prisma.inventoryReceipt.count()
  const irItemCount = await prisma.inventoryReceiptItem.count()
  console.log(`📊 Trước khi xóa:`)
  console.log(`   - Đơn nhập hàng (PO): ${poCount}`)
  console.log(`   - Chi tiết đơn nhập (PO Items): ${poItemCount}`)
  console.log(`   - Phiếu nhập kho (IR): ${irCount}`)
  console.log(`   - Chi tiết phiếu nhập (IR Items): ${irItemCount}\n`)

  console.log('📋 Xóa dữ liệu...')

  // 2. Xóa InventoryReceiptItem → InventoryReceipt trước (FK reference to PO)
  const deletedIRItems = await prisma.inventoryReceiptItem.deleteMany({})
  console.log(`  ✓ Chi tiết phiếu nhập kho: ${deletedIRItems.count}`)

  const deletedIR = await prisma.inventoryReceipt.deleteMany({})
  console.log(`  ✓ Phiếu nhập kho: ${deletedIR.count}`)

  // 3. Xóa PurchaseReturnItem → PurchaseReturn (FK to PO)
  const deletedPRItems = await prisma.purchaseReturnItem.deleteMany({})
  console.log(`  ✓ Chi tiết trả hàng NCC: ${deletedPRItems.count}`)

  const deletedPR = await prisma.purchaseReturn.deleteMany({})
  console.log(`  ✓ Trả hàng NCC: ${deletedPR.count}`)

  // 4. Xóa PurchaseOrderItem → PurchaseOrder
  const deletedPOItems = await prisma.purchaseOrderItem.deleteMany({})
  console.log(`  ✓ Chi tiết đơn nhập: ${deletedPOItems.count}`)

  const deletedPO = await prisma.purchaseOrder.deleteMany({})
  console.log(`  ✓ Đơn nhập hàng: ${deletedPO.count}`)

  // 5. Xóa stock history liên quan
  const deletedSH = await prisma.stockHistory.deleteMany({
    where: { documentType: { in: ['purchase_order', 'inventory_receipt'] } },
  })
  console.log(`  ✓ Lịch sử kho (nhập hàng): ${deletedSH.count}`)

  // 6. Xóa activity logs liên quan
  const deletedLogs = await prisma.activityLog.deleteMany({
    where: { entityType: { in: ['purchase_order', 'inventory_receipt'] } },
  })
  console.log(`  ✓ Activity logs: ${deletedLogs.count}`)

  // 7. Verify
  const remainingPO = await prisma.purchaseOrder.count()
  const remainingIR = await prisma.inventoryReceipt.count()
  console.log(`\n📊 Sau khi xóa:`)
  console.log(`   - Đơn nhập hàng: ${remainingPO}`)
  console.log(`   - Phiếu nhập kho: ${remainingIR}`)
  console.log(`\n✨ Hoàn thành!`)
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
