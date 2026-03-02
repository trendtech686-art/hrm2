import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  // Check order 64
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { id: 'DH000064' },
        { systemId: 'ORDER000064' }
      ]
    },
    include: {
      lineItems: {
        include: { product: true }
      },
      packagings: true
    }
  });

  if (!order) {
    console.log('Order not found');
    return;
  }

  console.log('Order:', order.id);
  console.log('  systemId:', order.systemId);
  console.log('  status:', order.status);
  console.log('  stockOutStatus:', order.stockOutStatus);
  console.log('  branchId:', order.branchId);
  console.log('  lineItems:');
  for (const item of order.lineItems) {
    console.log(`    - ${item.product?.sku}: qty=${item.quantity}`);
  }
  console.log('  packagings:');
  for (const pkg of order.packagings) {
    console.log(`    - ${pkg.id}: status=${pkg.status}, deliveryStatus=${pkg.deliveryStatus}, deliveryMethod=${pkg.deliveryMethod}`);
  }

  // Also check all orders with HX53
  console.log('\n\nAll orders with HX53 that should be committed:');
  const hx53Orders = await prisma.order.findMany({
    where: {
      lineItems: {
        some: {
          product: { sku: 'HX53' }
        }
      },
      status: {
        notIn: ['CANCELLED', 'COMPLETED', 'DELIVERED']
      },
      stockOutStatus: {
        not: 'FULLY_STOCKED_OUT'
      }
    },
    include: {
      lineItems: {
        where: {
          product: { sku: 'HX53' }
        },
        include: { product: true }
      }
    }
  });

  for (const o of hx53Orders) {
    console.log(`  ${o.id}: status=${o.status}, stockOutStatus=${o.stockOutStatus}, branch=${o.branchId}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
