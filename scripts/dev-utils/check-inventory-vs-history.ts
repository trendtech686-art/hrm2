/**
 * Script kiểm tra sự đồng bộ giữa ProductInventory.onHand và StockHistory.newStockLevel
 * 
 * Tab "Tồn kho" lấy từ ProductInventory.onHand
 * Tab "Lịch sử kho" lấy từ StockHistory.newStockLevel (dòng cuối cùng)
 * 
 * 2 con số này phải KHỚP NHAU - nếu không khớp là có bug
 */

import { config } from 'dotenv';
config({ path: '.env' });

import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log('Checking inventory sync between ProductInventory and StockHistory...\n');
  
  // Get all product-branch combinations from ProductInventory
  const inventories = await prisma.productInventory.findMany({
    include: {
      product: {
        select: { id: true, name: true, systemId: true }
      },
      branch: {
        select: { name: true, systemId: true }
      }
    }
  });
  
  console.log(`Found ${inventories.length} ProductInventory records\n`);
  
  const mismatches: Array<{
    productId: string;
    productName: string;
    branchName: string;
    inventoryOnHand: number;
    stockHistoryLevel: number | null;
    difference: number;
    lastAction?: string;
    lastDocumentId?: string;
  }> = [];
  
  for (const inv of inventories) {
    // Get the latest StockHistory entry for this product-branch
    const latestHistory = await prisma.stockHistory.findFirst({
      where: {
        productId: inv.productId,
        branchId: inv.branchId,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        newStockLevel: true,
        action: true,
        createdAt: true,
        documentId: true,
      }
    });
    
    const inventoryOnHand = inv.onHand;
    const stockHistoryLevel = latestHistory?.newStockLevel ?? null;
    
    // Check for mismatch
    if (stockHistoryLevel !== null && inventoryOnHand !== stockHistoryLevel) {
      mismatches.push({
        productId: inv.product.id,
        productName: inv.product.name.substring(0, 30),
        branchName: inv.branch.name,
        inventoryOnHand,
        stockHistoryLevel,
        difference: inventoryOnHand - stockHistoryLevel,
        lastAction: latestHistory?.action,
        lastDocumentId: latestHistory?.documentId || undefined,
      });
    } else if (stockHistoryLevel === null && inventoryOnHand !== 0) {
      // Has inventory but no stock history
      mismatches.push({
        productId: inv.product.id,
        productName: inv.product.name.substring(0, 30),
        branchName: inv.branch.name,
        inventoryOnHand,
        stockHistoryLevel: null,
        difference: inventoryOnHand,
      });
    }
  }
  
  if (mismatches.length === 0) {
    console.log('✅ All ProductInventory records match with StockHistory!');
  } else {
    console.log(`❌ Found ${mismatches.length} mismatches:\n`);
    
    // Show table
    console.table(mismatches.slice(0, 30));
    
    if (mismatches.length > 30) {
      console.log(`\n... and ${mismatches.length - 30} more mismatches`);
    }
    
    // Summary by difference type
    const negativeInInventory = mismatches.filter(m => m.inventoryOnHand < 0);
    const historyAheadOfInventory = mismatches.filter(m => m.difference < 0 && m.stockHistoryLevel !== null);
    const inventoryAheadOfHistory = mismatches.filter(m => m.difference > 0 && m.stockHistoryLevel !== null);
    const noHistory = mismatches.filter(m => m.stockHistoryLevel === null);
    
    console.log('\n--- Summary ---');
    console.log(`Negative inventory (onHand < 0): ${negativeInInventory.length}`);
    console.log(`History ahead of inventory (diff < 0): ${historyAheadOfInventory.length}`);
    console.log(`Inventory ahead of history (diff > 0): ${inventoryAheadOfHistory.length}`);
    console.log(`No stock history: ${noHistory.length}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
