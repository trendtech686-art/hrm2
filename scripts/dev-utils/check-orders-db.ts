import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    select: {
      systemId: true,
      id: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  console.log('Latest orders:');
  orders.forEach(o => {
    console.log(`  ${o.systemId} - ${o.id} - ${o.createdAt}`);
  });

  // Get max systemId
  const allSystemIds = await prisma.order.findMany({
    where: { systemId: { startsWith: 'ORDER' } },
    select: { systemId: true },
  });
  
  let maxNum = 0;
  allSystemIds.forEach(o => {
    const num = parseInt(o.systemId.replace('ORDER', '')) || 0;
    if (num > maxNum) maxNum = num;
  });
  
  console.log(`\nMax systemId number: ${maxNum}`);
  console.log(`Next systemId would be: ORDER${String(maxNum + 1).padStart(6, '0')}`);
  
  // Check for orphan orders
  console.log(`\nTotal orders in DB: ${allSystemIds.length}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
