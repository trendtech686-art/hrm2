import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function main() {
  console.log('=== ORDER ID CHECK ===\n');
  
  // Recent orders
  const orders = await prisma.order.findMany({
    select: { id: true, systemId: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  console.log('Recent orders (by createdAt desc):');
  orders.forEach(o => console.log(`  ${o.id} | ${o.systemId} | ${o.createdAt}`));
  
  // Last by id desc (string sort)
  const lastByIdDesc = await prisma.order.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true },
    where: { id: { startsWith: 'DH' } }
  });
  console.log('\nLast by id DESC (used for generation):', lastByIdDesc);
  
  // Check what next ID would be
  if (lastByIdDesc?.id) {
    const lastNum = parseInt(lastByIdDesc.id.replace('DH', '')) || 0;
    console.log('Parsed number:', lastNum);
    console.log('Next ID would be:', `DH${String(lastNum + 1).padStart(6, '0')}`);
  }
  
  // Check if that ID already exists
  const nextId = lastByIdDesc?.id 
    ? `DH${String((parseInt(lastByIdDesc.id.replace('DH', '')) || 0) + 1).padStart(6, '0')}`
    : 'DH000001';
  
  const exists = await prisma.order.findUnique({
    where: { id: nextId },
    select: { id: true }
  });
  console.log(`\nNext ID "${nextId}" already exists?:`, !!exists);
  
  // Find all orders with DH prefix, sorted properly
  const allDHOrders = await prisma.order.findMany({
    where: { id: { startsWith: 'DH' } },
    select: { id: true },
  });
  console.log('\nTotal DH orders:', allDHOrders.length);
  
  // Find max number
  let maxNum = 0;
  allDHOrders.forEach(o => {
    const num = parseInt(o.id.replace('DH', '')) || 0;
    if (num > maxNum) maxNum = num;
  });
  console.log('Max DH number:', maxNum);
  console.log('Correct next ID should be:', `DH${String(maxNum + 1).padStart(6, '0')}`);
  
  await prisma.$disconnect();
}

main().catch(console.error);
