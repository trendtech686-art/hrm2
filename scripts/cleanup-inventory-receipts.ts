/**
 * Xóa tất cả đơn nhập kho (InventoryReceipt + InventoryReceiptItem)
 * Run: npx tsx scripts/cleanup-inventory-receipts.ts
 */

import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL!
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

async function main() {
  console.log('🗑️  Bắt đầu xóa dữ liệu đơn nhập kho...\n')

  // 1. Count before delete
  const receiptCount = await prisma.inventoryReceipt.count()
  const receiptItemCount = await prisma.inventoryReceiptItem.count()
  console.log(`📊 Trước khi xóa:`)
  console.log(`   - Đơn nhập kho: ${receiptCount}`)
  console.log(`   - Chi tiết đơn nhập: ${receiptItemCount}\n`)

  // 2. Xóa items trước (FK)
  console.log('📋 Xóa dữ liệu...')
  const deletedItems = await prisma.inventoryReceiptItem.deleteMany({})
  console.log(`  ✓ Chi tiết đơn nhập: ${deletedItems.count}`)

  // 3. Xóa đơn nhập
  const deletedReceipts = await prisma.inventoryReceipt.deleteMany({})
  console.log(`  ✓ Đơn nhập kho: ${deletedReceipts.count}`)

  // 4. Xóa stock history liên quan đến đơn nhập
  const deletedStockHistory = await prisma.stockHistory.deleteMany({
    where: { documentType: { in: ['purchase_order', 'inventory_receipt'] } },
  })
  console.log(`  ✓ Lịch sử kho (đơn nhập): ${deletedStockHistory.count}`)

  // 5. Xóa activity logs liên quan
  const deletedLogs = await prisma.activityLog.deleteMany({
    where: { entityType: 'inventory_receipt' },
  })
  console.log(`  ✓ Activity logs: ${deletedLogs.count}`)

  // 6. Verify
  const remaining = await prisma.inventoryReceipt.count()
  console.log(`\n📊 Sau khi xóa: ${remaining} đơn nhập còn lại`)
  console.log(`\n✨ Hoàn thành!`)
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
