import 'dotenv/config';
import { prisma } from './lib/prisma';

async function checkImportDetail() {
  try {
    console.log('🔍 Kiểm tra chi tiết import...\n');
    
    // Get 1 sample product with all relations
    const product = await prisma.product.findFirst({
      where: {
        pkgxId: { not: null },
        isDeleted: false,
      },
      include: {
        brand: true,
        prices: {
          include: {
            pricingPolicy: true,
          },
        },
        productCategories: {
          include: {
            category: true,
          },
        },
      },
    });
    
    if (!product) {
      console.log('❌ Không tìm thấy sản phẩm PKGX');
      return;
    }
    
    console.log('=== THÔNG TIN SẢN PHẨM ===');
    console.log('ID:', product.id);
    console.log('Name:', product.name);
    console.log('pkgxId:', product.pkgxId);
    console.log('pkgxSku:', product.pkgxSku);
    
    console.log('\n=== FLAGS ===');
    console.log('isBestSeller:', product.isBestSeller);
    console.log('isOnSale:', product.isOnSale);
    console.log('isNewArrival:', product.isNewArrival);
    console.log('isFeatured:', product.isFeatured);
    console.log('isPublished:', product.isPublished);
    
    console.log('\n=== HÌNH ẢNH ===');
    console.log('imageUrl:', product.imageUrl?.substring(0, 100) || 'NULL');
    console.log('thumbnailImage:', product.thumbnailImage?.substring(0, 100) || 'NULL');
    console.log('galleryImages:', product.galleryImages?.length || 0, 'items');
    if (product.galleryImages && product.galleryImages.length > 0) {
      console.log('  First gallery:', product.galleryImages[0]?.substring(0, 100));
    }
    
    console.log('\n=== GIÁ (ProductPrice) ===');
    console.log('Số lượng prices:', product.prices.length);
    product.prices.forEach(p => {
      console.log(`  ${p.pricingPolicy?.name}: ${Number(p.price).toLocaleString()} VND`);
    });
    
    console.log('\n=== PRICE MAPPINGS (Settings) ===');
    const priceMappings = await prisma.pkgxPriceMapping.findMany({
      where: { isActive: true },
    });
    console.log('Active mappings:', priceMappings.length);
    priceMappings.forEach(m => {
      console.log(`  ${m.priceType} => ${m.pricingPolicyId}`);
    });
    
    console.log('\n=== GIÁ TRỰC TIẾP (costPrice, sellingPrice) ===');
    console.log('costPrice:', product.costPrice?.toString() || 'NULL');
    console.log('sellingPrice:', product.sellingPrice?.toString() || 'NULL');
    console.log('minPrice:', product.minPrice?.toString() || 'NULL');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImportDetail();
