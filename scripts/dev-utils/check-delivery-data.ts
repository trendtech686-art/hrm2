import 'dotenv/config';
import { prisma } from './lib/prisma';

async function check() {
  // Find orders that are dispatched
  const dispatchedOrders = await prisma.order.findMany({
    where: {
      stockOutStatus: 'FULLY_STOCKED_OUT',
    },
    include: {
      lineItems: true,
      branch: true,
      packagings: {
        include: { shipment: true }
      }
    },
    take: 10,
  });
  
  console.log(`=== Found ${dispatchedOrders.length} orders with FULLY_STOCKED_OUT ===`);
  for (const order of dispatchedOrders) {
    console.log(`\n${order.id}: status=${order.status}, delivery=${order.deliveryStatus}`);
    for (const line of order.lineItems) {
      console.log(`  - ${line.productSystemId}: qty=${line.quantity}`);
    }
  }
  
  // Check inDelivery inventory for the product
  const inventory = await prisma.productInventory.findFirst({
    where: { productSystemId: 'PROD098912' }
  });
  console.log('\n=== ProductInventory for PROD098912 ===');
  console.log(inventory);
  
  // What orders are SHIPPING but NOT_STOCKED_OUT?
  const shippingNotStocked = await prisma.order.findMany({
    where: {
      status: 'SHIPPING',
      stockOutStatus: 'NOT_STOCKED_OUT',
    },
    include: { lineItems: true }
  });
  console.log('\n=== Orders with SHIPPING status but NOT_STOCKED_OUT ===');
  for (const order of shippingNotStocked) {
    console.log(`${order.id}: packagings?`);
    for (const line of order.lineItems) {
      console.log(`  - ${line.productSystemId}: qty=${line.quantity}`);
    }
  }
  
  process.exit(0);
}

check();
