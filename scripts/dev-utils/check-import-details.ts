import 'dotenv/config';
import { prisma } from './lib/prisma';

async function checkImportDetails() {
  try {
    console.log('🔍 Kiểm tra chi tiết import...\n');

    // 1. Check price mappings
    console.log('=== PRICE MAPPINGS ===');
    const priceMappings = await prisma.pkgxPriceMapping.findMany({
      where: { isActive: true },
    });
    
    if (priceMappings.length === 0) {
      console.log('❌ KHÔNG CÓ price mapping nào!');
    } else {
      for (const m of priceMappings) {
        const policy = m.pricingPolicyId 
          ? await prisma.pricingPolicy.findUnique({ where: { systemId: m.pricingPolicyId } })
          : null;
        console.log(`  ${m.priceType} => ${policy?.name || m.pricingPolicyId || 'N/A'}`);
      }
    }

    // 2. Check ProductPrice records
    console.log('\n=== PRODUCT PRICES ===');
    const productPrices = await prisma.productPrice.findMany({
      take: 20,
      include: {
        product: { select: { name: true, pkgxId: true } },
        pricingPolicy: { select: { name: true } },
      },
    });
    
    if (productPrices.length === 0) {
      console.log('❌ KHÔNG CÓ product price nào trong DB!');
    } else {
      console.log(`Có ${productPrices.length} product prices:`);
      productPrices.forEach(pp => {
        console.log(`  ${pp.product.name}: ${pp.pricingPolicy?.name} = ${pp.price}`);
      });
    }

    // 3. Check sample product with all flags and images
    console.log('\n=== SAMPLE PRODUCT DETAILS ===');
    const sample = await prisma.product.findFirst({
      where: { pkgxId: { not: null }, isDeleted: false },
      include: {
        prices: { include: { pricingPolicy: true } },
      },
    });
    
    if (sample) {
      console.log(`Name: ${sample.name}`);
      console.log(`pkgxId: ${sample.pkgxId}`);
      console.log(`\nFLAGS:`);
      console.log(`  isBestSeller: ${sample.isBestSeller}`);
      console.log(`  isNewArrival: ${sample.isNewArrival}`);
      console.log(`  isFeatured: ${sample.isFeatured}`);
      console.log(`  isOnSale: ${sample.isOnSale}`);
      console.log(`  isPublished: ${sample.isPublished}`);
      
      console.log(`\nIMAGES:`);
      console.log(`  imageUrl: ${sample.imageUrl || 'NULL'}`);
      console.log(`  thumbnailImage: ${sample.thumbnailImage || 'NULL'}`);
      console.log(`  galleryImages: ${JSON.stringify(sample.galleryImages)}`);
      
      console.log(`\nPRICES (${sample.prices.length} records):`);
      if (sample.prices.length === 0) {
        console.log('  ❌ Không có price records!');
      } else {
        sample.prices.forEach(p => {
          console.log(`  ${p.pricingPolicy?.name}: ${p.price}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImportDetails();
