import 'dotenv/config';
import { prisma } from './lib/prisma';

/**
 * Script sửa committed trong ProductInventory dựa trên các đơn hàng thực tế đang active
 * 
 * Committed = Tổng số lượng từ các đơn hàng chưa hoàn thành/hủy và chưa xuất kho
 */
async function fixCommitted() {
  console.log('🔍 Tính lại committed cho tất cả sản phẩm...\n');

  // Lấy tất cả các đơn hàng đang active (chưa hoàn thành, chưa hủy)
  const activeOrders = await prisma.order.findMany({
    where: {
      status: {
        notIn: ['CANCELLED', 'COMPLETED', 'DELIVERED'],
      },
      // Chưa xuất kho hoàn toàn
      stockOutStatus: 'NOT_STOCKED_OUT',
    },
    include: {
      lineItems: true,
    },
  });

  console.log(`Tìm thấy ${activeOrders.length} đơn hàng đang active\n`);

  // Tính committed theo từng product + branch
  const committedMap = new Map<string, number>(); // key: productId|branchId

  for (const order of activeOrders) {
    for (const item of order.lineItems) {
      if (!item.productId) continue;
      const key = `${item.productId}|${order.branchId}`;
      const current = committedMap.get(key) || 0;
      committedMap.set(key, current + item.quantity);
    }
  }

  console.log(`Cần cập nhật ${committedMap.size} ProductInventory records\n`);

  // Cập nhật từng ProductInventory
  let updated = 0;
  let created = 0;

  for (const [key, expectedCommitted] of committedMap) {
    const [productId, branchId] = key.split('|');

    const existing = await prisma.productInventory.findUnique({
      where: { productId_branchId: { productId, branchId } },
    });

    if (existing) {
      if (existing.committed !== expectedCommitted) {
        await prisma.productInventory.update({
          where: { productId_branchId: { productId, branchId } },
          data: { committed: expectedCommitted },
        });
        console.log(`✅ Updated ${productId}@${branchId}: committed ${existing.committed} → ${expectedCommitted}`);
        updated++;
      }
    } else {
      await prisma.productInventory.create({
        data: {
          productId,
          branchId,
          onHand: 0,
          committed: expectedCommitted,
          inTransit: 0,
          inDelivery: 0,
        },
      });
      console.log(`✅ Created ${productId}@${branchId}: committed = ${expectedCommitted}`);
      created++;
    }
  }

  // Đặt committed = 0 cho các sản phẩm không còn trong active orders
  const allInventories = await prisma.productInventory.findMany({
    where: { committed: { gt: 0 } },
  });

  for (const inv of allInventories) {
    const key = `${inv.productId}|${inv.branchId}`;
    if (!committedMap.has(key)) {
      await prisma.productInventory.update({
        where: { productId_branchId: { productId: inv.productId, branchId: inv.branchId } },
        data: { committed: 0 },
      });
      console.log(`⚠️ Reset ${inv.productId}@${inv.branchId}: committed ${inv.committed} → 0`);
      updated++;
    }
  }

  console.log(`\n✅ Hoàn thành: Updated ${updated}, Created ${created}`);
}

fixCommitted()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
