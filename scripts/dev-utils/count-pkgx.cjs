/**
 * Count & clear PKGX mapping data
 * Run: npx tsx scripts/dev-utils/count-pkgx.ts
 */
import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('\n📊 PKGX Data Count:');
  const [catMappings, brandMappings, priceMappings, categories, brands, products] = await Promise.all([
    prisma.pkgxCategoryMapping.count(),
    prisma.pkgxBrandMapping.count(),
    prisma.pkgxPriceMapping.count(),
    prisma.pkgxCategory.count(),
    prisma.pkgxBrand.count(),
    prisma.pkgxProductsCache.count(),
  ]);
  console.log('  CategoryMapping:', catMappings);
  console.log('  BrandMapping:', brandMappings);
  console.log('  PriceMapping:', priceMappings);
  console.log('  Category:', categories);
  console.log('  Brand:', brands);
  console.log('  ProductsCache:', products);

  // Delete all mappings first (FK constraints)
  console.log('\n🗑️  Xóa PKGX mappings...');
  const delCatMap = await prisma.pkgxCategoryMapping.deleteMany();
  const delBrandMap = await prisma.pkgxBrandMapping.deleteMany();
  const delPriceMap = await prisma.pkgxPriceMapping.deleteMany();
  console.log('  Deleted CategoryMappings:', delCatMap.count);
  console.log('  Deleted BrandMappings:', delBrandMap.count);
  console.log('  Deleted PriceMappings:', delPriceMap.count);

  // Delete base data
  console.log('\n🗑️  Xóa PKGX base data...');
  const delCat = await prisma.pkgxCategory.deleteMany();
  const delBrand = await prisma.pkgxBrand.deleteMany();
  const delProducts = await prisma.pkgxProductsCache.deleteMany();
  console.log('  Deleted Categories:', delCat.count);
  console.log('  Deleted Brands:', delBrand.count);
  console.log('  Deleted ProductsCache:', delProducts.count);

  console.log('\n✅ Done! Tất cả PKGX data đã được xóa.');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
