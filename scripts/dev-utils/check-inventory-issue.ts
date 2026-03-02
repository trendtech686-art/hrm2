// Debug script to check inventory receipts and product inventory
import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('=== CHECKING INVENTORY RECEIPTS ===\n');

  // Get recent inventory receipts
  const receipts = await prisma.inventoryReceipt.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      items: true,
    },
  });

  for (const r of receipts) {
    console.log(`${r.id} (${r.systemId})`);
    console.log(`  Branch: ${r.branchId} / ${r.branchName}`);
    console.log(`  PO: ${r.purchaseOrderId}`);
    console.log(`  Created: ${r.createdAt}`);
    console.log(`  Items: ${r.items.length}`);
    for (const item of r.items) {
      console.log(`    - Product: ${item.productId}, Qty: ${item.quantity}, UnitCost: ${item.unitCost}`);
    }
    console.log('');
  }

  // Check product inventory for ZP8 (or specific product)
  console.log('\n=== CHECKING PRODUCT INVENTORY ===\n');
  
  // Find product by ID containing "ZP8"
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: { contains: 'ZP8' } },
        { name: { contains: 'ZP8' } },
      ]
    },
    select: {
      systemId: true,
      id: true,
      name: true,
      costPrice: true,
      lastPurchasePrice: true,
    }
  });

  if (product) {
    console.log(`Product: ${product.id} - ${product.name}`);
    console.log(`  SystemId: ${product.systemId}`);
    console.log(`  CostPrice: ${product.costPrice}`);
    console.log(`  LastPurchasePrice: ${product.lastPurchasePrice}`);

    // Check inventory for this product
    const inventories = await prisma.productInventory.findMany({
      where: { productId: product.systemId },
    });

    console.log(`\n  Inventory records:`);
    for (const inv of inventories) {
      console.log(`    Branch ${inv.branchId}: onHand=${inv.onHand}, committed=${inv.committed}`);
    }

    // Check stock history
    const history = await prisma.stockHistory.findMany({
      where: { productId: product.systemId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    console.log(`\n  Recent stock history:`);
    for (const h of history) {
      console.log(`    ${h.action}: ${h.quantityChange > 0 ? '+' : ''}${h.quantityChange} -> ${h.newStockLevel} (${h.documentId})`);
    }
  } else {
    console.log('Product ZP8 not found');
  }

  // Check branches
  console.log('\n=== BRANCHES ===\n');
  const branches = await prisma.branch.findMany({
    select: { systemId: true, id: true, name: true, isDefault: true },
  });
  for (const b of branches) {
    console.log(`${b.id} (${b.systemId}) - ${b.name} ${b.isDefault ? '(DEFAULT)' : ''}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
