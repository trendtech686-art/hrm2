// Debug script để check inventory receipts cho PO000008
import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

async function main() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
  
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Tìm PO000008
    const po = await prisma.purchaseOrder.findFirst({
      where: { id: { contains: 'PO000008' } },
      select: {
        systemId: true,
        id: true,
        deliveryStatus: true,
        lineItems: true,
      }
    });

    if (po) {
      console.log('\n=== PURCHASE ORDER ===');
      console.log(`ID: ${po.id}, SystemId: ${po.systemId}`);
      console.log(`Delivery Status: ${po.deliveryStatus}`);
      console.log(`Line Items: ${JSON.stringify(po.lineItems, null, 2)}`);

      // Tìm inventory receipts cho PO này
      const receipts = await prisma.inventoryReceipt.findMany({
        where: {
          OR: [
            { purchaseOrderSystemId: po.systemId },
            { purchaseOrderId: po.id },
          ]
        },
        include: {
          items: true,
        }
      });

      console.log(`\n=== INVENTORY RECEIPTS FOR ${po.id} ===`);
      console.log(`Found: ${receipts.length} receipts`);
      
      for (const r of receipts) {
        console.log(`\n${r.id} (${r.systemId})`);
        console.log(`  Created: ${r.createdAt}`);
        console.log(`  Items count: ${r.items.length}`);
        for (const item of r.items) {
          console.log(`    - Product: ${item.productId}, Qty: ${item.quantity}`);
        }
      }
    } else {
      console.log('PO000008 not found');
    }

    // Lấy tất cả inventory receipts gần đây
    console.log('\n=== ALL RECENT INVENTORY RECEIPTS ===');
    const allReceipts = await prisma.inventoryReceipt.findMany({
      orderBy: { createdAt: 'desc' },
      take: 15,
      include: {
        items: true,
      }
    });

    for (const r of allReceipts) {
      const totalQty = r.items.reduce((sum, i) => sum + i.quantity, 0);
      console.log(`${r.id}: PO=${r.purchaseOrderId || 'N/A'}, Items=${r.items.length}, TotalQty=${totalQty}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
