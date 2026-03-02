import { prisma } from './lib/prisma';

async function main() {
  // Get latest shipments
  const shipments = await prisma.shipment.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      systemId: true,
      id: true,
      orderId: true,
      trackingCode: true,
      createdAt: true,
      carrier: true,
    },
  });
  
  console.log('=== Latest Shipments ===');
  console.log(JSON.stringify(shipments, null, 2));
  
  // Get latest orders
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      systemId: true,
      id: true,
      createdAt: true,
      status: true,
    },
  });
  
  console.log('\n=== Latest Orders ===');
  console.log(JSON.stringify(orders, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
