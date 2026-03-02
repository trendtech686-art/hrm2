import { config } from 'dotenv';
config({ path: '.env' });

import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const orders = await prisma.order.findMany({
    take: 5,
    select: {
      id: true,
      systemId: true,
      orderDate: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  
  console.log('Orders in database:');
  orders.forEach(o => {
    console.log(`  ${o.id}: orderDate=${o.orderDate?.toISOString()}, createdAt=${o.createdAt?.toISOString()}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
