import 'dotenv/config';
import { prisma } from './lib/prisma';

async function check() {
  const order = await prisma.order.findFirst({
    where: { id: 'DH000064' },
    include: {
      lineItems: true,
      branch: true,
      packagings: {
        include: { shipment: true }
      }
    },
  });
  
  if (!order) {
    console.log('Order not found');
    process.exit(0);
    return;
  }
  
  console.log('=== Order DH000064 ===');
  console.log('systemId:', order.systemId);
  console.log('id:', order.id);
  console.log('status:', order.status);
  console.log('stockOutStatus:', order.stockOutStatus);
  console.log('deliveryStatus:', order.deliveryStatus);
  console.log('branchId (=branchSystemId):', order.branchId);
  console.log('branch:', order.branch?.name);
  
  console.log('\nPackagings:');
  for (const pkg of order.packagings) {
    console.log(`  - ${pkg.packagingCode} deliveryStatus: ${pkg.deliveryStatus} deliveryMethod: ${pkg.deliveryMethod}`);
    if (pkg.shipment) {
      console.log(`    shipment status: ${pkg.shipment.status}`);
    }
  }
  
  console.log('\nLine items:');
  for (const line of order.lineItems) {
    console.log(`  - productSystemId: ${line.productSystemId} qty: ${line.quantity}`);
    console.log(`    productId: ${line.productId}`);
  }
  
  process.exit(0);
}

check();
