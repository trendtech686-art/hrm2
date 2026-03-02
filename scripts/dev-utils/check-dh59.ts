import { prisma } from './lib/prisma';

async function checkAndFixDH59() {
  const order = await prisma.order.findUnique({
    where: { id: 'DH000059' },
    include: { payments: true },
  });
  
  if (!order) {
    console.log('Order not found');
    return;
  }
  
  console.log('=== Order DH000059 ===');
  console.log('status:', order.status);
  console.log('grandTotal:', order.grandTotal);
  console.log('totalReturnValue:', order.totalReturnValue);
  console.log('linkedSalesReturnValue:', order.linkedSalesReturnValue);
  console.log('paidAmount:', order.paidAmount);
  console.log('deliveryStatus:', order.deliveryStatus);
  console.log('stockOutStatus:', order.stockOutStatus);
  
  // Calculate effective total
  const grandTotal = Number(order.grandTotal || 0);
  const totalReturnValue = Number(order.totalReturnValue || 0);
  const linkedSalesReturnValue = Number(order.linkedSalesReturnValue || 0);
  const effectiveTotal = grandTotal - totalReturnValue - linkedSalesReturnValue;
  
  // Calculate total paid from payments
  const totalPaid = order.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  
  console.log('\n=== Calculations ===');
  console.log('Effective grandTotal:', effectiveTotal);
  console.log('Total paid (from payments):', totalPaid);
  console.log('Is fully paid:', totalPaid >= effectiveTotal);
  
  // Check if should be COMPLETED
  const isDelivered = order.deliveryStatus === 'DELIVERED' || 
                      order.deliveryStatus === 'Đã giao hàng' ||
                      order.stockOutStatus === 'FULLY_STOCKED_OUT';
  const isPaidFull = totalPaid >= effectiveTotal;
  const shouldComplete = isPaidFull && isDelivered;
  
  console.log('Is delivered:', isDelivered);
  console.log('Should be COMPLETED:', shouldComplete);
  
  if (shouldComplete && order.status !== 'COMPLETED') {
    console.log('\n⚠️ Order should be COMPLETED but is:', order.status);
    
    // Fix it
    await prisma.order.update({
      where: { id: 'DH000059' },
      data: {
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        completedDate: new Date(),
      },
    });
    console.log('✅ Fixed: status -> COMPLETED');
  } else if (order.status === 'COMPLETED') {
    console.log('\n✅ Order already COMPLETED');
  } else {
    console.log('\n⚠️ Order not ready to complete yet');
  }
  
  await prisma.$disconnect();
}

checkAndFixDH59();
