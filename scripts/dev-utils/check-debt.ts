import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  const customers = await prisma.customer.findMany({
    where: { currentDebt: { gt: 0 } },
    take: 5,
    select: { systemId: true, name: true, currentDebt: true }
  });
  console.log(JSON.stringify(customers, null, 2));
}

main().finally(() => prisma.$disconnect());
