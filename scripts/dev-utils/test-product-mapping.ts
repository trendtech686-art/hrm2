import 'dotenv/config';
import { prisma } from './lib/prisma';

async function testProductWithBrand() {
  try {
    console.log('🔍 Kiểm tra sản phẩm có brand từ mapping...\n');
    
    // Get a PKGX product with brand_id = 15 (Hoco)
    const pkgxProduct = await prisma.product.findFirst({
      where: {
        pkgxId: { not: null },
        isDeleted: false,
      },
      include: {
        brand: true,
        productCategories: {
          include: {
            category: true,
          },
        },
      },
    });
    
    if (!pkgxProduct) {
      console.log('❌ Không tìm thấy sản phẩm PKGX');
      return;
    }
    
    console.log('📦 Sản phẩm:', pkgxProduct.name);
    console.log('🆔 PKGX ID:', pkgxProduct.pkgxId);
    console.log('🏷️ Brand:', pkgxProduct.brand?.name || 'NULL');
    console.log('📂 Categories:', pkgxProduct.productCategories.length);
    pkgxProduct.productCategories.forEach(pc => {
      console.log(`   - ${pc.category.name}`);
    });
    console.log('⚖️ Weight:', pkgxProduct.weight, pkgxProduct.weightUnit);
    console.log('📏 Unit:', pkgxProduct.unit);
    console.log('🎯 Status:', pkgxProduct.status);
    console.log('🌐 isPublished:', pkgxProduct.isPublished);
    console.log('📅 launchedDate:', pkgxProduct.launchedDate);
    console.log('📅 publishedAt:', pkgxProduct.publishedAt);
    
    // Check mappings
    const brandMapping = await prisma.pkgxBrandMapping.findFirst({
      where: { pkgxBrandId: 15 }, // Hoco
    });
    
    const categoryMapping = await prisma.pkgxCategoryMapping.findFirst({
      where: { pkgxCategoryId: 42 }, // Dây cáp sạc
    });
    
    console.log('\n📋 Mappings available:');
    console.log('  Brand Hoco (15):', brandMapping ? `✅ ${brandMapping.hrmBrandName}` : '❌ No mapping');
    console.log('  Category 42:', categoryMapping ? `✅ ${categoryMapping.hrmCategoryName}` : '❌ No mapping');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProductWithBrand();
