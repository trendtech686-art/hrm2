import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('=== DEBUG FORM DATA ===\n');

  // 1. Check pricing policies (what form expects)
  const policies = await prisma.pricingPolicy.findMany({
    where: { type: 'Bán hàng' },
    orderBy: { name: 'asc' },
  });
  console.log('1. Pricing Policies (form expects these IDs):');
  policies.forEach(p => {
    console.log(`   - ${p.systemId} → ${p.name} (default: ${p.isDefault})`);
  });

  // 2. Check price mappings (what import uses)
  const mappings = await prisma.pkgxPriceMapping.findMany({ where: { isActive: true } });
  console.log('\n2. PKGX Price Mappings (import uses these):');
  mappings.forEach(m => {
    const policyMatch = policies.find(p => p.systemId === m.pricingPolicyId);
    console.log(`   - ${m.priceType} → ${m.pricingPolicyId} ${policyMatch ? '✅ MATCHES: ' + policyMatch.name : '❌ NOT FOUND'}`);
  });

  // 3. Check sample product prices
  const prod = await prisma.product.findFirst({
    where: { pkgxId: { not: null } },
    include: { 
      prices: { include: { pricingPolicy: true } },
      brand: true,
      productCategories: { include: { category: true } },
    },
  });

  if (prod) {
    console.log('\n3. Sample Product:');
    console.log(`   - ID: ${prod.id}, Name: ${prod.name}`);
    console.log(`   - brandId (in DB): ${prod.brandId}`);
    console.log(`   - brand.name: ${prod.brand?.name || 'N/A'}`);
    console.log(`   - categorySystemIds: ${JSON.stringify(prod.categorySystemIds)}`);
    console.log(`   - productCategories: ${prod.productCategories.map(pc => pc.categoryId).join(', ')}`);
    console.log(`   - productTypeSystemId: ${prod.productTypeSystemId}`);
    console.log(`   - id: ${prod.id}`);
    
    console.log('\n4. Product Prices in DB:');
    if (prod.prices.length === 0) {
      console.log('   ❌ No prices found!');
    } else {
      prod.prices.forEach(p => {
        const policyMatch = policies.find(pol => pol.systemId === p.pricingPolicyId);
        console.log(`   - ${p.pricingPolicyId} = ${p.price} ${policyMatch ? '✅ ' + policyMatch.name : '❌ Policy not found'}`);
      });
    }
  }

  // 5. Check product types
  const productTypes = await prisma.settingsData.findMany({
    where: { type: 'product-type', isDeleted: false },
  });
  console.log('\n5. Product Types in DB:');
  productTypes.forEach(pt => {
    console.log(`   - ${pt.systemId} → ${pt.name} (active: ${pt.isActive}, default: ${pt.isDefault})`);
  });

  // 6. Check brands
  const brands = await prisma.brand.findMany({ take: 5 });
  console.log('\n6. Sample Brands:');
  brands.forEach(b => {
    console.log(`   - ${b.systemId} → ${b.name}`);
  });

  // 7. Check categories  
  const cats = await prisma.category.findMany({ take: 5 });
  console.log('\n7. Sample Categories:');
  cats.forEach(c => {
    console.log(`   - ${c.systemId} → ${c.name}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
