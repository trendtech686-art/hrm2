/**
 * Backfill ProductInventory counters (committed, inDelivery) and Product.totalSold
 * from actual order data. Also syncs Product cache fields (*ByBranch).
 *
 * Run after Sapo batch imports that didn't update counters correctly.
 *
 * Usage: npx tsx scripts/backfill-inventory-counters.ts
 */

import 'dotenv/config'
import { prisma } from '../lib/prisma.js'

async function main() {
  console.log('=== Backfill Inventory Counters ===\n')

  // Step 1: Calculate expected counters from orders
  console.log('📊 Step 1: Aggregating order data...')

  // committed = qty from orders NOT cancelled, NOT fully stocked out
  const committedRows = await prisma.$queryRawUnsafe<
    Array<{ productId: string; branchId: string; total: bigint }>
  >(`
    SELECT oli."productId", o."branchId", SUM(oli.quantity)::bigint as total
    FROM order_line_items oli
    JOIN orders o ON o."systemId" = oli."orderId"
    WHERE o.status NOT IN ('CANCELLED')
      AND o."stockOutStatus" != 'FULLY_STOCKED_OUT'
      AND oli."productId" IS NOT NULL
      AND oli.quantity > 0
    GROUP BY oli."productId", o."branchId"
  `)

  // inDelivery = qty from orders that are stocked out but NOT delivered/completed
  const inDeliveryRows = await prisma.$queryRawUnsafe<
    Array<{ productId: string; branchId: string; total: bigint }>
  >(`
    SELECT oli."productId", o."branchId", SUM(oli.quantity)::bigint as total
    FROM order_line_items oli
    JOIN orders o ON o."systemId" = oli."orderId"
    WHERE o.status NOT IN ('CANCELLED', 'COMPLETED', 'DELIVERED')
      AND o."stockOutStatus" = 'FULLY_STOCKED_OUT'
      AND oli."productId" IS NOT NULL
      AND oli.quantity > 0
    GROUP BY oli."productId", o."branchId"
  `)

  // totalSold = qty from stocked-out, non-cancelled orders (same as sold-count API)
  const soldRows = await prisma.$queryRawUnsafe<
    Array<{ productId: string; total: bigint }>
  >(`
    SELECT oli."productId", SUM(oli.quantity)::bigint as total
    FROM order_line_items oli
    JOIN orders o ON o."systemId" = oli."orderId"
    WHERE o.status NOT IN ('CANCELLED')
      AND o."stockOutStatus" = 'FULLY_STOCKED_OUT'
      AND oli."productId" IS NOT NULL
      AND oli.quantity > 0
    GROUP BY oli."productId"
  `)

  // Build maps
  type BranchKey = `${string}|${string}`
  const committedMap = new Map<BranchKey, number>()
  for (const r of committedRows) {
    committedMap.set(`${r.productId}|${r.branchId}`, Number(r.total))
  }

  const inDeliveryMap = new Map<BranchKey, number>()
  for (const r of inDeliveryRows) {
    inDeliveryMap.set(`${r.productId}|${r.branchId}`, Number(r.total))
  }

  const soldMap = new Map<string, number>()
  for (const r of soldRows) {
    soldMap.set(r.productId, Number(r.total))
  }

  console.log(`  committed entries: ${committedMap.size}`)
  console.log(`  inDelivery entries: ${inDeliveryMap.size}`)
  console.log(`  sold products: ${soldMap.size}`)

  // Step 2: Fix ProductInventory records
  console.log('\n🔧 Step 2: Fixing ProductInventory counters...')

  const allInventory = await prisma.productInventory.findMany({
    select: { productId: true, branchId: true, onHand: true, committed: true, inDelivery: true },
  })

  let fixedInventory = 0
  const processedKeys = new Set<BranchKey>()

  for (const inv of allInventory) {
    const key: BranchKey = `${inv.productId}|${inv.branchId}`
    processedKeys.add(key)

    const expectedCommitted = committedMap.get(key) || 0
    const expectedInDelivery = inDeliveryMap.get(key) || 0

    if (inv.committed !== expectedCommitted || inv.inDelivery !== expectedInDelivery) {
      await prisma.productInventory.update({
        where: { productId_branchId: { productId: inv.productId, branchId: inv.branchId } },
        data: {
          committed: expectedCommitted,
          inDelivery: expectedInDelivery,
          updatedAt: new Date(),
        },
      })
      fixedInventory++
      if (fixedInventory <= 20) {
        console.log(`  Fixed ${inv.productId} @ ${inv.branchId}: committed ${inv.committed}→${expectedCommitted}, inDelivery ${inv.inDelivery}→${expectedInDelivery}`)
      }
    }
  }

  // Create missing ProductInventory records (orders exist but no inventory record)
  const allKeys = new Set<BranchKey>([...committedMap.keys(), ...inDeliveryMap.keys()])
  let createdInventory = 0
  for (const key of allKeys) {
    if (processedKeys.has(key)) continue
    const [productId, branchId] = key.split('|')
    const committed = committedMap.get(key) || 0
    const inDelivery = inDeliveryMap.get(key) || 0

    await prisma.productInventory.upsert({
      where: { productId_branchId: { productId, branchId } },
      update: { committed, inDelivery, updatedAt: new Date() },
      create: { productId, branchId, onHand: 0, committed, inTransit: 0, inDelivery },
    })
    createdInventory++
  }

  console.log(`  Fixed: ${fixedInventory}, Created: ${createdInventory}`)

  // Step 3: Fix Product.totalSold
  console.log('\n🔧 Step 3: Fixing Product.totalSold...')

  let fixedSold = 0
  const productsWithSold = await prisma.product.findMany({
    where: { isDeleted: false },
    select: { systemId: true, id: true, totalSold: true },
  })

  for (const product of productsWithSold) {
    const expectedSold = soldMap.get(product.systemId) || 0
    if (product.totalSold !== expectedSold) {
      await prisma.product.update({
        where: { systemId: product.systemId },
        data: { totalSold: expectedSold },
      })
      fixedSold++
      if (fixedSold <= 20) {
        console.log(`  ${product.id}: totalSold ${product.totalSold}→${expectedSold}`)
      }
    }
  }
  console.log(`  Fixed totalSold: ${fixedSold} products`)

  // Step 4: Sync Product cache fields from ProductInventory
  console.log('\n🔧 Step 4: Syncing Product cache fields (*ByBranch)...')

  const inventoryAgg = await prisma.productInventory.findMany({
    select: { productId: true, branchId: true, onHand: true, committed: true, inTransit: true, inDelivery: true },
  })

  // Group by product
  const byProduct = new Map<string, Array<{ branchId: string; onHand: number; committed: number; inTransit: number; inDelivery: number }>>()
  for (const inv of inventoryAgg) {
    const list = byProduct.get(inv.productId) || []
    list.push(inv)
    byProduct.set(inv.productId, list)
  }

  let fixedCache = 0
  const batchSize = 100
  const productIds = [...byProduct.keys()]

  for (let i = 0; i < productIds.length; i += batchSize) {
    const batch = productIds.slice(i, i + batchSize)

    await Promise.all(batch.map(async (productId) => {
      const inventories = byProduct.get(productId)!
      const inventoryByBranch: Record<string, number> = {}
      const committedByBranch: Record<string, number> = {}
      const inTransitByBranch: Record<string, number> = {}
      const inDeliveryByBranch: Record<string, number> = {}

      let totalInventory = 0
      let totalCommitted = 0

      for (const inv of inventories) {
        inventoryByBranch[inv.branchId] = inv.onHand
        if (inv.committed > 0) committedByBranch[inv.branchId] = inv.committed
        if (inv.inTransit > 0) inTransitByBranch[inv.branchId] = inv.inTransit
        if (inv.inDelivery > 0) inDeliveryByBranch[inv.branchId] = inv.inDelivery
        totalInventory += inv.onHand
        totalCommitted += inv.committed
      }

      const totalAvailable = Math.max(0, totalInventory - totalCommitted)

      await prisma.product.update({
        where: { systemId: productId },
        data: {
          inventoryByBranch,
          committedByBranch,
          inTransitByBranch,
          inDeliveryByBranch,
          totalInventory,
          totalCommitted,
          totalAvailable,
          inventoryUpdatedAt: new Date(),
        },
      }).catch(() => {}) // product may have been deleted

      fixedCache++
    }))

    console.log(`  Synced ${Math.min(i + batchSize, productIds.length)}/${productIds.length} products`)
  }

  console.log(`\n✅ Done! Summary:`)
  console.log(`  ProductInventory fixed: ${fixedInventory}, created: ${createdInventory}`)
  console.log(`  Product.totalSold fixed: ${fixedSold}`)
  console.log(`  Product cache synced: ${fixedCache}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
