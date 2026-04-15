/**
 * Script to sync totalInventory, totalCommitted, totalAvailable for all products
 * Reads from productInventory table (source of truth), updates product computed columns
 * Run this periodically or after bulk inventory updates
 * 
 * Usage: npx tsx scripts/sync-product-inventory-totals.ts
 */

import 'dotenv/config';
import { prisma } from '../lib/prisma.js';

async function syncProductInventoryTotals() {
  console.log('🔄 Syncing product inventory totals from productInventory table...\n');

  try {
    // Aggregate from productInventory table (source of truth)
    const aggregated = await prisma.$queryRawUnsafe<Array<{
      productId: string;
      totalOnHand: number;
      totalCommitted: number;
      totalInTransit: number;
    }>>(`
      SELECT 
        "productId",
        COALESCE(SUM("onHand"), 0)::int as "totalOnHand",
        COALESCE(SUM("committed"), 0)::int as "totalCommitted",
        COALESCE(SUM("inTransit"), 0)::int as "totalInTransit"
      FROM product_inventory
      GROUP BY "productId"
    `);

    console.log(`📦 Found ${aggregated.length} products with inventory records\n`);

    let updated = 0;
    const batchSize = 100;

    for (let i = 0; i < aggregated.length; i += batchSize) {
      const batch = aggregated.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (row) => {
          const totalInventory = row.totalOnHand;
          const totalCommitted = row.totalCommitted;
          const totalAvailable = Math.max(0, totalInventory - totalCommitted);

          await prisma.product.update({
            where: { systemId: row.productId },
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

      console.log(`  ✅ Processed ${Math.min(i + batchSize, aggregated.length)}/${aggregated.length} products`);
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
