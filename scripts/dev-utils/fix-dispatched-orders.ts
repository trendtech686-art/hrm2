import 'dotenv/config';
import { prisma } from './lib/prisma';

/**
 * Fix orders that have been dispatched (status = SHIPPING, have inDelivery stock)
 * but stockOutStatus is still NOT_STOCKED_OUT
 */
async function fixDispatchedOrders() {
  console.log('=== Fixing dispatched orders with wrong stockOutStatus ===\n');

  // Find orders that are SHIPPING but stockOutStatus is NOT_STOCKED_OUT
  const ordersToFix = await prisma.order.findMany({
    where: {
      status: 'SHIPPING',
      stockOutStatus: 'NOT_STOCKED_OUT',
    },
    include: {
      lineItems: true,
    },
  });

  console.log(`Found ${ordersToFix.length} orders to fix\n`);

  for (const order of ordersToFix) {
    console.log(`Fixing ${order.id}: status=${order.status}, stockOutStatus=${order.stockOutStatus}`);
    
    // Update stockOutStatus to FULLY_STOCKED_OUT
    await prisma.order.update({
      where: { systemId: order.systemId },
      data: { stockOutStatus: 'FULLY_STOCKED_OUT' },
    });
    
    console.log(`  ✓ Updated stockOutStatus to FULLY_STOCKED_OUT`);
  }

  console.log('\n=== Done ===');
  process.exit(0);
}

fixDispatchedOrders();
