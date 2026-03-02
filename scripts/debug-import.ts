import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('=== DEBUG IMPORT ===\n');

  // 1. Check price mappings
  const priceMappings = await prisma.pkgxPriceMapping.findMany({
    where: { isActive: true },
  });
  console.log('1. Price Mappings:');
  priceMappings.forEach(m => {
    console.log(`   - ${m.priceType} → policyId: ${m.pricingPolicyId}`);
  });

  // 2. Check a sample product with pkgxId
  const prod = await prisma.product.findFirst({
    where: { pkgxId: { not: null } },
    include: { 
      prices: true,
      brand: true,
      productCategories: { include: { category: true } },
    },
  });

  if (!prod) {
    console.log('\n❌ No products with pkgxId found!');
    return;
  }

  console.log('\n2. Sample Product:');
  console.log(`   - ID: ${prod.id}`);
  console.log(`   - Name: ${prod.name}`);
  console.log(`   - pkgxId: ${prod.pkgxId}`);
  console.log(`   - brandId: ${prod.brandId}`);
  console.log(`   - Brand Name: ${prod.brand?.name || 'N/A'}`);
  console.log(`   - categorySystemIds: ${JSON.stringify(prod.categorySystemIds)}`);
  console.log(`   - Categories: ${prod.productCategories.map(pc => pc.category.name).join(', ') || 'N/A'}`);
  console.log(`   - productTypeSystemId: ${prod.productTypeSystemId}`);
  console.log(`   - thumbnailImage: ${prod.thumbnailImage}`);
  console.log(`   - galleryImages: ${JSON.stringify(prod.galleryImages)}`);
  console.log(`   - isPublished: ${prod.isPublished}`);
  console.log(`   - isFeatured: ${prod.isFeatured}`);
  console.log(`   - isBestSeller: ${prod.isBestSeller}`);
  console.log(`   - isNewArrival: ${prod.isNewArrival}`);
  console.log(`   - isOnSale: ${prod.isOnSale}`);

  console.log('\n3. Product Prices:');
  if (prod.prices.length === 0) {
    console.log('   ❌ No prices found!');
  } else {
    prod.prices.forEach(p => {
      console.log(`   - policyId: ${p.pricingPolicyId}, price: ${p.price}`);
    });
  }

  // 3. Check brand mappings
  const brandMappings = await prisma.pkgxBrandMapping.findMany({
    where: { isActive: true },
  });
  console.log('\n4. Brand Mappings:');
  brandMappings.forEach(m => {
    console.log(`   - pkgxBrandId: ${m.pkgxBrandId} (${m.pkgxBrandName}) → hrmBrandId: ${m.hrmBrandId} (${m.hrmBrandName})`);
  });

  // 4. Check category mappings
  const categoryMappings = await prisma.pkgxCategoryMapping.findMany({
    where: { isActive: true },
  });
  console.log('\n5. Category Mappings:');
  categoryMappings.slice(0, 5).forEach(m => {
    console.log(`   - pkgxCatId: ${m.pkgxCategoryId} (${m.pkgxCategoryName}) → hrmCatId: ${m.hrmCategoryId} (${m.hrmCategoryName})`);
  });
  if (categoryMappings.length > 5) {
    console.log(`   ... and ${categoryMappings.length - 5} more`);
  }

  // 5. Check default product type
  const defaultProductType = await prisma.settingsData.findFirst({
    where: { type: 'product-type', isActive: true, isDeleted: false, isDefault: true },
  });
  const fallbackProductType = await prisma.settingsData.findFirst({
    where: { type: 'product-type', isActive: true, isDeleted: false },
    orderBy: { name: 'asc' },
  });
  console.log('\n6. Product Types:');
  console.log(`   - Default: ${defaultProductType?.name || 'None'} (${defaultProductType?.systemId})`);
  console.log(`   - Fallback: ${fallbackProductType?.name || 'None'} (${fallbackProductType?.systemId})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
