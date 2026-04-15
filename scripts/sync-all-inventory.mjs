/**
 * Comprehensive Inventory Sync Script
 * 
 * Recalculates and syncs all ProductInventory fields:
 * - committed: From pending orders (not cancelled, not completed, not fully dispatched)
 * - inDelivery: From dispatched orders (fully stocked out, not completed/delivered)
 * - inTransit: From stock transfers (IN_TRANSIT status)
 * 
 * Run: npx tsx scripts/sync-all-inventory.mjs
 */
import 'dotenv/config';
import { prisma } from '../lib/prisma.ts';

async function main() {
  console.log('='.repeat(60));
  console.log('🔄 COMPREHENSIVE INVENTORY SYNC');
  console.log('='.repeat(60));
  console.log('Starting at:', new Date().toISOString());
  console.log('');

  // Get all product inventories
  const productInventories = await prisma.productInventory.findMany({
    select: {
      productId: true,
      branchId: true,
      onHand: true,
      committed: true,
      inDelivery: true,
      inTransit: true,
    },
  });

  console.log(`📦 Found ${productInventories.length} product inventory records\n`);

  // Group by branch for better logging
  const byBranch = new Map();
  for (const inv of productInventories) {
    const list = byBranch.get(inv.branchId) || [];
    list.push(inv);
    byBranch.set(inv.branchId, list);
  }

  let totalUpdated = 0;
  let totalUnchanged = 0;
  let totalErrors = 0;

  const changes = {
    committed: { fixed: 0, total: 0 },
    inDelivery: { fixed: 0, total: 0 },
    inTransit: { fixed: 0, total: 0 },
  };

  for (const [branchId, inventories] of byBranch) {
    console.log(`\n📍 Processing branch: ${branchId}`);
    console.log('-'.repeat(40));

    let branchUpdated = 0;
    let branchUnchanged = 0;

    for (const inv of inventories) {
      try {
        // === Calculate COMMITTED ===
        // From orders: not cancelled, not completed/delivered, not fully stocked out
        const committedOrders = await prisma.order.findMany({
          where: {
            branchId: inv.branchId,
            lineItems: { some: { productId: inv.productId } },
            status: { notIn: ['CANCELLED', 'COMPLETED', 'DELIVERED'] },
            stockOutStatus: { not: 'FULLY_STOCKED_OUT' },
          },
          select: {
            lineItems: {
              where: { productId: inv.productId },
              select: { quantity: true },
            },
          },
        });
        const actualCommitted = committedOrders.reduce((sum, o) =>
          sum + o.lineItems.reduce((s, li) => s + Number(li.quantity), 0), 0);

        // === Calculate IN_DELIVERY ===
        // From orders: fully stocked out, not completed/delivered/cancelled
        const inDeliveryOrders = await prisma.order.findMany({
          where: {
            branchId: inv.branchId,
            lineItems: { some: { productId: inv.productId } },
            status: { notIn: ['CANCELLED', 'COMPLETED', 'DELIVERED'] },
            stockOutStatus: 'FULLY_STOCKED_OUT',
          },
          select: {
            lineItems: {
              where: { productId: inv.productId },
              select: { quantity: true },
            },
          },
        });
        const actualInDelivery = inDeliveryOrders.reduce((sum, o) =>
          sum + o.lineItems.reduce((s, li) => s + Number(li.quantity), 0), 0);

        // === Calculate IN_TRANSIT ===
        // From stock transfers: IN_TRANSIT status, heading TO this branch
        const inTransitTransfers = await prisma.stockTransfer.findMany({
          where: {
            toBranchSystemId: inv.branchId,
            status: 'IN_TRANSIT',
            items: { some: { productId: inv.productId } },
          },
          select: {
            items: {
              where: { productId: inv.productId },
              select: { quantity: true },
            },
          },
        });
        const actualInTransit = inTransitTransfers.reduce((sum, t) =>
          sum + t.items.reduce((s, item) => s + Number(item.quantity), 0), 0);

        // === Compare and update ===
        const currentCommitted = Number(inv.committed || 0);
        const currentInDelivery = Number(inv.inDelivery || 0);
        const currentInTransit = Number(inv.inTransit || 0);

        const needsUpdate =
          actualCommitted !== currentCommitted ||
          actualInDelivery !== currentInDelivery ||
          actualInTransit !== currentInTransit;

        if (needsUpdate) {
          await prisma.productInventory.update({
            where: { productId_branchId: { productId: inv.productId, branchId: inv.branchId } },
            data: {
              committed: actualCommitted,
              inDelivery: actualInDelivery,
              inTransit: actualInTransit,
            },
          });

          // Track changes
          if (actualCommitted !== currentCommitted) {
            changes.committed.fixed++;
            changes.committed.total += Math.abs(actualCommitted - currentCommitted);
          }
          if (actualInDelivery !== currentInDelivery) {
            changes.inDelivery.fixed++;
            changes.inDelivery.total += Math.abs(actualInDelivery - currentInDelivery);
          }
          if (actualInTransit !== currentInTransit) {
            changes.inTransit.fixed++;
            changes.inTransit.total += Math.abs(actualInTransit - currentInTransit);
          }

          console.log(`  [UPDATED] ${inv.productId}:`);
          if (actualCommitted !== currentCommitted) {
            console.log(`    committed: ${currentCommitted} → ${actualCommitted}`);
          }
          if (actualInDelivery !== currentInDelivery) {
            console.log(`    inDelivery: ${currentInDelivery} → ${actualInDelivery}`);
          }
          if (actualInTransit !== currentInTransit) {
            console.log(`    inTransit: ${currentInTransit} → ${actualInTransit}`);
          }

          branchUpdated++;
          totalUpdated++;
        } else {
          branchUnchanged++;
          totalUnchanged++;
        }
      } catch (error) {
        console.error(`  [ERROR] ${inv.productId}:`, error);
        totalErrors++;
      }
    }

    console.log(`  Summary: ${branchUpdated} updated, ${branchUnchanged} unchanged`);
  }

  // === Final Summary ===
  console.log('\n' + '='.repeat(60));
  console.log('📊 SYNC COMPLETE - SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total records: ${productInventories.length}`);
  console.log(`Updated: ${totalUpdated}`);
  console.log(`Unchanged: ${totalUnchanged}`);
  console.log(`Errors: ${totalErrors}`);
  console.log('');
  console.log('Changes by field:');
  console.log(`  committed: ${changes.committed.fixed} records fixed (total diff: ${changes.committed.total})`);
  console.log(`  inDelivery: ${changes.inDelivery.fixed} records fixed (total diff: ${changes.inDelivery.total})`);
  console.log(`  inTransit: ${changes.inTransit.fixed} records fixed (total diff: ${changes.inTransit.total})`);
  console.log('');
  console.log('Finished at:', new Date().toISOString());
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
