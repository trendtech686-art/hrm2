import { prisma } from './lib/prisma';

async function main() {
  // Fix packaging records that have GHTK tracking but wrong deliveryStatus
  // Using enum values from Prisma schema
  const result = await prisma.packaging.updateMany({
    where: {
      trackingCode: { not: null },
      carrier: 'GHTK',
      status: { not: 'CANCELLED' }, // PackagingStatus enum
      OR: [
        { deliveryStatus: null },
        { deliveryStatus: 'CANCELLED' },
      ]
    },
    data: {
      deliveryStatus: 'PENDING_SHIP', // Chờ lấy hàng
      deliveryMethod: 'SHIPPING', // Dịch vụ giao hàng
    },
  });

  console.log('Updated packaging records:', result.count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
