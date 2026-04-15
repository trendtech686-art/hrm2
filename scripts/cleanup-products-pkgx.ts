/**
 * Xóa tất cả sản phẩm HRM + tất cả PKGX mapping để test lại
 * Run: npx tsx scripts/cleanup-products-pkgx.ts
 */

import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL!
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

async function main() {
  console.log('🗑️  Bắt đầu xóa dữ liệu sản phẩm + PKGX mapping...\n')

  // 1. Count before delete
  const productCount = await prisma.product.count()
  const pkgxProductCount = await prisma.pkgxProduct.count()
  console.log(`📊 Trước khi xóa:`)
  console.log(`   - Sản phẩm HRM: ${productCount}`)
  console.log(`   - PKGX Products: ${pkgxProductCount}\n`)

  // 2. Xóa FK dependencies trước
  console.log('📋 Xóa bảng liên quan (FK)...')
  
  const productSerials = await prisma.productSerial.deleteMany({})
  console.log(`  ✓ Product Serials: ${productSerials.count}`)
  const productBatches = await prisma.productBatch.deleteMany({})
  console.log(`  ✓ Product Batches: ${productBatches.count}`)
  const productPrices = await prisma.productPrice.deleteMany({})
  console.log(`  ✓ Product Prices: ${productPrices.count}`)
  const productConversions = await prisma.productConversion.deleteMany({})
  console.log(`  ✓ Product Conversions: ${productConversions.count}`)
  const productInventory = await prisma.productInventory.deleteMany({})
  console.log(`  ✓ Product Inventory: ${productInventory.count}`)
  const productCategories = await prisma.productCategory.deleteMany({})
  console.log(`  ✓ Product Categories: ${productCategories.count}`)

  // 3. Xóa tất cả sản phẩm HRM
  const deletedProducts = await prisma.product.deleteMany({})
  console.log(`\n✅ Đã xóa ${deletedProducts.count} sản phẩm HRM`)

  // 4. Xóa tất cả PKGX products (mapping)
  const deletedPkgx = await prisma.pkgxProduct.deleteMany({})
  console.log(`✅ Đã xóa ${deletedPkgx.count} PKGX products`)

  // 5. Verify
  const remainingProducts = await prisma.product.count()
  const remainingPkgx = await prisma.pkgxProduct.count()
  console.log(`\n📊 Sau khi xóa:`)
  console.log(`   - Sản phẩm HRM: ${remainingProducts}`)
  console.log(`   - PKGX Products: ${remainingPkgx}`)
  console.log(`\n✨ Hoàn thành!`)
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
