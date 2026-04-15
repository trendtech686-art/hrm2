/**
 * Debug: Check data availability for reconciliation sheet available-shipments API
 * 
 * Usage: $env:PYTHONIOENCODING='utf-8'; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; npx tsx scripts/debug-available-shipments.ts 2>&1
 */

import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🔍 Debug available-shipments cho phiếu đối soát...\n');

  // 1. Tổng quan packaging có COD > 0
  const totalWithCod = await prisma.packaging.count({ where: { codAmount: { gt: 0 } } });
  console.log(`📦 Tổng packaging có codAmount > 0: ${totalWithCod}`);

  // 2. Phân bố deliveryStatus cho packagings có COD
  const statusDist = await prisma.$queryRawUnsafe(`
    SELECT "deliveryStatus", "reconciliationStatus", "carrier", "sourceType",
           COUNT(*)::int as cnt
    FROM packagings 
    WHERE "codAmount" > 0
    GROUP BY "deliveryStatus", "reconciliationStatus", "carrier", "sourceType"
    ORDER BY cnt DESC
    LIMIT 30
  `) as Array<Record<string, unknown>>;
  console.log('\n📊 Phân bố deliveryStatus + reconciliationStatus + carrier:');
  console.table(statusDist);

  // 3. Check filter của available-shipments API
  const exactMatch = await prisma.packaging.count({
    where: {
      deliveryStatus: 'DELIVERED',
      codAmount: { gt: 0 },
      trackingCode: { not: null },
      sourceType: 'ORDER',
    },
  });
  console.log(`\n✅ Match exact API filter (DELIVERED + COD>0 + trackingCode + ORDER): ${exactMatch}`);

  // 4. Loosen filter: bất kỳ deliveryStatus nào
  const anyCodWithTracking = await prisma.packaging.count({
    where: {
      codAmount: { gt: 0 },
      trackingCode: { not: null },
      sourceType: 'ORDER',
    },
  });
  console.log(`📋 Bỏ filter DELIVERED (COD>0 + trackingCode + ORDER): ${anyCodWithTracking}`);

  // 5. Xem có bao nhiêu chưa đối soát
  const pending = await prisma.packaging.count({
    where: {
      codAmount: { gt: 0 },
      trackingCode: { not: null },
      sourceType: 'ORDER',
      NOT: { reconciliationStatus: 'Đã đối soát' },
    },
  });
  console.log(`⏳ Chưa đối soát (pending): ${pending}`);

  // 6. Top 10 mẫu thật
  const samples = await prisma.packaging.findMany({
    where: {
      codAmount: { gt: 0 },
      trackingCode: { not: null },
      sourceType: 'ORDER',
    },
    select: {
      systemId: true,
      id: true,
      trackingCode: true,
      carrier: true,
      codAmount: true,
      shippingFeeToPartner: true,
      deliveryStatus: true,
      reconciliationStatus: true,
      deliveredDate: true,
      order: { select: { systemId: true, id: true, customerName: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  console.log('\n📋 Top 10 mẫu packaging có COD + tracking:');
  for (const s of samples) {
    console.log(`  ${s.order?.id ?? 'N/A'} | ${s.carrier} | track: ${s.trackingCode}`);
    console.log(`    COD: ${Number(s.codAmount)} | fee: ${s.shippingFeeToPartner ? Number(s.shippingFeeToPartner) : 'NULL'}`);
    console.log(`    deliveryStatus: ${s.deliveryStatus} | recon: ${s.reconciliationStatus || 'NULL'}`);
    console.log('');
  }

  await prisma.$disconnect();
}

main().catch(console.error);
