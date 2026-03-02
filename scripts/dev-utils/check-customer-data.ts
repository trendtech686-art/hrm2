import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ 
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) 
});

async function main() {
  const customer = await prisma.customer.findFirst({
    select: {
      systemId: true,
      id: true,
      name: true,
      address: true,
      province: true,
      district: true,
      ward: true,
      totalSpent: true,
      totalOrders: true,
      totalProductsBought: true,
      maxDebt: true,
      allowCredit: true,
    }
  });
  console.log('Customer data:', JSON.stringify(customer, null, 2));
  
  const count = await prisma.customer.count();
  console.log('Total customers:', count);
}

main()
  .finally(() => prisma.$disconnect());
