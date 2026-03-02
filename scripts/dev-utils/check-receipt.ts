import { prisma } from './lib/prisma';

async function main() {
  const receipt = await prisma.receipt.findFirst({ 
    where: { systemId: 'RECEIPT000001' },
  });
  console.log('Receipt:', JSON.stringify(receipt, null, 2));
  
  const payment = await prisma.orderPayment.findFirst({
    where: { linkedReceiptSystemId: 'RECEIPT000001' }
  });
  console.log('OrderPayment:', JSON.stringify(payment, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
