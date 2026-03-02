/**
 * Script to fix orders that have been delivered (in-store pickup) but still have PROCESSING status
 */
import { config } from 'dotenv';
config({ path: '.env' });

import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log('=== Fixing orders with incorrect status after in-store pickup ===\n');

  // Find orders that have PROCESSING status but packaging is DELIVERED
  const ordersToFix = await prisma.order.findMany({
    where: {
      status: 'PROCESSING',
      packagings: {
        some: {
          deliveryStatus: 'DELIVERED',
          deliveryMethod: 'PICKUP',
        }
      }
    },
    include: {
      packagings: true,
      payments: true,
    }
  });

  console.log(`Found ${ordersToFix.length} orders to fix\n`);

  for (const order of ordersToFix) {
    const grandTotal = Number(order.grandTotal || 0);
    const linkedReturnValue = Number(order.linkedSalesReturnValue || 0);
    const netGrandTotal = Math.max(0, grandTotal - linkedReturnValue);
    const totalPaid = order.payments?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;
    const isFullyPaid = totalPaid >= netGrandTotal;
    
    const newStatus = isFullyPaid ? 'COMPLETED' : 'DELIVERED';
    
    console.log(`${order.id}: PROCESSING -> ${newStatus} (paid: ${totalPaid}/${netGrandTotal})`);
    
    await prisma.order.update({
      where: { systemId: order.systemId },
      data: {
        status: newStatus,
        stockOutStatus: 'FULLY_STOCKED_OUT',
        dispatchedDate: order.dispatchedDate || new Date(),
        ...(isFullyPaid && !order.completedDate && { completedDate: new Date() }),
      }
    });
  }

  console.log('\n=== Done ===');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
