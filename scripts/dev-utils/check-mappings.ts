import 'dotenv/config';
import { prisma } from './lib/prisma';

async function checkMappings() {
  try {
    console.log('🔍 Checking PKGX mappings...\n');
    
    // Check brand mappings
    const brandMappings = await prisma.pkgxBrandMapping.findMany({});
    
    console.log('🏷️ Brand Mappings:', brandMappings.length);
    brandMappings.forEach(m => {
      console.log(`  - PKGX Brand ${m.pkgxBrandId} (${m.pkgxBrandName}) => HRM: ${m.hrmBrandName} (${m.hrmBrandId})`);
    });
    
    // Check category mappings
    const categoryMappings = await prisma.pkgxCategoryMapping.findMany({});
    
    console.log('\n📂 Category Mappings:', categoryMappings.length);
    categoryMappings.forEach(m => {
      console.log(`  - PKGX Cat ${m.pkgxCategoryId} (${m.pkgxCategoryName}) => HRM: ${m.hrmCategoryName} (${m.hrmCategoryId})`);
    });
    
    // Check products with PKGX data
    const products = await prisma.product.findMany({
      where: {
        pkgxId: { not: null },
        isDeleted: false,
      },
      select: {
        systemId: true,
        name: true,
        pkgxId: true,
        brandId: true,
        categorySystemIds: true,
        brand: {
          select: { name: true },
        },
      },
      take: 5,
    });
    
    console.log('\n📦 Sample PKGX Products:');
    products.forEach(p => {
      console.log(`\n  Product: ${p.name}`);
      console.log(`    PKGX ID: ${p.pkgxId}`);
      console.log(`    Brand: ${p.brand?.name || 'NULL'} (${p.brandId || 'NULL'})`);
      console.log(`    Categories: ${p.categorySystemIds?.length || 0} items - ${JSON.stringify(p.categorySystemIds)}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMappings();
