import { prisma } from './lib/prisma';

async function main() {
  // Check latest packaging with all fields
  const pkg = await prisma.packaging.findFirst({
    orderBy: { createdAt: 'desc' },
    select: {
      systemId: true,
      orderId: true,
      carrier: true,
      trackingCode: true,
      status: true,
      deliveryStatus: true,
      deliveryMethod: true,
      service: true,
      payer: true,
      shippingFeeToPartner: true,
      codAmount: true,
      weight: true,
      dimensions: true,
    }
  });
  console.log('Latest packaging:', JSON.stringify(pkg, null, 2));
}

main().finally(() => prisma.$disconnect());
