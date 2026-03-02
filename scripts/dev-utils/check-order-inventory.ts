import 'dotenv/config';
import { prisma } from './lib/prisma';

async function check() {
  // Check ProductInventory for the product in order DH000063
  const order = await prisma.order.findFirst({
    where: { id: 'DH000063' },
    include: { 
      lineItems: true, 
      branch: true,
      packagings: {
        include: { shipment: true }
      }
    }
  });
  
  if (!order) {
    console.log('Order not found');
    return;
  }
  
  console.log('Order:', order.systemId, order.id, 'status:', order.status);
  console.log('Branch:', order.branchId);
  console.log('Packagings:');
  order.packagings.forEach(p => {
    console.log('  -', p.id, 'deliveryStatus:', p.deliveryStatus, 'deliveryMethod:', p.deliveryMethod);
    console.log('    shipment:', p.shipment ? p.shipment.status : 'NO SHIPMENT');
  });
  
  console.log('\nLine items:');
  
  for (const item of order.lineItems) {
    console.log('  -', item.productId, 'qty:', item.quantity);
    
    const inv = await prisma.productInventory.findUnique({
      where: { productId_branchId: { productId: item.productId, branchId: order.branchId } }
    });
    console.log('    Inventory:', inv ? JSON.stringify({onHand: inv.onHand, committed: inv.committed, inTransit: inv.inTransit, inDelivery: inv.inDelivery}) : 'NOT FOUND');
    
    // All StockHistory for this product
    const allHistories = await prisma.stockHistory.findMany({
      where: { productId: item.productId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    console.log('    All StockHistory (last 10):');
    allHistories.forEach(h => console.log('      -', h.action, 'change:', h.quantityChange, 'doc:', h.documentId));
  }
  
  await prisma.$disconnect();
}
check();
