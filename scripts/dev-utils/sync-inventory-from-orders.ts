/**
 * Script to sync ProductInventory and Product.totalSold with actual order data
 */
import { config } from 'dotenv';
config({ path: '.env' });

import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log('=== Syncing inventory with orders ===\n');

  // Get all products with inventory
  const products = await prisma.product.findMany({
    select: { systemId: true, id: true, name: true, totalSold: true }
  });

  for (const product of products) {
    // Get all orders with this product
    const orders = await prisma.order.findMany({
      where: {
        lineItems: { some: { productId: product.systemId } },
        status: { not: 'CANCELLED' }
      },
      include: {
        lineItems: { where: { productId: product.systemId } },
      }
    });

    if (orders.length === 0) continue;

    // Calculate per branch
    const branchData: Record<string, { committed: number; inDelivery: number; sold: number }> = {};

    for (const order of orders) {
      const branchId = order.branchId;
      if (!branchId) continue;

      if (!branchData[branchId]) {
        branchData[branchId] = { committed: 0, inDelivery: 0, sold: 0 };
      }

      const qty = order.lineItems.reduce((sum, li) => sum + li.quantity, 0);

      if (order.status === 'COMPLETED' || order.status === 'DELIVERED') {
        branchData[branchId].sold += qty;
      } else if (order.stockOutStatus === 'FULLY_STOCKED_OUT') {
        branchData[branchId].inDelivery += qty;
      } else {
        branchData[branchId].committed += qty;
      }
    }

    // Calculate total sold across all branches
    const totalSold = Object.values(branchData).reduce((sum, d) => sum + d.sold, 0);

    // Update Product.totalSold if different
    if (product.totalSold !== totalSold) {
      console.log(`Product ${product.id}: totalSold ${product.totalSold} -> ${totalSold}`);
      await prisma.product.update({
        where: { systemId: product.systemId },
        data: { totalSold }
      });
    }

    // Update ProductInventory per branch
    for (const [branchId, data] of Object.entries(branchData)) {
      const inventory = await prisma.productInventory.findUnique({
        where: { 
          productId_branchId: {
            productId: product.systemId,
            branchId
          }
        }
      });

      if (inventory) {
        const needsUpdate = 
          inventory.committed !== data.committed ||
          inventory.inDelivery !== data.inDelivery;

        if (needsUpdate) {
          console.log(`  Branch ${branchId}: committed ${inventory.committed} -> ${data.committed}, inDelivery ${inventory.inDelivery} -> ${data.inDelivery}`);
          await prisma.productInventory.update({
            where: { 
              productId_branchId: {
                productId: product.systemId,
                branchId
              }
            },
            data: {
              committed: data.committed,
              inDelivery: data.inDelivery,
            }
          });
        }
      }
    }
  }

  console.log('\n=== Sync completed ===');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
