import 'dotenv/config';
import { prisma } from './lib/prisma';

async function summaryAfterImport() {
  try {
    console.log('\n📊 SUMMARY AFTER IMPORT\n');
    console.log('='.repeat(60));
    
    // 1. Count products
    const total = await prisma.product.count({ where: { isDeleted: false } });
    const pkgx = await prisma.product.count({ where: { pkgxId: { not: null }, isDeleted: false } });
    console.log(`\n1️⃣ Số lượng sản phẩm:`);
    console.log(`   Total: ${total}`);
    console.log(`   PKGX: ${pkgx}`);
    
    // 2. Sample product với brand & category
    const sample = await prisma.product.findFirst({
      where: { pkgxId: { not: null }, isDeleted: false },
      include: {
        brand: true,
        productCategories: {
          include: { category: true },
        },
        prices: {
          include: { pricingPolicy: true },
        },
      },
    });
    
    if (sample) {
      console.log(`\n2️⃣ Sản phẩm mẫu: ${sample.name}`);
      console.log(`   SKU: ${sample.sku}`);
      console.log(`   Unit: "${sample.unit}"`);
      console.log(`   Status: ${sample.status}`);
      console.log(`   Brand: ${sample.brand?.name || '❌ NULL'}`);
      console.log(`   Categories: ${sample.productCategories.length} items`);
      sample.productCategories.forEach(pc => {
        console.log(`     - ${pc.category.name}`);
      });
      console.log(`   Weight: ${sample.weight} ${sample.weightUnit}`);
      console.log(`   isPublished: ${sample.isPublished}`);
      console.log(`   isFeatured: ${sample.isFeatured}`);
      console.log(`   isOnSale: ${sample.isOnSale}`);
      console.log(`   Prices: ${sample.prices.length} items`);
      sample.prices.forEach(p => {
        console.log(`     - ${p.pricingPolicy.name}: ${p.price}`);
      });
      console.log(`   Images:`);
      console.log(`     - Thumbnail: ${sample.thumbnailImage ? '✅' : '❌'}`);
      console.log(`     - Gallery: ${sample.galleryImages?.length || 0} items`);
      console.log(`   Dates:`);
      console.log(`     - launchedDate: ${sample.launchedDate || '❌ NULL'}`);
      console.log(`     - publishedAt: ${sample.publishedAt || '❌ NULL'}`);
    }
    
    // 3. Count products with brand
    const withBrand = await prisma.product.count({
      where: { pkgxId: { not: null }, brandId: { not: null }, isDeleted: false },
    });
    console.log(`\n3️⃣ Sản phẩm có Brand: ${withBrand}/${pkgx} (${Math.round(withBrand/pkgx*100)}%)`);
    
    // 4. Count products with categories
    const withCategories = await prisma.productCategory.groupBy({
      by: ['productId'],
      _count: true,
    });
    console.log(`4️⃣ Sản phẩm có Category: ${withCategories.length}/${pkgx} (${Math.round(withCategories.length/pkgx*100)}%)`);
    
    // 5. Count prices
    const priceCount = await prisma.productPrice.count();
    console.log(`5️⃣ Tổng số ProductPrice records: ${priceCount}`);
    console.log(`   Trung bình: ${Math.round(priceCount/pkgx)} prices/product`);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ DONE!\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

summaryAfterImport();
