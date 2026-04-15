/**
 * Sync productInventory.committed with actual orders
 * 
 * This script recalculates the committed value for each product/branch 
 * based on actual pending orders (not cancelled, not completed, not fully stocked out)
 * 
 * Run: npx tsx scripts/sync-committed-inventory.mjs
 */
import 'dotenv/config';
import { prisma } from '../lib/prisma.ts';

async function main() {
  console.log('Starting committed inventory sync...\n');
  
  // Get all products with inventory (composite key: productId + branchId)
  const productInventories = await prisma.productInventory.findMany({
    select: {
      productId: true,
      branchId: true,
      committed: true,
    },
  });
  
  console.log(`Found ${productInventories.length} product inventory records`);
  
  let updated = 0;
  let unchanged = 0;
  let errors = 0;
  
  for (const inv of productInventories) {
    try {
      // Calculate committed from actual orders
      const orders = await prisma.order.findMany({
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
      
      const actualCommitted = orders.reduce((sum, o) => 
        sum + o.lineItems.reduce((s, li) => s + Number(li.quantity), 0), 0);
      
      const currentCommitted = Number(inv.committed || 0);
      
      if (actualCommitted !== currentCommitted) {
        await prisma.productInventory.update({
          where: { 
            productId_branchId: {
              productId: inv.productId,
              branchId: inv.branchId,
            }
          },
          data: { committed: actualCommitted },
        });
        console.log(`[UPDATED] ${inv.productId} @ ${inv.branchId}: ${currentCommitted} → ${actualCommitted}`);
        updated++;
      } else {
        unchanged++;
      }
    } catch (error) {
      console.error(`[ERROR] ${inv.productId} @ ${inv.branchId}:`, error);
      errors++;
    }
  }
  
  console.log('\n=== SUMMARY ===');
  console.log(`Updated: ${updated}`);
  console.log(`Unchanged: ${unchanged}`);
  console.log(`Errors: ${errors}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
