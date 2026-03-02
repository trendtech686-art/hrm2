import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ 
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) 
});

async function main() {
  const suppliers = await prisma.supplier.findMany({
    take: 10,
    select: { systemId: true, id: true, name: true, status: true, isDeleted: true }
  });
  console.log('Suppliers:', JSON.stringify(suppliers, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);
