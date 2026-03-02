import { config } from 'dotenv';
config({ path: '.env' });

import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  // Get product
  const product = await prisma.product.findFirst({
    where: { id: 'HX53' },
    select: { systemId: true, id: true, name: true, totalSold: true }
  });
  console.log('Product:', product?.id, '- totalSold:', product?.totalSold);

  // Get inventory per branch
  const inventories = await prisma.productInventory.findMany({
    where: { product: { id: 'HX53' } },
    include: { branch: { select: { systemId: true, id: true, name: true } } }
  });
  console.log('\nProductInventory by branch:');
  inventories.forEach(i => {
    console.log(`  ${i.branch?.name}: onHand=${i.onHand}, committed=${i.committed}, inDelivery=${i.inDelivery}`);
  });

  // Get orders with this product
  const orders = await prisma.order.findMany({
    where: {
      lineItems: { some: { product: { id: 'HX53' } } },
      status: { not: 'CANCELLED' }
    },
    include: {
      lineItems: { where: { product: { id: 'HX53' } } },
      branch: { select: { systemId: true, name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  console.log('\nOrders with HX53:');
  orders.forEach(o => {
    const qty = o.lineItems.reduce((sum, li) => sum + li.quantity, 0);
    console.log(`  ${o.id} | Status: ${o.status} | StockOut: ${o.stockOutStatus} | Qty: ${qty}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
