/**
 * Script để sửa dữ liệu ProductInventory.onHand bị sai do bug ghi kép
 * 
 * Bug đã fix:
 * 1. use-po-receive-workflow.ts - gọi updateInventoryMutation sau khi createInventoryReceipt đã xử lý inventory
 * 2. purchase-returns/route.ts - dùng Math.max(0, ...) làm sai newStockLevel
 * 
 * Script này sẽ:
 * 1. Xóa các StockHistory entries trùng lặp (có documentId = null với action 'Nhập hàng từ NCC')
 * 2. Recalculate ProductInventory.onHand từ StockHistory.quantityChange
 */

import { config } from 'dotenv';
config({ path: '.env' });

import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  console.log('=== Fix Inventory Data Script ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes will be made)' : 'LIVE (changes will be applied)'}\n`);

  // Step 1: Find and remove duplicate StockHistory entries
  console.log('Step 1: Finding duplicate StockHistory entries...');
  
  // Duplicate entries are those with action 'Nhập hàng từ NCC' and documentId = null
  // These were created by the updateInventoryMutation call after createInventoryReceipt
  const duplicateEntries = await prisma.stockHistory.findMany({
    where: {
      action: 'Nhập hàng từ NCC',
      documentId: null,
    },
    select: {
      systemId: true,
      productId: true,
      branchId: true,
      quantityChange: true,
      createdAt: true,
    },
  });

  console.log(`Found ${duplicateEntries.length} duplicate entries to remove\n`);

  if (!DRY_RUN && duplicateEntries.length > 0) {
    const deleteResult = await prisma.stockHistory.deleteMany({
      where: {
        action: 'Nhập hàng từ NCC',
        documentId: null,
      },
    });
    console.log(`Deleted ${deleteResult.count} duplicate StockHistory entries\n`);
  }

  // Step 2: Recalculate ProductInventory.onHand from StockHistory
  console.log('Step 2: Recalculating ProductInventory.onHand from StockHistory...');

  // Get all unique product-branch combinations from ProductInventory
  const inventories = await prisma.productInventory.findMany({
    select: {
      productId: true,
      branchId: true,
      onHand: true,
    },
  });

  console.log(`Processing ${inventories.length} inventory records...\n`);

  let fixedCount = 0;
  const fixes: Array<{
    productId: string;
    branchId: string;
    oldOnHand: number;
    calculatedOnHand: number;
  }> = [];

  for (const inv of inventories) {
    // Sum all quantityChange from StockHistory for this product-branch
    const result = await prisma.stockHistory.aggregate({
      where: {
        productId: inv.productId,
        branchId: inv.branchId,
      },
      _sum: {
        quantityChange: true,
      },
    });

    const calculatedOnHand = result._sum.quantityChange || 0;

    if (calculatedOnHand !== inv.onHand) {
      fixes.push({
        productId: inv.productId,
        branchId: inv.branchId,
        oldOnHand: inv.onHand,
        calculatedOnHand,
      });

      if (!DRY_RUN) {
        await prisma.productInventory.update({
          where: {
            productId_branchId: {
              productId: inv.productId,
              branchId: inv.branchId,
            },
          },
          data: {
            onHand: calculatedOnHand,
          },
        });
        fixedCount++;
      }
    }
  }

  if (fixes.length > 0) {
    console.log(`Found ${fixes.length} inventory records needing correction:\n`);
    
    // Get product names for display
    const productIds = [...new Set(fixes.map(f => f.productId))];
    const products = await prisma.product.findMany({
      where: { systemId: { in: productIds } },
      select: { systemId: true, id: true, name: true },
    });
    const productMap = new Map(products.map(p => [p.systemId, { id: p.id, name: p.name }]));

    const branchIds = [...new Set(fixes.map(f => f.branchId))];
    const branches = await prisma.branch.findMany({
      where: { systemId: { in: branchIds } },
      select: { systemId: true, name: true },
    });
    const branchMap = new Map(branches.map(b => [b.systemId, b.name]));

    console.table(fixes.map(f => ({
      product: productMap.get(f.productId)?.id || f.productId,
      branch: branchMap.get(f.branchId) || f.branchId,
      oldOnHand: f.oldOnHand,
      calculatedOnHand: f.calculatedOnHand,
      diff: f.calculatedOnHand - f.oldOnHand,
    })));

    if (DRY_RUN) {
      console.log('\n⚠️  DRY RUN - No changes were made');
      console.log('Run without --dry-run to apply fixes');
    } else {
      console.log(`\n✅ Fixed ${fixedCount} inventory records`);
    }
  } else {
    console.log('✅ All inventory records are correct!');
  }

  // Step 3: Fix StockHistory.newStockLevel to match running total
  console.log('\nStep 3: Fixing StockHistory.newStockLevel values...');

  const allHistory = await prisma.stockHistory.findMany({
    orderBy: [
      { productId: 'asc' },
      { branchId: 'asc' },
      { createdAt: 'asc' },
    ],
    select: {
      systemId: true,
      productId: true,
      branchId: true,
      quantityChange: true,
      newStockLevel: true,
      createdAt: true,
    },
  });

  // Group by product-branch
  const grouped = new Map<string, typeof allHistory>();
  for (const entry of allHistory) {
    const key = `${entry.productId}:${entry.branchId}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(entry);
  }

  let stockLevelFixCount = 0;
  for (const [, entries] of grouped) {
    let runningTotal = 0;
    for (const entry of entries) {
      runningTotal += entry.quantityChange;
      if (entry.newStockLevel !== runningTotal) {
        if (!DRY_RUN) {
          await prisma.stockHistory.update({
            where: { systemId: entry.systemId },
            data: { newStockLevel: runningTotal },
          });
        }
        stockLevelFixCount++;
      }
    }
  }

  if (stockLevelFixCount > 0) {
    if (DRY_RUN) {
      console.log(`Would fix ${stockLevelFixCount} StockHistory.newStockLevel values`);
    } else {
      console.log(`✅ Fixed ${stockLevelFixCount} StockHistory.newStockLevel values`);
    }
  } else {
    console.log('✅ All StockHistory.newStockLevel values are correct!');
  }

  console.log('\n=== Script completed ===');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
