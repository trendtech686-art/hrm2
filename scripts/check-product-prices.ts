/**
 * Check product prices data consistency.
 * Verifies ProductPrice records exist and match detail view.
 *
 * Usage: npx tsx scripts/check-product-prices.ts
 */

import 'dotenv/config'
import { prisma } from '../lib/prisma.js'

async function main() {
  console.log('=== Check Product Prices ===\n')

  // 1. Count products and prices
  const totalProducts = await prisma.product.count({ where: { status: 'ACTIVE' } })
  const totalPrices = await prisma.productPrice.count()
  const policies = await prisma.pricingPolicy.findMany({ where: { isActive: true } })
  
  console.log(`Total active products: ${totalProducts}`)
  console.log(`Total ProductPrice records: ${totalPrices}`)
  console.log(`Active pricing policies: ${policies.length}`)
  for (const p of policies) {
    console.log(`  - ${p.name} (${p.systemId}) ${p.isDefault ? '[DEFAULT]' : ''}`)
  }

  // 2. Find products with missing prices
  const productsWithPrices = await prisma.$queryRawUnsafe<Array<{ cnt: bigint }>>(`
    SELECT COUNT(DISTINCT "productId") as cnt FROM product_prices
  `)
  const productsWithPriceCount = Number(productsWithPrices[0]?.cnt || 0)
  
  console.log(`\nProducts with at least 1 price: ${productsWithPriceCount}`)
  console.log(`Products with NO prices: ${totalProducts - productsWithPriceCount}`)

  // 3. Check specific product (EW47 from screenshot)
  const testProducts = await prisma.product.findMany({
    where: { id: { in: ['EW47'] } },
    select: {
      systemId: true,
      id: true,
      name: true,
      costPrice: true,
      lastPurchasePrice: true,
      prices: { include: { pricingPolicy: true } },
    },
  })

  for (const p of testProducts) {
    console.log(`\n📦 ${p.id} - ${p.name}`)
    console.log(`  costPrice: ${p.costPrice}`)
    console.log(`  lastPurchasePrice: ${p.lastPurchasePrice}`)
    console.log(`  Prices (${p.prices.length}):`)
    for (const pr of p.prices) {
      console.log(`    ${pr.pricingPolicy.name}: ${pr.price}`)
    }
  }

  // 4. Sample products without prices
  const productsNoPrices = await prisma.$queryRawUnsafe<Array<{ id: string; name: string; "pkgxId": number | null }>>(`
    SELECT p.id, p.name, p."pkgxId"
    FROM products p
    WHERE p.status = 'ACTIVE'
      AND NOT EXISTS (SELECT 1 FROM product_prices pp WHERE pp."productId" = p."systemId")
    LIMIT 10
  `)
  
  if (productsNoPrices.length > 0) {
    console.log('\n⚠️ Sample products WITHOUT any prices:')
    for (const p of productsNoPrices) {
      console.log(`  ${p.id} | ${p.name.substring(0, 50)} | pkgxId: ${p.pkgxId || '-'}`)
    }
  }

  // 5. Check if prices are set via detail API but not in list
  // Get a product that has prices in DB
  const sampleWithPrice = await prisma.product.findFirst({
    where: { status: 'ACTIVE', prices: { some: {} } },
    select: {
      systemId: true,
      id: true,
      name: true,
      prices: { select: { pricingPolicyId: true, price: true } },
    },
  })
  if (sampleWithPrice) {
    console.log(`\n✅ Sample product WITH prices: ${sampleWithPrice.id} - ${sampleWithPrice.name.substring(0, 40)}`)
    for (const pr of sampleWithPrice.prices) {
      console.log(`  policy ${pr.pricingPolicyId}: ${pr.price}`)
    }
  }

  console.log('\n✅ Done!')
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error('❌ Error:', e)
  await prisma.$disconnect()
  process.exit(1)
})
