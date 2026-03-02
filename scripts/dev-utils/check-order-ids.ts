// Script to check order systemIds and find duplicates
import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  console.log('=== Checking Order SystemIds ===\n');

  // 1. Get all orders with systemId starting with ORD
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      systemId: true,
      createdAt: true,
      source: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  console.log('Latest 20 orders:');
  for (const order of orders) {
    console.log(`  ${order.systemId} | ${order.id} | ${order.source} | ${order.createdAt.toISOString()}`);
  }

  // 2. Find max counter - filter out non-standard formats
  const allStandardOrders = await prisma.order.findMany({
    where: { systemId: { startsWith: 'ORDER' } },
    select: { systemId: true },
  });
  
  const counters = allStandardOrders
    .map(o => parseInt(o.systemId.replace('ORDER', ''), 10))
    .filter(n => !isNaN(n))
    .sort((a, b) => a - b);
  
  const maxCounter = counters.length > 0 ? counters[counters.length - 1] : 0;
  console.log(`\nMax order counter in DB: ${maxCounter}`);
  console.log(`Next expected systemId: ORDER${String(maxCounter + 1).padStart(6, '0')}`);

  // 3. Check for non-standard systemIds
  const nonStandardOrders = await prisma.order.findMany({
    where: { NOT: { systemId: { startsWith: 'ORDER' } } },
    select: { systemId: true, id: true, source: true },
    take: 10,
  });
  
  if (nonStandardOrders.length > 0) {
    console.log('\n⚠️  Non-standard order systemIds found:');
    for (const o of nonStandardOrders) {
      console.log(`  ${o.systemId} | ${o.id} | ${o.source}`);
    }
  }

  // Check ENTITY_TABLE_MAP for orders
  console.log('\n=== ID Config Check ===');
  
  const allOrderIdsList = await prisma.order.findMany({
    where: { systemId: { startsWith: 'ORDER' } },
    select: { systemId: true },
    orderBy: { systemId: 'asc' },
  });

  const counters2 = allOrderIdsList
    .map(o => parseInt(o.systemId.replace('ORDER', ''), 10))
    .filter(n => !isNaN(n))
    .sort((a, b) => a - b);

  // Find duplicates
  const duplicates = counters2.filter((item, index) => counters2.indexOf(item) !== index);
  if (duplicates.length > 0) {
    console.log('\n⚠️  DUPLICATES FOUND:', duplicates);
  } else {
    console.log('\n✅ No duplicate counters found');
  }

  // Find gaps
  const gaps: number[] = [];
  for (let i = 1; i < counters2.length; i++) {
    if (counters2[i] - counters2[i - 1] > 1) {
      for (let j = counters2[i - 1] + 1; j < counters2[i]; j++) {
        gaps.push(j);
      }
    }
  }
  if (gaps.length > 0) {
    console.log(`\nGaps in sequence (${gaps.length}):`, gaps.slice(0, 20), gaps.length > 20 ? '...' : '');
  } else {
    console.log('\n✅ No gaps in sequence');
  }

  // 4. Check sales returns
  console.log('\n=== Checking Sales Return SystemIds ===');
  const salesReturns = await prisma.salesReturn.findMany({
    select: {
      id: true,
      systemId: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  console.log('Latest 10 sales returns:');
  for (const sr of salesReturns) {
    console.log(`  ${sr.systemId} | ${sr.id} | ${sr.createdAt.toISOString()}`);
  }

  // 5. Check exchange orders (source = 'exchange')
  console.log('\n=== Exchange Orders ===');
  const exchangeOrders = await prisma.order.findMany({
    where: { source: 'exchange' },
    select: {
      id: true,
      systemId: true,
      createdAt: true,
      notes: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  console.log(`Exchange orders count: ${exchangeOrders.length}`);
  for (const eo of exchangeOrders) {
    console.log(`  ${eo.systemId} | ${eo.id} | ${eo.notes?.substring(0, 50)}...`);
  }

  // 6. Check packagings
  console.log('\n=== Packaging SystemIds ===');
  const packagings = await prisma.packaging.findMany({
    select: {
      id: true,
      systemId: true,
      createdAt: true,
      orderId: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  console.log('Latest 10 packagings:');
  for (const pkg of packagings) {
    console.log(`  ${pkg.systemId} | ${pkg.id} | orderId: ${pkg.orderId}`);
  }
  
  // Check max packaging counter
  const allPkgs = await prisma.packaging.findMany({
    where: { systemId: { startsWith: 'PACKAGE' } },
    select: { systemId: true },
  });
  
  const pkgCounters = allPkgs
    .map(p => parseInt(p.systemId.replace('PACKAGE', ''), 10))
    .filter(n => !isNaN(n))
    .sort((a, b) => a - b);
  
  const maxPkgCounter = pkgCounters.length > 0 ? pkgCounters[pkgCounters.length - 1] : 0;
  console.log(`\nMax packaging counter: ${maxPkgCounter}`);
  console.log(`Next expected: PACKAGE${String(maxPkgCounter + 1).padStart(6, '0')}`);
  
  // 7. Check for non-standard packaging IDs (with suffix like -01)
  const nonStandardPkgs = await prisma.packaging.findMany({
    where: { systemId: { contains: '-' } },
    select: { systemId: true },
    take: 5,
  });
  
  if (nonStandardPkgs.length > 0) {
    console.log(`\n⚠️  Non-standard packaging IDs (with suffix):`, nonStandardPkgs.map(p => p.systemId));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
