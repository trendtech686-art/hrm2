import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkPOIds() {
  const orders = await prisma.purchaseOrder.findMany({
    where: { isDeleted: false },
    select: {
      systemId: true,
      id: true,
    },
    take: 5,
  });

  console.log('Purchase Orders:');
  orders.forEach(po => {
    console.log(`  systemId: ${po.systemId}, id (businessId): ${po.id}`);
  });

  await prisma.$disconnect();
  await pool.end();
}

checkPOIds().catch(console.error);
