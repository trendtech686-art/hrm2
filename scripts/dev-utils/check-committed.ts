import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  // Kiểm tra tất cả orders với product PROD098912
  const orders = await prisma.order.findMany({
    where: {
      lineItems: {
        some: { productId: 'PROD098912' }
      }
    },
    include: {
      lineItems: {
        where: { productId: 'PROD098912' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  console.log('=== All Orders with PROD098912 ===');
  let totalCommittedFromOrders = 0;
  for (const o of orders) {
    const qty = o.lineItems.reduce((s, li) => s + li.quantity, 0);
    const shouldCount = !['CANCELLED', 'COMPLETED', 'DELIVERED'].includes(o.status);
    if (shouldCount) totalCommittedFromOrders += qty;
    console.log(`${o.id}: status=${o.status}, qty=${qty}${shouldCount ? ' (counting)' : ' (not counting)'}`);
  }
  console.log(`\nTotal committed from active orders: ${totalCommittedFromOrders}`);

  // Kiểm tra ProductInventory
  const inv = await prisma.productInventory.findFirst({
    where: { productId: 'PROD098912', branchId: 'BRANCH-HQ' }
  });
  console.log('\n=== ProductInventory ===');
  console.log('onHand:', inv?.onHand);
  console.log('committed:', inv?.committed);
  console.log('Expected committed:', totalCommittedFromOrders);
  console.log('Match:', inv?.committed === totalCommittedFromOrders ? 'YES ✅' : 'NO ❌');
}

main().catch(console.error).finally(() => prisma.$disconnect());
