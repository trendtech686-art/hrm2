import { config } from 'dotenv';
config();

import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Find payments with wrong systemId format (PAY + timestamp)
  const wrongPayments = await prisma.payment.findMany({
    where: {
      systemId: { startsWith: 'PAY' }
    }
  });
  console.log('Payments with PAY prefix (timestamp format):', wrongPayments.length);
  
  // Delete them
  if (wrongPayments.length > 0) {
    // First delete related audit logs
    for (const p of wrongPayments) {
      await prisma.auditLog.deleteMany({
        where: {
          entityType: 'payment',
          entityId: p.systemId
        }
      });
    }
    
    await prisma.payment.deleteMany({
      where: {
        systemId: { startsWith: 'PAY' }
      }
    });
    console.log('Deleted', wrongPayments.length, 'payments with wrong systemId format');
  }
  
  // Check remaining payments
  const remaining = await prisma.payment.findMany();
  console.log('\nRemaining payments:', remaining.length);
  for (const p of remaining) {
    console.log('-', p.systemId, '|', p.id, '|', Number(p.amount), '|', p.description?.substring(0, 50));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
