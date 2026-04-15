/**
 * Sync ProductInventory committed/inTransit/inDelivery counters
 * from actual orders, stock transfers, and warranties
 * 
 * These counters have drifted due to missing decrements in various workflows.
 * This script recalculates them from source data.
 * 
 * Usage: npx tsx scripts/sync-stock-counters.ts
 * Dry-run: npx tsx scripts/sync-stock-counters.ts --dry-run
 */

import 'dotenv/config';
import { prisma } from '../lib/prisma';

const isDryRun = process.argv.includes('--dry-run');

async function main() {
  console.log(`🔄 Syncing ProductInventory counters (${isDryRun ? 'DRY RUN' : 'LIVE'})...\n`);

  // ═══════════════════════════════════════════════════════════
  // 1. Calculate COMMITTED from actual orders + warranties
  // ═══════════════════════════════════════════════════════════
  
  // 1a. Orders: pending stock-out (not cancelled/completed/delivered, not fully stocked out)
  const committedFromOrders = await prisma.$queryRawUnsafe<Array<{
    productId: string;
    branchId: string;
    committed: number;
  }>>(`
    SELECT 
      oli."productId",
      o."branchId",
      COALESCE(SUM(oli.quantity), 0)::int as committed
    FROM orders o
    JOIN order_line_items oli ON oli."orderId" = o."systemId"
    WHERE o.status NOT IN ('CANCELLED', 'COMPLETED', 'DELIVERED')
      AND o."stockOutStatus" != 'FULLY_STOCKED_OUT'
      AND oli."productId" IS NOT NULL
    GROUP BY oli."productId", o."branchId"
  `);

  console.log(`📦 Committed from orders: ${committedFromOrders.length} product-branch pairs`);

  // 1b. Warranties: replacement items pending stock-out
  // (resolution='replace' and stockDeducted=false)
  const warranties = await prisma.warranty.findMany({
    where: {
      status: { notIn: ['COMPLETED', 'RETURNED', 'CANCELLED'] },
      stockDeducted: false,
    },
    select: {
      branchSystemId: true,
      products: true,
    },
  });

  const warrantyCommitted = new Map<string, number>(); // key: `${productId}|${branchId}`
  for (const w of warranties) {
    const products = w.products as Array<{
      productSystemId?: string;
      resolution?: string;
      quantity?: number;
    }> | null;
    if (!products || !Array.isArray(products) || !w.branchSystemId) continue;

    for (const p of products) {
      if (p.resolution === 'replace' && p.productSystemId) {
        const key = `${p.productSystemId}|${w.branchSystemId}`;
        warrantyCommitted.set(key, (warrantyCommitted.get(key) || 0) + (p.quantity || 1));
      }
    }
  }

  console.log(`📦 Committed from warranties: ${warrantyCommitted.size} product-branch pairs`);

  // Merge committed from orders + warranties
  const committedMap = new Map<string, number>();
  for (const row of committedFromOrders) {
    const key = `${row.productId}|${row.branchId}`;
    committedMap.set(key, (committedMap.get(key) || 0) + row.committed);
  }
  for (const [key, qty] of warrantyCommitted) {
    committedMap.set(key, (committedMap.get(key) || 0) + qty);
  }

  // ═══════════════════════════════════════════════════════════
  // 2. Calculate IN-DELIVERY from dispatched orders
  // ═══════════════════════════════════════════════════════════
  
  const inDeliveryFromOrders = await prisma.$queryRawUnsafe<Array<{
    productId: string;
    branchId: string;
    inDelivery: number;
  }>>(`
    SELECT 
      oli."productId",
      o."branchId",
      COALESCE(SUM(oli.quantity), 0)::int as "inDelivery"
    FROM orders o
    JOIN order_line_items oli ON oli."orderId" = o."systemId"
    WHERE o.status NOT IN ('CANCELLED', 'COMPLETED', 'DELIVERED')
      AND o."stockOutStatus" = 'FULLY_STOCKED_OUT'
      AND oli."productId" IS NOT NULL
    GROUP BY oli."productId", o."branchId"
  `);

  const inDeliveryMap = new Map<string, number>();
  for (const row of inDeliveryFromOrders) {
    const key = `${row.productId}|${row.branchId}`;
    inDeliveryMap.set(key, row.inDelivery);
  }

  console.log(`📦 In-delivery from orders: ${inDeliveryFromOrders.length} product-branch pairs`);

  // ═══════════════════════════════════════════════════════════
  // 3. Calculate IN-TRANSIT from stock transfers
  // ═══════════════════════════════════════════════════════════
  
  const transitTransfers = await prisma.stockTransfer.findMany({
    where: { status: 'IN_TRANSIT' },
    select: {
      toBranchSystemId: true,
      items: { select: { productId: true, quantity: true } },
    },
  });

  const inTransitMap = new Map<string, number>();
  for (const transfer of transitTransfers) {
    if (!transfer.toBranchSystemId) continue;
    for (const item of transfer.items) {
      const key = `${item.productId}|${transfer.toBranchSystemId}`;
      inTransitMap.set(key, (inTransitMap.get(key) || 0) + item.quantity);
    }
  }

  console.log(`📦 In-transit from stock transfers: ${inTransitMap.size} product-branch pairs`);

  // ═══════════════════════════════════════════════════════════
  // 4. Get all current ProductInventory records
  // ═══════════════════════════════════════════════════════════
  
  const allInventory = await prisma.productInventory.findMany({
    select: { productId: true, branchId: true, committed: true, inTransit: true, inDelivery: true },
  });

  console.log(`\n📊 Total ProductInventory records: ${allInventory.length}`);

  // ═══════════════════════════════════════════════════════════
  // 5. Update: set each record to calculated value
  // ═══════════════════════════════════════════════════════════
  
  let updatedCount = 0;
  let skippedCount = 0;
  const mismatches: Array<{
    productId: string;
    branchId: string;
    field: string;
    old: number;
    new: number;
  }> = [];

  for (const inv of allInventory) {
    const key = `${inv.productId}|${inv.branchId}`;
    const calcCommitted = committedMap.get(key) || 0;
    const calcInTransit = inTransitMap.get(key) || 0;
    const calcInDelivery = inDeliveryMap.get(key) || 0;

    const needsUpdate =
      inv.committed !== calcCommitted ||
      inv.inTransit !== calcInTransit ||
      inv.inDelivery !== calcInDelivery;

    if (!needsUpdate) {
      skippedCount++;
      continue;
    }

    if (inv.committed !== calcCommitted) {
      mismatches.push({ productId: inv.productId, branchId: inv.branchId, field: 'committed', old: inv.committed, new: calcCommitted });
    }
    if (inv.inTransit !== calcInTransit) {
      mismatches.push({ productId: inv.productId, branchId: inv.branchId, field: 'inTransit', old: inv.inTransit, new: calcInTransit });
    }
    if (inv.inDelivery !== calcInDelivery) {
      mismatches.push({ productId: inv.productId, branchId: inv.branchId, field: 'inDelivery', old: inv.inDelivery, new: calcInDelivery });
    }

    if (!isDryRun) {
      await prisma.productInventory.update({
        where: { productId_branchId: { productId: inv.productId, branchId: inv.branchId } },
        data: {
          committed: calcCommitted,
          inTransit: calcInTransit,
          inDelivery: calcInDelivery,
        },
      });
    }

    updatedCount++;
  }

  // ═══════════════════════════════════════════════════════════
  // 6. Report
  // ═══════════════════════════════════════════════════════════
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 SYNC RESULTS (${isDryRun ? 'DRY RUN' : 'APPLIED'}):`);
  console.log(`   Records needing update: ${updatedCount}`);
  console.log(`   Records already correct: ${skippedCount}`);
  console.log(`   Total mismatches: ${mismatches.length}`);

  if (mismatches.length > 0) {
    // Show top mismatches by absolute difference
    const sorted = mismatches.sort((a, b) => Math.abs(b.old - b.new) - Math.abs(a.old - a.new));
    console.log(`\n   Top 20 mismatches:`);
    for (const m of sorted.slice(0, 20)) {
      console.log(`     ${m.field}: ${m.old} → ${m.new} (diff: ${m.old - m.new}) [product: ${m.productId}, branch: ${m.branchId}]`);
    }
  }

  // Also update the Product.totalCommitted (computed column)
  if (!isDryRun) {
    console.log('\n🔄 Updating Product.totalCommitted from synced inventory...');
    const aggregated = await prisma.$queryRawUnsafe<Array<{
      productId: string;
      totalCommitted: number;
    }>>(`
      SELECT 
        "productId",
        COALESCE(SUM("committed"), 0)::int as "totalCommitted"
      FROM product_inventory
      GROUP BY "productId"
    `);

    let productUpdated = 0;
    for (const row of aggregated) {
      await prisma.product.update({
        where: { systemId: row.productId },
        data: { totalCommitted: row.totalCommitted },
      });
      productUpdated++;
    }

    // Also reset products that have no inventory records
    await prisma.product.updateMany({
      where: { systemId: { notIn: aggregated.map(r => r.productId) } },
      data: { totalCommitted: 0 },
    });

    console.log(`   Updated ${productUpdated} products' totalCommitted`);
  }

  console.log('\n✅ Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
