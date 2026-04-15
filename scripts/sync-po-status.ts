/**
 * Script to sync purchase order statuses based on delivery and payment
 * Run: npx tsx scripts/sync-po-status.ts
 * 
 * Note: This script handles mixed Vietnamese/English status values in the database.
 * It casts status as string to bypass TypeScript enum checks.
 */

import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function syncPOStatus() {
  console.log('Starting PO status sync...\n');

  // Get all POs
  const allPurchaseOrders = await prisma.purchaseOrder.findMany({
    include: {
      items: true,
    },
  });
  
  // Filter out cancelled ones (both enum and Vietnamese strings)
  // Cast status to string to handle mixed enum/Vietnamese values in database
  const purchaseOrders = allPurchaseOrders.filter(po => {
    const status = po.status as unknown as string;
    return status !== 'CANCELLED' && status !== 'Đã hủy';
  });

  console.log(`Found ${purchaseOrders.length} purchase orders to check\n`);

  let updatedCount = 0;

  for (const po of purchaseOrders) {
    // Get inventory receipts for this PO
    const receipts = await prisma.inventoryReceipt.findMany({
      where: { purchaseOrderSystemId: po.systemId },
      include: { items: true },
    });

    // Calculate total received by product
    const totalReceivedByProduct: Record<string, number> = {};
    for (const lineItem of po.items) {
      if (!lineItem.productId) continue;
      const totalReceived = receipts.reduce((sum, receipt) => {
        const item = receipt.items.find(i => i.productId === lineItem.productId);
        return sum + (item ? item.quantity : 0);
      }, 0);
      totalReceivedByProduct[lineItem.productId] = totalReceived;
    }

    // Determine delivery status
    const anyItemReceived = Object.values(totalReceivedByProduct).some(qty => qty > 0);
    const newDeliveryStatus = anyItemReceived ? 'Đã nhập' : 'Chưa nhập';

    // Get payments
    const payments = await prisma.payment.findMany({
      where: { purchaseOrderSystemId: po.systemId },
    });
    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    // Get returns to calculate actual debt
    const returns = await prisma.purchaseReturn.findMany({
      where: { purchaseOrderSystemId: po.systemId },
    });
    const totalReturnedValue = returns.reduce((sum, r) => sum + Number(r.totalReturnValue), 0);
    const actualDebt = Number(po.grandTotal) - totalReturnedValue;

    // Determine payment status
    let newPaymentStatus: string;
    if (totalPaid >= actualDebt) {
      newPaymentStatus = 'Đã thanh toán';
    } else if (totalPaid > 0) {
      newPaymentStatus = 'Thanh toán một phần';
    } else {
      newPaymentStatus = 'Chưa thanh toán';
    }

    // Determine overall status (use string type since we use Vietnamese values)
    let newStatus: string = po.status as unknown as string;
    if (newDeliveryStatus === 'Đã nhập' && newPaymentStatus === 'Đã thanh toán') {
      newStatus = 'Hoàn thành';
    } else if (newDeliveryStatus === 'Chưa nhập' && newPaymentStatus === 'Chưa thanh toán') {
      newStatus = 'Đặt hàng';
    } else {
      newStatus = 'Đang giao dịch';
    }

    // Check if update needed (cast po.status to string for comparison with Vietnamese values)
    const currentStatus = po.status as unknown as string;
    if (currentStatus !== newStatus || po.paymentStatus !== newPaymentStatus || po.deliveryStatus !== newDeliveryStatus) {
      console.log(`${po.id}:`);
      console.log(`  Delivery: ${po.deliveryStatus} → ${newDeliveryStatus}`);
      console.log(`  Payment: ${po.paymentStatus} → ${newPaymentStatus}`);
      console.log(`  Status: ${po.status} → ${newStatus}`);

      // Use raw SQL to bypass enum validation since database has mixed values
      await prisma.$executeRaw`
        UPDATE purchase_orders 
        SET 
          "deliveryStatus" = ${newDeliveryStatus},
          "paymentStatus" = ${newPaymentStatus},
          status = ${newStatus}
        WHERE "systemId" = ${po.systemId}
      `;

      console.log(`  ✓ Updated\n`);
      updatedCount++;
    }
  }

  console.log(`Done! Updated ${updatedCount} purchase orders.`);
}

syncPOStatus()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
