import { prisma } from './lib/prisma';

async function main() {
  const receipts = await prisma.inventoryReceipt.findMany({
    take: 10,
    select: {
      systemId: true,
      id: true,
      purchaseOrderSystemId: true,
      purchaseOrderId: true,
      type: true,
    },
    orderBy: { createdAt: 'desc' }
  });
  
  console.log('Recent Inventory Receipts:');
  console.log(JSON.stringify(receipts, null, 2));
  
  await prisma.$disconnect();
}

main();
