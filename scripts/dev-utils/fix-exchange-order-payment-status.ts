/**
 * Script to fix exchange orders that have incorrect payment status
 * These orders are fully paid but still showing as "Chưa thanh toán" or "Thanh toán 1 phần"
 * 
 * Run: npx tsx fix-exchange-order-payment-status.ts
 */

import 'dotenv/config';
import { prisma } from './lib/prisma';

async function fixExchangeOrderPaymentStatus() {
  console.log('🔍 Finding exchange orders with incorrect payment status or status...');

  // Find all exchange orders (orders with linkedSalesReturnSystemId)
  const exchangeOrders = await prisma.order.findMany({
    where: {
      linkedSalesReturnSystemId: { not: null },
      status: { not: 'CANCELLED' },
    },
    include: {
      payments: true,
    },
  });

  console.log(`Found ${exchangeOrders.length} exchange orders to check`);

  let fixedCount = 0;

  for (const order of exchangeOrders) {
    // Get OrderPayments
    const totalPaidFromPayments = order.payments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    // Get linked receipts
    const linkedReceipts = await prisma.receipt.findMany({
      where: {
        linkedOrderSystemId: order.systemId,
        status: 'completed',
      },
    });

    // Exclude receipts already linked to OrderPayment
    const linkedReceiptSystemIds = new Set(
      order.payments
        .filter((p) => p.linkedReceiptSystemId)
        .map((p) => p.linkedReceiptSystemId)
    );
    const totalPaidFromReceipts = linkedReceipts
      .filter((r) => !linkedReceiptSystemIds.has(r.systemId))
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const totalPaid = totalPaidFromPayments + totalPaidFromReceipts;
    const grandTotal = Number(order.grandTotal || 0);
    const linkedReturnValue = Number(order.linkedSalesReturnValue || 0);
    const netGrandTotal = Math.max(0, grandTotal - linkedReturnValue);

    // Determine correct payment status
    const isFullyPaid = totalPaid >= netGrandTotal;
    const correctPaymentStatus = isFullyPaid
      ? 'PAID'
      : totalPaid > 0
      ? 'PARTIAL'
      : 'UNPAID';

    // Determine correct order status
    const isDelivered = order.deliveryStatus === 'DELIVERED';
    const correctStatus = isFullyPaid && isDelivered ? 'COMPLETED' : order.status;

    // Check if needs update
    const needsPaymentStatusFix = order.paymentStatus !== correctPaymentStatus;
    const needsStatusFix = isFullyPaid && isDelivered && order.status !== 'COMPLETED';

    if (needsPaymentStatusFix || needsStatusFix) {
      console.log(`\n📝 Order ${order.id}:`);
      console.log(`   grandTotal: ${grandTotal}`);
      console.log(`   linkedReturnValue: ${linkedReturnValue}`);
      console.log(`   netGrandTotal: ${netGrandTotal}`);
      console.log(`   totalPaidFromPayments: ${totalPaidFromPayments}`);
      console.log(`   totalPaidFromReceipts: ${totalPaidFromReceipts}`);
      console.log(`   totalPaid: ${totalPaid}`);
      console.log(`   deliveryStatus: ${order.deliveryStatus}`);
      
      if (needsPaymentStatusFix) {
        console.log(`   paymentStatus: ${order.paymentStatus} -> ${correctPaymentStatus}`);
      }
      if (needsStatusFix) {
        console.log(`   status: ${order.status} -> COMPLETED`);
      }

      // Update order
      await prisma.order.update({
        where: { systemId: order.systemId },
        data: {
          ...(needsPaymentStatusFix && { paymentStatus: correctPaymentStatus }),
          ...(needsStatusFix && { 
            status: 'COMPLETED',
            completedDate: new Date(),
          }),
        },
      });

      fixedCount++;
      console.log(`   ✅ Fixed!`);
    }
  }

  console.log(`\n✅ Done! Fixed ${fixedCount} orders.`);
}

fixExchangeOrderPaymentStatus()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
