import 'dotenv/config';
import { prisma } from './lib/prisma';

async function checkImportStatus() {
  try {
    console.log('🔍 Kiểm tra trạng thái import...\n');
    
    // Count products
    const totalProducts = await prisma.product.count({
      where: { isDeleted: false },
    });
    
    const pkgxProducts = await prisma.product.count({
      where: {
        pkgxId: { not: null },
        isDeleted: false,
      },
    });
    
    console.log(`📦 Tổng số sản phẩm: ${totalProducts}`);
    console.log(`🔗 Sản phẩm PKGX: ${pkgxProducts}\n`);
    
    // Get sample PKGX products
    const samples = await prisma.product.findMany({
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
      take: 5,
    });
    
    console.log('📋 Mẫu sản phẩm:\n');
    samples.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   SKU: ${p.sku}`);
      console.log(`   Unit: ${p.unit}`);
      console.log(`   Status: ${p.status}`);
      console.log(`   Brand: ${p.brand?.name || 'NULL'}`);
      console.log(`   Categories: ${p.productCategories.length > 0 ? p.productCategories.map(pc => pc.category.name).join(', ') : 'NULL'}`);
      console.log(`   Weight: ${p.weight} ${p.weightUnit}`);
      console.log(`   LaunchedDate: ${p.launchedDate || 'NULL'}`);
      console.log(`   PublishedAt: ${p.publishedAt || 'NULL'}`);
      console.log(`   isPublished: ${p.isPublished}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImportStatus();
