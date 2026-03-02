// Load env before any imports
import 'dotenv/config';

import { prisma } from './lib/prisma';

async function main() {
  console.log('🗑️ Deleting all orders and related data...\n');

  // Delete in correct order to avoid foreign key constraints
  
  // 1. Delete shipments first (references packagings)
  const deletedShipments = await prisma.shipment.deleteMany({});
  console.log(`✓ Deleted ${deletedShipments.count} shipments`);

  // 2. Delete packaging items (references packagings)
  const deletedPackagingItems = await prisma.packagingItem.deleteMany({});
  console.log(`✓ Deleted ${deletedPackagingItems.count} packaging items`);

  // 3. Delete packagings (references orders)
  const deletedPackagings = await prisma.packaging.deleteMany({});
  console.log(`✓ Deleted ${deletedPackagings.count} packagings`);

  // 4. Delete order payments (references orders)
  const deletedPayments = await prisma.orderPayment.deleteMany({});
  console.log(`✓ Deleted ${deletedPayments.count} order payments`);

  // 5. Delete order line items (references orders)
  const deletedLineItems = await prisma.orderLineItem.deleteMany({});
  console.log(`✓ Deleted ${deletedLineItems.count} order line items`);

  // 6. Finally delete orders
  const deletedOrders = await prisma.order.deleteMany({});
  console.log(`✓ Deleted ${deletedOrders.count} orders`);

  console.log('\n✅ All orders and related data deleted successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
