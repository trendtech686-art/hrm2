// @ts-nocheck
const { PrismaClient } = require('./generated/prisma/client');

const prisma = new PrismaClient();

async function main() {
  const customer = await prisma.customer.findFirst({
    where: { name: { contains: 'bmt', mode: 'insensitive' } },
    select: { 
      systemId: true,
      name: true, 
      currentDebt: true, 
      maxDebt: true,
      totalSpent: true,
    }
  });
  
  console.log('Customer found:', customer);
  if (customer) {
    console.log('currentDebt type:', typeof customer.currentDebt);
    console.log('maxDebt type:', typeof customer.maxDebt);
    console.log('currentDebt toString:', customer.currentDebt?.toString());
    console.log('maxDebt toString:', customer.maxDebt?.toString());
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
