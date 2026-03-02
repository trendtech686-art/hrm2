import { prisma } from './lib/prisma';

async function main() {
  const sr = await prisma.salesReturn.findFirst({
    where: { id: 'TH000014' },
    select: {
      systemId: true,
      id: true,
      exchangeOrderSystemId: true,
      deliveryMethod: true,
      exchangeItems: true,
    }
  });
  
  console.log('=== SalesReturn TH000014 ===');
  console.log('exchangeOrderSystemId:', sr?.exchangeOrderSystemId);
  console.log('deliveryMethod:', sr?.deliveryMethod);
  
  if (sr?.exchangeOrderSystemId) {
    const exchangeOrder = await prisma.order.findUnique({
      where: { systemId: sr.exchangeOrderSystemId },
      include: { packagings: true }
    });
    
    console.log('\n=== Exchange Order ===');
    console.log('Order ID:', exchangeOrder?.id);
    console.log('Packagings:', exchangeOrder?.packagings?.map(p => ({
      id: p.id,
      trackingCode: p.trackingCode,
    })));
  } else {
    console.log('\n❌ No exchangeOrderSystemId!');
  }
}

main().catch(console.error);
