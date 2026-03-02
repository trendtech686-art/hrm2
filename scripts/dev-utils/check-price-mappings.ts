import 'dotenv/config';
import { prisma } from './lib/prisma';

async function checkPriceMappings() {
  try {
    console.log('🔍 Kiểm tra price mappings...\n');
    
    const mappings = await prisma.pkgxPriceMapping.findMany({
      where: { isActive: true },
    });
    
    console.log(`📊 Tìm thấy ${mappings.length} price mappings:\n`);
    
    mappings.forEach(m => {
      console.log(`  ${m.priceType}:`);
      console.log(`    pricingPolicyId: ${m.pricingPolicyId || 'NULL ❌'}`);
      console.log(`    description: ${m.description}`);
      console.log('');
    });
    
    // Check pricing policies
    const policies = await prisma.pricingPolicy.findMany({ where: { isActive: true } });
    console.log(`\n💰 Pricing Policies có sẵn (isActive=true): ${policies.length}`);
    policies.forEach(p => {
      console.log(`  - ${p.name} (${p.systemId})`);
    });

    // Verify mapping against policies
    console.log('\n🔗 Kiểm tra mapping valid:');
    const policyIds = new Set(policies.map(p => p.systemId));
    for (const m of mappings) {
      const isValid = m.pricingPolicyId && policyIds.has(m.pricingPolicyId);
      console.log(`  ${m.priceType} -> ${m.pricingPolicyId} : ${isValid ? '✅' : '❌ NOT FOUND'}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPriceMappings();
