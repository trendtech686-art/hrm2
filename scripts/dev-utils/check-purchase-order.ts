import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  const order = await prisma.purchaseOrder.findFirst({
    where: { id: 'PO000001' },
    select: {
      id: true,
      systemId: true,
      supplierId: true,
      supplierSystemId: true,
      supplierName: true,
      branchSystemId: true,
      branchName: true,
      buyerSystemId: true,
      buyer: true,
    },
  });
  console.log('Order data:', JSON.stringify(order, null, 2));
  await prisma.$disconnect();
  process.exit(0);
}
check();
