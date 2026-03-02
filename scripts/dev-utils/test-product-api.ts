import 'dotenv/config';
import { prisma } from './lib/prisma';

async function testProductAPI() {
  try {
    console.log('🔍 Fetching product with systemId...');
    
    // Get first product
    const product = await prisma.product.findFirst({
      where: { isDeleted: false },
      include: {
        brand: true,
        productCategories: {
          include: {
            category: true,
          },
        },
        productInventory: true,
        prices: {
          include: {
            pricingPolicy: true,
          },
        },
      },
    });
    
    if (!product) {
      console.log('❌ No products found');
      return;
    }
    
    console.log('\n✅ Product found:', product.systemId);
    console.log('📦 Name:', product.name);
    console.log('🏷️ SKU:', product.sku);
    console.log('💰 Selling Price:', product.sellingPrice);
    console.log('⚖️ Weight:', product.weight, product.weightUnit);
    console.log('📏 Unit:', product.unit);
    console.log('🏢 Brand:', product.brand?.name || 'N/A');
    console.log('📂 Categories:', product.categorySystemIds);
    console.log('🌐 isPublished:', product.isPublished);
    console.log('⭐ isFeatured:', product.isFeatured);
    console.log('🆕 isNewArrival:', product.isNewArrival);
    console.log('🔥 isBestSeller:', product.isBestSeller);
    console.log('💸 isOnSale:', product.isOnSale);
    console.log('📅 launchedDate:', product.launchedDate);
    console.log('📅 publishedAt:', product.publishedAt);
    console.log('🔍 SEO PKGX:', JSON.stringify(product.seoPkgx, null, 2));
    console.log('🖼️ Images:', {
      thumbnailImage: product.thumbnailImage,
      imageUrl: product.imageUrl,
      galleryImages: product.galleryImages,
    });
    
    console.log('\n📊 Product Categories:');
    product.productCategories?.forEach(pc => {
      console.log(`  - ${pc.category.name} (${pc.categorySystemId})`);
    });
    
    console.log('\n💵 Prices:');
    product.prices?.forEach(price => {
      console.log(`  - ${price.pricingPolicy?.name || 'Default'}: ${price.price}`);
    });
    
    console.log('\n📦 Inventory:');
    product.productInventory?.forEach(inv => {
      console.log(`  - Branch ${inv.branchSystemId}: ${inv.onHand} units`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProductAPI();
