import { prisma } from '../lib/prisma';

async function main() {
  console.log('=== Sale Pricing Policies ===');
  const policies = await prisma.pricingPolicy.findMany({
    where: { type: 'sale' },
    select: { systemId: true, name: true, isDefault: true },
    orderBy: { name: 'asc' }
  });
  console.log(JSON.stringify(policies, null, 2));
  
  console.log('\n=== PKGX Price Mappings ===');
  const mappings = await prisma.pkgxPriceMapping.findMany({
    select: { priceType: true, pricingPolicyId: true }
  });
  console.log(JSON.stringify(mappings, null, 2));
  
  // Check if policy IDs in mappings exist
  console.log('\n=== Mapping Validation ===');
  const policyIds = new Set(policies.map(p => p.systemId));
  for (const m of mappings) {
    if (!m.pricingPolicyId) {
      console.log(`${m.priceType} -> (not mapped)`);
      continue;
    }
    const exists = policyIds.has(m.pricingPolicyId);
    console.log(`${m.priceType} -> ${m.pricingPolicyId}: ${exists ? '✅' : '❌ NOT FOUND'}`);
  }
  
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
