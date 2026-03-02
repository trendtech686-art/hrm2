import { prisma } from './lib/prisma';

async function checkReturns() {
  // Find order first
  const order = await prisma.order.findUnique({
    where: { id: 'DH000059' },
    include: {
      payments: true,
      sales_returns: {
        select: { totalReturnValue: true, status: true },
      },
    },
  });
  
  if (!order) {
    console.log('Order not found');
    return;
  }
  
  console.log('Order systemId:', order.systemId);
  console.log('Sales returns:', order.sales_returns);
  
  // Calculate total return value from related sales returns
  const totalReturnValue = order.sales_returns
    .filter(sr => sr.status !== 'CANCELLED')
    .reduce((sum, r) => sum + Number(r.totalReturnValue || 0), 0);
  console.log('Total return value:', totalReturnValue);
  
  // Calculate effective grandTotal
  const grandTotal = Number(order.grandTotal || 0);
  const linkedSalesReturnValue = Number(order.linkedSalesReturnValue || 0);
  const effectiveTotal = grandTotal - totalReturnValue - linkedSalesReturnValue;
  
  // Calculate total paid from payments
  const totalPaid = order.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  
  console.log('\n=== Calculations ===');
  console.log('grandTotal:', grandTotal);
  console.log('totalReturnValue:', totalReturnValue);
  console.log('linkedSalesReturnValue:', linkedSalesReturnValue);
  console.log('Effective grandTotal:', effectiveTotal);
  console.log('Total paid:', totalPaid);
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
      where: { systemId: order.systemId },
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

checkReturns();
