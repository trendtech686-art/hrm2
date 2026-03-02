import 'dotenv/config';
import { prisma } from './lib/prisma';

async function checkMappingFields() {
  try {
    console.log('🔍 Kiểm tra fields trong mapping...\n');
    
    const brandMapping = await prisma.pkgxBrandMapping.findFirst();
    const categoryMapping = await prisma.pkgxCategoryMapping.findFirst();
    
    console.log('🏷️ Brand Mapping fields:');
    console.log(JSON.stringify(brandMapping, null, 2));
    
    console.log('\n📂 Category Mapping fields:');
    console.log(JSON.stringify(categoryMapping, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMappingFields();
