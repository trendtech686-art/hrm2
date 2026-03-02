import { prisma } from './lib/prisma';

async function check() {
  const order = await prisma.order.findFirst({
    where: { id: 'DH000069' },
    include: {
      payments: true
    }
  });
  
  console.log('Order:', order?.id, order?.systemId);
  console.log('grandTotal:', order?.grandTotal);
  console.log('linkedSalesReturnSystemId:', order?.linkedSalesReturnSystemId);
  console.log('linkedSalesReturnValue:', order?.linkedSalesReturnValue);
  console.log('Payments:', JSON.stringify(order?.payments, null, 2));
  
  // Find receipts linked to this order
  const receipts = await prisma.receipt.findMany({
    where: { 
      OR: [
        { linkedOrderSystemId: order?.systemId },
        { linkedSalesReturnSystemId: 'SALESRETURN000044' }
      ]
    }
  });
  console.log('\nReceipts:', JSON.stringify(receipts, null, 2));
  
  // Find payment vouchers linked to this order
  const payments = await prisma.payment.findMany({
    where: {
      OR: [
        { linkedOrderSystemId: order?.systemId },
        { linkedSalesReturnSystemId: 'SALESRETURN000044' }
      ]
    }
  });
  console.log('\nPayment vouchers:', JSON.stringify(payments, null, 2));
  
  await prisma.$disconnect();
}
check();
