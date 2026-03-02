// Test script to check if prices are transformed correctly
// Run: npx tsx test-prices-api.ts

import { prisma } from './lib/prisma';

async function main() {
  // Get a product with prices from DB
  const product = await prisma.product.findFirst({
    where: { 
      pkgxId: { not: null },
      isDeleted: false,
    },
    include: {
      prices: {
        include: {
          pricingPolicy: true,
        },
      },
    },
  });

  if (!product) {
    console.log('No PKGX products found');
    return;
  }

  console.log('=== RAW PRISMA DATA ===');
  console.log('Product:', product.name);
  console.log('Prices array from Prisma:');
  console.log(JSON.stringify(product.prices, null, 2));

  // Transform prices like the API does
  const pricesRecord: Record<string, number> = {};
  for (const pp of product.prices) {
    if (pp.pricingPolicyId && pp.price != null) {
      pricesRecord[pp.pricingPolicyId] = Number(pp.price);
    }
  }

  console.log('\n=== TRANSFORMED DATA ===');
  console.log('Prices Record:');
  console.log(JSON.stringify(pricesRecord, null, 2));

  // Check policies
  const policies = await prisma.pricingPolicy.findMany({
    where: { type: 'Bán hàng' },
  });
  
  console.log('\n=== PRICING POLICIES (Bán hàng) ===');
  for (const p of policies) {
    console.log(`- ${p.name} (${p.systemId}): ${pricesRecord[p.systemId] ?? 'NO PRICE'}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
