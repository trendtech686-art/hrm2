import { prisma } from './lib/prisma';

async function fix() {
  // Get current state
  const order = await prisma.order.findUnique({
    where: { id: 'DH000064' },
    include: { packagings: true },
  });
  
  console.log('Before fix:');
  console.log('  status:', order?.status);
  console.log('  deliveryStatus:', order?.deliveryStatus);
  console.log('  stockOutStatus:', order?.stockOutStatus);
  
  // Check active packagings
  const activePackagings = order?.packagings.filter(p => p.status !== 'CANCELLED') || [];
  
  // Check if any active packaging has been dispatched (SHIPPING or DELIVERED)
  const hasDispatchedPackaging = activePackagings.some(p => 
    p.deliveryStatus === 'SHIPPING' || 
    p.deliveryStatus === 'DELIVERED' ||
    p.deliveryStatus === 'Đang giao hàng' ||
    p.deliveryStatus === 'Đã giao hàng'
  );
  
  // If no dispatched packaging, reset stockOutStatus
  if (!hasDispatchedPackaging) {
    await prisma.order.update({
      where: { id: 'DH000064' },
      data: {
        stockOutStatus: 'NOT_STOCKED_OUT',
      },
    });
    console.log('\n✅ Fixed: stockOutStatus -> NOT_STOCKED_OUT');
  } else {
    console.log('\n⚠️ Order has dispatched packaging, keeping stockOutStatus');
  }
  
  // Verify
  const updated = await prisma.order.findUnique({
    where: { id: 'DH000064' },
  });
  console.log('\nAfter fix:');
  console.log('  stockOutStatus:', updated?.stockOutStatus);
  
  await prisma.$disconnect();
}

fix();
