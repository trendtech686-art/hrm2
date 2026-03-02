import { prisma } from './lib/prisma';

/**
 * Script to fix order status inconsistencies
 * - Fix deliveryStatus based on packagings status
 * - Fix stockOutStatus based on stock history
 */
async function fixOrderStatuses() {
  console.log('🔄 Starting order status fix...\n');

  // Get all orders with packagings
  const orders = await prisma.order.findMany({
    include: {
      packagings: true,
    },
    orderBy: { orderDate: 'desc' },
  });

  console.log(`Found ${orders.length} orders to check\n`);

  let fixedCount = 0;

  for (const order of orders) {
    const updates: Record<string, unknown> = {};
    const packagings = order.packagings || [];
    
    // Skip if no packagings
    if (packagings.length === 0) continue;

    // Check packaging statuses
    const hasPackedPackaging = packagings.some(p => 
      p.status === 'Đã đóng gói' || p.status === 'PACKED'
    );
    const hasPendingPackaging = packagings.some(p => 
      p.status === 'Chờ đóng gói' || p.status === 'PENDING'
    );
    
    // Check delivery statuses from packagings
    const hasDeliveredPackaging = packagings.some(p => 
      p.deliveryStatus === 'DELIVERED' || p.deliveryStatus === 'Đã giao hàng'
    );
    const hasShippingPackaging = packagings.some(p => 
      p.deliveryStatus === 'SHIPPING' || p.deliveryStatus === 'Đang giao hàng'
    );
    const hasPendingShipPackaging = packagings.some(p => 
      p.deliveryStatus === 'PENDING_SHIP' || p.deliveryStatus === 'Chờ lấy hàng'
    );

    // Determine correct deliveryStatus
    let correctDeliveryStatus = order.deliveryStatus;
    
    if (hasDeliveredPackaging) {
      correctDeliveryStatus = 'DELIVERED';
    } else if (hasShippingPackaging) {
      correctDeliveryStatus = 'SHIPPING';
    } else if (hasPendingShipPackaging) {
      correctDeliveryStatus = 'PENDING_SHIP';
    } else if (hasPackedPackaging) {
      correctDeliveryStatus = 'PACKED';
    } else if (hasPendingPackaging) {
      correctDeliveryStatus = 'PENDING_PACK';
    }

    // Check if deliveryStatus needs update
    if (order.deliveryStatus !== correctDeliveryStatus) {
      updates.deliveryStatus = correctDeliveryStatus;
      console.log(`${order.id}: deliveryStatus ${order.deliveryStatus} → ${correctDeliveryStatus}`);
    }

    // Check stockOutStatus - if FULLY_STOCKED_OUT but deliveryStatus is PENDING_PACK or null, fix it
    if (order.stockOutStatus === 'FULLY_STOCKED_OUT') {
      // If stocked out, deliveryStatus should at least be SHIPPING
      if (!order.deliveryStatus || order.deliveryStatus === 'PENDING_PACK' || order.deliveryStatus === 'Chờ đóng gói') {
        // Check packaging to determine correct status
        if (hasDeliveredPackaging) {
          updates.deliveryStatus = 'DELIVERED';
        } else if (hasShippingPackaging || hasPendingShipPackaging) {
          updates.deliveryStatus = 'SHIPPING';
        } else {
          updates.deliveryStatus = 'SHIPPING'; // Default: stocked out means shipped
        }
        console.log(`${order.id}: deliveryStatus forced to ${updates.deliveryStatus} (stockOutStatus is FULLY_STOCKED_OUT)`);
      }
    }

    // Fix printStatus based on packagings
    const hasPrintedPackaging = packagings.some(p => 
      p.printStatus === 'PRINTED' || p.printStatus === 'Đã in'
    );
    if (hasPrintedPackaging && order.printStatus !== 'PRINTED') {
      updates.printStatus = 'PRINTED';
      console.log(`${order.id}: printStatus → PRINTED`);
    }

    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      await prisma.order.update({
        where: { systemId: order.systemId },
        data: updates,
      });
      fixedCount++;
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} orders`);
  await prisma.$disconnect();
}

fixOrderStatuses().catch(console.error);
