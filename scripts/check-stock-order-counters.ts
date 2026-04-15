/**
 * Diagnostic: Check ProductInventory committed/inTransit/inDelivery counters
 * vs actual matching orders/transfers
 * 
 * Usage: npx tsx scripts/check-stock-order-counters.ts
 */

import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🔍 Checking stock order counters vs actual data...\n');

  // 1. Find products with non-zero counters
  const inventories = await prisma.productInventory.findMany({
    where: {
      OR: [
        { committed: { gt: 0 } },
        { inTransit: { gt: 0 } },
        { inDelivery: { gt: 0 } },
      ],
    },
    include: {
      product: { select: { id: true, name: true } },
      branch: { select: { id: true, name: true } },
    },
    take: 20,
    orderBy: { committed: 'desc' },
  });

  console.log(`📦 Found ${inventories.length} inventory records with non-zero counters\n`);

  for (const inv of inventories) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📌 Product: ${inv.product?.name || 'N/A'} (${inv.product?.id || 'N/A'})`);
    console.log(`   Branch: ${inv.branch?.name || 'N/A'}`);
    console.log(`   productId (systemId): ${inv.productId}`);
    console.log(`   branchId (systemId): ${inv.branchId}`);
    console.log(`   Counters: committed=${inv.committed}, inTransit=${inv.inTransit}, inDelivery=${inv.inDelivery}, onHand=${inv.onHand}`);

    // 2. Check committed: count actual matching orders
    if (inv.committed > 0) {
      const committedOrders = await prisma.order.findMany({
        where: {
          branchId: inv.branchId,
          lineItems: { some: { productId: inv.productId } },
          status: { notIn: ['CANCELLED', 'COMPLETED', 'DELIVERED'] },
          stockOutStatus: { not: 'FULLY_STOCKED_OUT' },
        },
        select: {
          id: true,
          status: true,
          stockOutStatus: true,
          lineItems: {
            where: { productId: inv.productId },
            select: { quantity: true },
          },
        },
        take: 5,
      });

      const committedQty = committedOrders.reduce(
        (sum, o) => sum + o.lineItems.reduce((s, li) => s + Number(li.quantity), 0),
        0
      );

      // Also check with productSku
      const product = await prisma.product.findUnique({
        where: { systemId: inv.productId },
        select: { id: true },
      });

      const ordersWithSku = product
        ? await prisma.order.count({
            where: {
              branchId: inv.branchId,
              lineItems: { some: { productSku: product.id } },
              status: { notIn: ['CANCELLED', 'COMPLETED', 'DELIVERED'] },
              stockOutStatus: { not: 'FULLY_STOCKED_OUT' },
            },
          })
        : 0;

      // Check if lineItems have null productId but matching productSku
      const nullProductIdItems = product
        ? await prisma.orderLineItem.count({
            where: {
              productId: null,
              productSku: product.id,
              order: {
                branchId: inv.branchId,
                status: { notIn: ['CANCELLED', 'COMPLETED', 'DELIVERED'] },
                stockOutStatus: { not: 'FULLY_STOCKED_OUT' },
              },
            },
          })
        : 0;

      console.log(`   📊 COMMITTED check:`);
      console.log(`      DB counter: ${inv.committed}`);
      console.log(`      Actual orders (by productId/systemId): ${committedOrders.length} orders, ${committedQty} items`);
      console.log(`      Orders matching by productSku: ${ordersWithSku}`);
      console.log(`      Line items with NULL productId but matching SKU: ${nullProductIdItems}`);
      if (committedOrders.length > 0) {
        committedOrders.forEach(o =>
          console.log(`        → ${o.id} status=${o.status} stockOut=${o.stockOutStatus} qty=${o.lineItems.map(li => li.quantity).join(',')}`)
        );
      }
      if (inv.committed !== committedQty) {
        console.log(`      ❌ MISMATCH: counter=${inv.committed} vs actual=${committedQty}`);
      } else {
        console.log(`      ✅ Counter matches`);
      }
    }

    // 3. Check inTransit: count actual matching stock transfers
    if (inv.inTransit > 0) {
      const transfers = await prisma.stockTransfer.findMany({
        where: {
          toBranchSystemId: inv.branchId,
          status: 'IN_TRANSIT',
          items: { some: { productId: inv.productId } },
        },
        select: {
          id: true,
          status: true,
          items: {
            where: { productId: inv.productId },
            select: { quantity: true },
          },
        },
        take: 5,
      });

      // Also check purchase orders with inTransit
      const poTransit = await prisma.purchaseOrder.findMany({
        where: {
          branchSystemId: inv.branchId,
          status: { in: ['CONFIRMED', 'RECEIVING'] },
          items: { some: { productId: inv.productId } },
        },
        select: {
          id: true,
          status: true,
          items: {
            where: { productId: inv.productId },
            select: { quantity: true },
          },
        },
        take: 5,
      });

      const transferQty = transfers.reduce(
        (sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0),
        0
      );
      const poQty = poTransit.reduce(
        (sum, po) => sum + po.items.reduce((s, i) => s + i.quantity, 0),
        0
      );

      console.log(`   📊 IN-TRANSIT check:`);
      console.log(`      DB counter: ${inv.inTransit}`);
      console.log(`      Stock transfers IN_TRANSIT: ${transfers.length} transfers, ${transferQty} items`);
      console.log(`      POs CONFIRMED/RECEIVING: ${poTransit.length} POs, ${poQty} items`);
      if (inv.inTransit !== transferQty + poQty) {
        console.log(`      ❌ MISMATCH: counter=${inv.inTransit} vs actual transfers=${transferQty} + POs=${poQty}`);
      }
    }

    // 4. Check inDelivery: count actual matching dispatched orders
    if (inv.inDelivery > 0) {
      const deliveryOrders = await prisma.order.findMany({
        where: {
          branchId: inv.branchId,
          lineItems: { some: { productId: inv.productId } },
          status: { notIn: ['CANCELLED', 'COMPLETED', 'DELIVERED'] },
          stockOutStatus: 'FULLY_STOCKED_OUT',
        },
        select: {
          id: true,
          status: true,
          lineItems: {
            where: { productId: inv.productId },
            select: { quantity: true },
          },
        },
        take: 5,
      });

      const deliveryQty = deliveryOrders.reduce(
        (sum, o) => sum + o.lineItems.reduce((s, li) => s + Number(li.quantity), 0),
        0
      );

      console.log(`   📊 IN-DELIVERY check:`);
      console.log(`      DB counter: ${inv.inDelivery}`);
      console.log(`      Actual dispatched orders: ${deliveryOrders.length}, ${deliveryQty} items`);
      if (inv.inDelivery !== deliveryQty) {
        console.log(`      ❌ MISMATCH: counter=${inv.inDelivery} vs actual=${deliveryQty}`);
      }
    }
  }

  // 5. Summary: total mismatches
  const totalWithCommitted = await prisma.productInventory.count({ where: { committed: { gt: 0 } } });
  const totalWithInTransit = await prisma.productInventory.count({ where: { inTransit: { gt: 0 } } });
  const totalWithInDelivery = await prisma.productInventory.count({ where: { inDelivery: { gt: 0 } } });
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📊 SUMMARY:`);
  console.log(`   Products with committed > 0: ${totalWithCommitted}`);
  console.log(`   Products with inTransit > 0: ${totalWithInTransit}`);
  console.log(`   Products with inDelivery > 0: ${totalWithInDelivery}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
