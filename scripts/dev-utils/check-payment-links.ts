// Script để check payment links với purchase orders
import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Checking payment links...\n');

  // Lấy tất cả payments
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      systemId: true,
      id: true,
      recipientName: true,
      amount: true,
      purchaseOrderId: true,
      purchaseOrderSystemId: true,
      originalDocumentId: true,
    }
  });

  console.log('=== RECENT PAYMENTS ===\n');
  for (const p of payments) {
    console.log(`${p.id} (${p.systemId})`);
    console.log(`  Recipient: ${p.recipientName}`);
    console.log(`  Amount: ${p.amount?.toLocaleString()}`);
    console.log(`  purchaseOrderId: ${p.purchaseOrderId || '(null)'}`);
    console.log(`  purchaseOrderSystemId: ${p.purchaseOrderSystemId || '(null)'}`);
    console.log(`  originalDocumentId: ${p.originalDocumentId || '(null)'}`);
    console.log('');
  }

  // Lấy tất cả purchase orders
  const orders = await prisma.purchaseOrder.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      systemId: true,
      id: true,
      supplierName: true,
    }
  });

  console.log('=== RECENT PURCHASE ORDERS ===\n');
  for (const o of orders) {
    console.log(`${o.id} (${o.systemId}) - ${o.supplierName}`);
  }

  // Check matching
  console.log('\n=== MATCHING ANALYSIS ===\n');
  for (const order of orders) {
    const matchingPayments = payments.filter(p => {
      if (p.purchaseOrderSystemId === order.systemId) return true;
      if (p.purchaseOrderId === order.systemId || p.purchaseOrderId === order.id) return true;
      if (p.originalDocumentId === order.systemId || p.originalDocumentId === order.id) return true;
      return false;
    });
    
    console.log(`${order.id} (${order.systemId}):`);
    if (matchingPayments.length > 0) {
      matchingPayments.forEach(p => {
        console.log(`  ✓ ${p.id} - ${p.amount?.toLocaleString()}`);
        console.log(`    via: purchaseOrderId=${p.purchaseOrderId}, purchaseOrderSystemId=${p.purchaseOrderSystemId}, originalDocumentId=${p.originalDocumentId}`);
      });
    } else {
      console.log('  (no matching payments)');
    }
    console.log('');
  }

  await prisma.$disconnect();
}

main().catch(console.error);
