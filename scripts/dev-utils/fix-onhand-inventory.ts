import 'dotenv/config';
import { prisma } from './lib/prisma';

/**
 * Script tính lại onHand cho tất cả sản phẩm dựa trên StockHistory
 * 
 * Logic:
 * - Tính tổng quantityChange từ StockHistory
 * - Update ProductInventory.onHand
 * - Fix newStockLevel trong StockHistory records
 */
async function fixOnHand() {
  console.log('🔍 Tính lại onHand cho tất cả sản phẩm...\n');

  // Lấy tất cả ProductInventory
  const inventories = await prisma.productInventory.findMany({
    include: {
      product: { select: { name: true } },
      branch: { select: { name: true } },
    },
  });

  let updated = 0;

  for (const inv of inventories) {
    // Tính tổng quantityChange từ StockHistory
    const histories = await prisma.stockHistory.findMany({
      where: {
        productId: inv.productId,
        branchId: inv.branchId,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Tính onHand từ history
    let calculatedOnHand = 0;
    for (const h of histories) {
      calculatedOnHand += h.quantityChange;
    }

    // So sánh với hiện tại
    if (inv.onHand !== calculatedOnHand) {
      console.log(`${inv.product?.name || inv.productId} @ ${inv.branch?.name || inv.branchId}:`);
      console.log(`  Current onHand: ${inv.onHand}, Calculated: ${calculatedOnHand}`);
      
      // Update ProductInventory
      await prisma.productInventory.update({
        where: {
          productId_branchId: { productId: inv.productId, branchId: inv.branchId },
        },
        data: { onHand: calculatedOnHand },
      });
      
      // Update newStockLevel trong StockHistory
      let runningTotal = 0;
      for (const h of histories) {
        runningTotal += h.quantityChange;
        if (h.newStockLevel !== runningTotal) {
          await prisma.stockHistory.update({
            where: { systemId: h.systemId },
            data: { newStockLevel: runningTotal },
          });
        }
      }
      
      console.log(`  ✅ Updated to: ${calculatedOnHand}`);
      updated++;
    }
  }

  console.log(`\n✅ Hoàn thành: Updated ${updated} products`);
}

fixOnHand()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
