import { prisma } from './lib/prisma';

async function main() {
  // Update all shipments where packaging is CANCELLED
  const result = await prisma.shipment.updateMany({
    where: {
      packaging: {
        status: 'CANCELLED',
      },
    },
    data: {
      status: 'CANCELLED',
    },
  });
  
  console.log('Updated', result.count, 'shipments to CANCELLED status');
  
  // List current shipments
  const shipments = await prisma.shipment.findMany({
    select: {
      systemId: true,
      status: true,
      packaging: {
        select: {
          systemId: true,
          status: true,
        },
      },
    },
  });
  
  console.log('\nCurrent shipments:');
  shipments.forEach(s => {
    console.log(`  ${s.systemId}: status=${s.status}, packaging=${s.packaging?.systemId} (${s.packaging?.status})`);
  });
}

main().catch(console.error);
