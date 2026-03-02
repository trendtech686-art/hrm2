import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkPayments() {
  const payments = await prisma.payment.findMany({
    select: { 
      id: true, 
      systemId: true, 
      purchaseOrderSystemId: true, 
      purchaseOrderId: true, 
      amount: true, 
      recipientSystemId: true,
      originalDocumentId: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  console.log('Payments:');
  payments.forEach(p => {
    console.log(JSON.stringify(p, null, 2));
  });

  await prisma.$disconnect();
  await pool.end();
}

checkPayments().catch(console.error);
