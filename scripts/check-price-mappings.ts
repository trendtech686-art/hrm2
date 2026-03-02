import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('=== PKGX Price Mappings ===');
  const mappings = await prisma.pkgxPriceMapping.findMany({
    where: { isActive: true },
  });
  
  if (mappings.length === 0) {
    console.log('⚠️ No active price mappings found!');
  } else {
    for (const m of mappings) {
      console.log(`  ${m.priceType} => ${m.pricingPolicyId || 'NOT MAPPED'}`);
    }
  }
  
  console.log('\n=== All Pricing Policies ===');
  const allPolicies = await prisma.pricingPolicy.findMany({
    select: { systemId: true, name: true, type: true },
    orderBy: { name: 'asc' },
  });
  
  if (allPolicies.length === 0) {
    console.log('⚠️ No pricing policies found at all!');
  } else {
    const types = [...new Set(allPolicies.map(p => p.type))];
    console.log(`Types in DB: ${types.join(', ')}`);
    for (const p of allPolicies) {
      console.log(`  [${p.type}] ${p.systemId} - ${p.name}`);
    }
  }
  
  console.log('\n=== Mapping Validation ===');
  const policyIds = new Set(allPolicies.map(p => p.systemId));
  for (const m of mappings) {
    if (!m.pricingPolicyId) {
      console.log(`  ❌ ${m.priceType} - NOT MAPPED`);
    } else if (!policyIds.has(m.pricingPolicyId)) {
      console.log(`  ❌ ${m.priceType} => ${m.pricingPolicyId} - INVALID POLICY ID`);
    } else {
      const policy = allPolicies.find(p => p.systemId === m.pricingPolicyId);
      console.log(`  ✅ ${m.priceType} => ${policy?.name || m.pricingPolicyId}`);
    }
  }
  
  // Check a sample product's prices
  console.log('\n=== Sample Product Prices ===');
  const sampleProduct = await prisma.product.findFirst({
    where: { pkgxId: { not: null } },
    select: { systemId: true, name: true },
  });
  
  if (sampleProduct) {
    console.log(`Product: ${sampleProduct.name}`);
    const prices = await prisma.productPrice.findMany({
      where: { productId: sampleProduct.systemId },
      include: { pricingPolicy: true },
    });
    
    if (prices.length === 0) {
      console.log('  ⚠️ No prices found!');
    } else {
      for (const pr of prices) {
        console.log(`  ${pr.pricingPolicy?.name || pr.pricingPolicyId}: ${pr.price}`);
      }
    }
  } else {
    console.log('No PKGX-linked products found');
  }
  
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
