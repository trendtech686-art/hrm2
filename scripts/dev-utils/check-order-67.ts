import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  // Check order 67
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { id: 'DH000067' },
        { systemId: 'ORDER000067' }
      ]
    },
    include: {
      payments: true,
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
  console.log('  grandTotal:', order.grandTotal);
  console.log('  linkedSalesReturnValue:', order.linkedSalesReturnValue);
  
  // Check payments
  console.log('\n  Payments (from order.payments relation):');
  let totalFromRelation = 0;
  for (const p of order.payments) {
    console.log(`    - ${p.id}: ${p.amount} (orderId: ${p.orderId})`);
    totalFromRelation += Number(p.amount);
  }
  console.log('  Total from relation:', totalFromRelation);

  // Also query OrderPayment directly
  console.log('\n  Payments (direct query by orderId = systemId):');
  const directPayments = await prisma.orderPayment.findMany({
    where: { orderId: order.systemId }
  });
  let totalDirect = 0;
  for (const p of directPayments) {
    console.log(`    - ${p.id}: ${p.amount}`);
    totalDirect += Number(p.amount);
  }
  console.log('  Total direct:', totalDirect);

  // Calculate what status should be
  const netGrandTotal = Math.max(0, Number(order.grandTotal) - Number(order.linkedSalesReturnValue || 0));
  const isFullyPaid = totalDirect >= netGrandTotal;
  console.log('\n  Calculation:');
  console.log('    netGrandTotal:', netGrandTotal);
  console.log('    totalPaid:', totalDirect);
  console.log('    isFullyPaid:', isFullyPaid);
  console.log('    Expected status:', isFullyPaid && order.stockOutStatus === 'FULLY_STOCKED_OUT' ? 'COMPLETED' : order.status);

  // Check packagings
  console.log('\n  Packagings:');
  for (const pkg of order.packagings) {
    console.log(`    - ${pkg.id}: status=${pkg.status}, deliveryStatus=${pkg.deliveryStatus}`);
  }

  // Fix if needed
  if (order.status !== 'COMPLETED' && isFullyPaid && order.stockOutStatus === 'FULLY_STOCKED_OUT') {
    console.log('\n  ⚠️ Order should be COMPLETED but is', order.status);
    console.log('  Fixing...');
    
    await prisma.order.update({
      where: { systemId: order.systemId },
      data: { 
        status: 'COMPLETED',
        completedDate: new Date()
      }
    });
    
    console.log('  ✅ Fixed! Status updated to COMPLETED');
  }

  await prisma.$disconnect();
}

main().catch(console.error);
