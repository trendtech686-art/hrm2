/**
 * Diagnostic: Check why delivered GHTK orders don't show in COD reconciliation
 * 
 * Usage: npx tsx scripts/check-cod-reconciliation.ts
 */

import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🔍 Checking COD reconciliation data...\n');

  // 1. Find all DELIVERED packagings with GHTK
  const deliveredPackagings = await prisma.packaging.findMany({
    where: {
      deliveryStatus: 'DELIVERED',
      carrier: { not: null },
    },
    select: {
      systemId: true,
      id: true,
      orderId: true,
      carrier: true,
      trackingCode: true,
      codAmount: true,
      reconciliationStatus: true,
      deliveryStatus: true,
      deliveredDate: true,
      shippingFeeToPartner: true,
      order: { select: { id: true, grandTotal: true, paidAmount: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  console.log(`📦 DELIVERED packagings (last 20): ${deliveredPackagings.length}\n`);
  
  for (const pkg of deliveredPackagings) {
    const codAmount = pkg.codAmount ? Number(pkg.codAmount) : null;
    const inReconciliation = codAmount != null && codAmount > 0 && pkg.orderId != null;
    
    console.log(`  ${pkg.order?.id || 'N/A'} | ${pkg.carrier || 'N/A'} | tracking: ${pkg.trackingCode || 'N/A'}`);
    console.log(`    codAmount: ${codAmount} | reconciliationStatus: ${pkg.reconciliationStatus || 'NULL'}`);
    console.log(`    deliveryStatus: ${pkg.deliveryStatus} | deliveredDate: ${pkg.deliveredDate}`);
    console.log(`    orderId: ${pkg.orderId} | shippingFee: ${pkg.shippingFeeToPartner ? Number(pkg.shippingFeeToPartner) : 'NULL'}`);
    console.log(`    Would show in reconciliation: ${inReconciliation ? '✅ YES' : '❌ NO (codAmount is ' + codAmount + ')'}`);
    console.log('');
  }

  // 2. Check what the reconciliation API would return
  const reconItems = await prisma.packaging.findMany({
    where: {
      deliveryStatus: 'DELIVERED',
      codAmount: { gt: 0 },
      orderId: { not: null },
      NOT: { reconciliationStatus: 'Đã đối soát' },
    },
    select: {
      systemId: true,
      id: true,
      codAmount: true,
      carrier: true,
      trackingCode: true,
      reconciliationStatus: true,
      order: { select: { id: true } },
    },
    take: 20,
  });

  console.log(`\n📋 Items matching reconciliation query (pending): ${reconItems.length}`);
  for (const item of reconItems) {
    console.log(`  ${item.order?.id} | ${item.carrier} | ${item.trackingCode} | COD: ${Number(item.codAmount)} | Status: ${item.reconciliationStatus || 'NULL'}`);
  }

  // 3. Check specifically for DH000014
  const dh14Order = await prisma.order.findFirst({
    where: { id: 'DH000014' },
    select: { systemId: true, id: true, grandTotal: true, paidAmount: true, status: true, deliveryStatus: true },
  });

  if (dh14Order) {
    console.log(`\n🎯 Order DH000014:`);
    console.log(`  status: ${dh14Order.status} | deliveryStatus: ${dh14Order.deliveryStatus}`);
    console.log(`  grandTotal: ${Number(dh14Order.grandTotal)} | paidAmount: ${Number(dh14Order.paidAmount)}`);

    const dh14Packagings = await prisma.packaging.findMany({
      where: { orderId: dh14Order.systemId },
      select: {
        systemId: true,
        id: true,
        carrier: true,
        trackingCode: true,
        codAmount: true,
        reconciliationStatus: true,
        deliveryStatus: true,
        deliveredDate: true,
        shippingFeeToPartner: true,
        status: true,
      },
    });

    console.log(`  Packagings: ${dh14Packagings.length}`);
    for (const pkg of dh14Packagings) {
      console.log(`    ${pkg.id} | carrier: ${pkg.carrier} | tracking: ${pkg.trackingCode}`);
      console.log(`    deliveryStatus: ${pkg.deliveryStatus} | status: ${pkg.status}`);
      console.log(`    codAmount: ${pkg.codAmount ? Number(pkg.codAmount) : 'NULL'} | reconciliationStatus: ${pkg.reconciliationStatus || 'NULL'}`);
      console.log(`    shippingFee: ${pkg.shippingFeeToPartner ? Number(pkg.shippingFeeToPartner) : 'NULL'}`);
    }
  } else {
    console.log('\n⚠️ Order DH000014 not found');
  }

  // 4. Summary stats
  const totalDelivered = await prisma.packaging.count({
    where: { deliveryStatus: 'DELIVERED' },
  });
  const deliveredWithCod = await prisma.packaging.count({
    where: { deliveryStatus: 'DELIVERED', codAmount: { gt: 0 } },
  });
  const deliveredWithOrder = await prisma.packaging.count({
    where: { deliveryStatus: 'DELIVERED', orderId: { not: null } },
  });

  console.log(`\n📊 Summary:`);
  console.log(`  Total DELIVERED packagings: ${totalDelivered}`);
  console.log(`  With codAmount > 0: ${deliveredWithCod}`);
  console.log(`  With orderId: ${deliveredWithOrder}`);
  console.log(`  Matching all conditions: ${reconItems.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
