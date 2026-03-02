import 'dotenv/config';
import { prisma } from './lib/prisma';

async function check() {
  const orders = await prisma.order.findMany({
    where: { id: { in: ['DH000071', 'DH000072'] } },
    select: {
      id: true,
      systemId: true,
      grandTotal: true,
      linkedSalesReturnValue: true,
      paymentStatus: true,
      status: true,
      deliveryStatus: true,
    },
  });
  console.log('Orders in DB:', JSON.stringify(orders, null, 2));
  
  // Check receipts
  for (const order of orders) {
    const receipts = await prisma.receipt.findMany({
      where: { linkedOrderSystemId: order.systemId, status: 'completed' },
      select: { id: true, amount: true, linkedSalesReturnSystemId: true },
    });
    console.log(`\nReceipts for ${order.id}:`, JSON.stringify(receipts, null, 2));
    
    const payments = await prisma.orderPayment.findMany({
      where: { orderId: order.systemId },
      select: { id: true, amount: true, linkedReceiptSystemId: true },
    });
    console.log(`OrderPayments for ${order.id}:`, JSON.stringify(payments, null, 2));
  }
}

check().finally(() => prisma.$disconnect());
