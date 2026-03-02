import { prisma } from './lib/prisma';

async function main() {
  console.log('=== Checking Packaging in Database ===\n');
  
  // Check if Packaging table exists by trying to count
  try {
    const count = await prisma.packaging.count();
    console.log(`Packaging count: ${count}`);
    
    // Get all packagings
    const packagings = await prisma.packaging.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        systemId: true,
        id: true,
        orderId: true,
        status: true,
      }
    });
    
    console.log('\nRecent packagings:');
    packagings.forEach(p => {
      console.log(`  - systemId: ${p.systemId}, id: ${p.id}, orderId: ${p.orderId}, status: ${p.status}`);
    });
  } catch (e) {
    console.log('Error querying Packaging table:', e);
  }
  
  // Check Orders with embedded packagings
  console.log('\n=== Checking Orders with packagings ===\n');
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      packagings: {
        select: {
          systemId: true,
          id: true,
          status: true,
        }
      }
    }
  });
  
  orders.forEach(o => {
    console.log(`Order ${o.id} (${o.systemId}):`);
    if (o.packagings.length === 0) {
      console.log('  No packagings');
    } else {
      o.packagings.forEach(p => {
        console.log(`  - Packaging systemId: ${p.systemId}, id: ${p.id}, status: ${p.status}`);
      });
    }
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
