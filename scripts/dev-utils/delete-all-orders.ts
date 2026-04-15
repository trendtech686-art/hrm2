// Load env before any imports
import 'dotenv/config';

import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

let connectionString = process.env.DATABASE_URL!;
connectionString = connectionString.replace(/^["']|["']$/g, '');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

  // 4b. Delete receipts linked to orders (created during import)
  const deletedReceipts = await prisma.receipt.deleteMany({
    where: { linkedOrderSystemId: { not: null } },
  });
  console.log(`✓ Deleted ${deletedReceipts.count} order-linked receipts`);

  // 5. Delete order line items (references orders)
  const deletedLineItems = await prisma.orderLineItem.deleteMany({});
  console.log(`✓ Deleted ${deletedLineItems.count} order line items`);

  // 5b. Delete sales return line items (references sales returns)
  const deletedSRLineItems = await prisma.salesReturnItem.deleteMany({});
  console.log(`✓ Deleted ${deletedSRLineItems.count} sales return items`);

  // 5c. Delete sales returns (references orders)
  const deletedSalesReturns = await prisma.salesReturn.deleteMany({});
  console.log(`✓ Deleted ${deletedSalesReturns.count} sales returns`);

  // 6. Finally delete orders
  const deletedOrders = await prisma.order.deleteMany({});
  console.log(`✓ Deleted ${deletedOrders.count} orders`);

  // 7. Reset ID counters for orders/packaging/shipments/receipts
  await prisma.$executeRawUnsafe(`DELETE FROM id_counters WHERE "entityType" IN ('orders', 'packaging', 'shipments', 'receipts')`);
  console.log(`✓ Reset ID counters for orders, packaging, shipments, receipts`);

  console.log('\n✅ All orders and related data deleted successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
