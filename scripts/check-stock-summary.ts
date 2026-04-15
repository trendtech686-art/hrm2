import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  const pendingOrders = await prisma.order.count({
    where: {
      status: { notIn: ['CANCELLED', 'COMPLETED', 'DELIVERED'] },
      stockOutStatus: { not: 'FULLY_STOCKED_OUT' }
    }
  });
  const deliveryOrders = await prisma.order.count({
    where: {
      status: { notIn: ['CANCELLED', 'COMPLETED', 'DELIVERED'] },
      stockOutStatus: 'FULLY_STOCKED_OUT'
    }
  });
  const transitTransfers = await prisma.stockTransfer.count({
    where: { status: 'IN_TRANSIT' }
  });
  console.log('Orders waiting stock-out (committed):', pendingOrders);
  console.log('Orders dispatched not delivered (inDelivery):', deliveryOrders);
  console.log('Stock transfers in transit:', transitTransfers);
  
  const sum = await prisma.productInventory.aggregate({
    _sum: { committed: true, inTransit: true, inDelivery: true }
  });
  console.log('ProductInventory sums:', JSON.stringify(sum._sum));
}

main().catch(console.error).finally(() => prisma.$disconnect());
