import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  // Check ALL PricingPolicies (không chỉ type='Bán hàng')
  console.log('=== ALL Pricing Policies in DB ===');
  const policies = await prisma.pricingPolicy.findMany({
    orderBy: { name: 'asc' },
  });
  policies.forEach(p => {
    console.log(`  ${p.systemId} => "${p.name}" (type: ${p.type}, default: ${p.isDefault})`);
  });
  console.log(`\nTotal: ${policies.length} policies`);

  // Check PkgxPriceMapping
  console.log('\n=== PKGX Price Mappings in DB ===');
  const mappings = await prisma.pkgxPriceMapping.findMany();
  mappings.forEach(m => {
    const policy = policies.find(p => p.systemId === m.pricingPolicyId);
    console.log(`  ${m.priceType} => ${m.pricingPolicyId} (${policy?.name || 'NOT FOUND'}) [active: ${m.isActive}]`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
