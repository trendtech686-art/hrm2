/**
 * Script to sync totalInventory, totalCommitted, totalAvailable for all products
 * Run this periodically or after bulk inventory updates
 * 
 * Usage: npx tsx scripts/sync-product-inventory-totals.ts
 */

import 'dotenv/config';
import { prisma } from '../lib/prisma.js';

async function syncProductInventoryTotals() {
  console.log('🔄 Syncing product inventory totals...\n');

  try {
    // Get all products with inventory data
    const products = await prisma.product.findMany({
      where: { isDeleted: false },
      select: {
        systemId: true,
        inventoryByBranch: true,
        committedByBranch: true,
      },
    });

    console.log(`📦 Found ${products.length} products to sync\n`);

    let updated = 0;
    const batchSize = 100;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (product) => {
          const inv = product.inventoryByBranch as Record<string, number> | null;
          const committed = product.committedByBranch as Record<string, number> | null;

          const totalInventory = inv
            ? Object.values(inv).reduce((sum, qty) => sum + (qty || 0), 0)
            : 0;

          const totalCommitted = committed
            ? Object.values(committed).reduce((sum, qty) => sum + (qty || 0), 0)
            : 0;

          const totalAvailable = Math.max(0, totalInventory - totalCommitted);

          await prisma.product.update({
            where: { systemId: product.systemId },
            data: {
              totalInventory,
              totalCommitted,
              totalAvailable,
              inventoryUpdatedAt: new Date(),
            },
          });

          updated++;
        })
      );

      console.log(`  ✅ Processed ${Math.min(i + batchSize, products.length)}/${products.length} products`);
    }

    console.log(`\n🎉 Done! Updated ${updated} products.`);
  } catch (error) {
    console.error('❌ Error syncing inventory totals:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

syncProductInventoryTotals().catch(console.error);
