// Run with: npx tsx scripts/debug-warranty.mjs
import 'dotenv/config';
import { prisma } from '../lib/prisma.ts';

async function main() {
  const productSystemId = 'PROD112654'; // ZP8
  const branchSystemId = 'BRANCH-HQ';
  
  // Count from orders - same logic as API
  const orders = await prisma.order.findMany({
    where: {
      branchId: branchSystemId,
      lineItems: { some: { productId: productSystemId } },
      status: { notIn: ['CANCELLED', 'COMPLETED', 'DELIVERED'] },
      stockOutStatus: { not: 'FULLY_STOCKED_OUT' },
    },
    select: {
      id: true,
      status: true,
      stockOutStatus: true,
      lineItems: {
        where: { productId: productSystemId },
        select: { quantity: true },
      },
    },
  });
  
  const totalQty = orders.reduce((sum, o) => 
    sum + o.lineItems.reduce((s, li) => s + Number(li.quantity), 0), 0);
  
  console.log('Orders count:', orders.length);
  console.log('Total quantity from orders:', totalQty);
  
  // Get productInventory.committed
  const productInventory = await prisma.productInventory.findFirst({
    where: { productId: productSystemId, branchId: branchSystemId },
    select: { committed: true, onHand: true },
  });
  
  console.log('productInventory.committed:', productInventory?.committed);
  console.log('productInventory.onHand:', productInventory?.onHand);
  console.log('Difference (orders - productInventory.committed):', totalQty - Number(productInventory?.committed || 0));
}
main().catch(console.error).finally(() => prisma.$disconnect());
main().catch(console.error).finally(() => prisma.$disconnect());
