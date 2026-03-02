/**
 * Script để debug product prices issue
 * Kiểm tra xem API trả về prices đúng không
 */
import { prisma } from './lib/prisma';

async function main() {
  console.log('='.repeat(60));
  console.log('🔍 DEBUG: Product Prices Issue');
  console.log('='.repeat(60));
  
  // 1. Lấy 1 product có pkgxId
  const product = await prisma.product.findFirst({
    where: { pkgxId: { not: null } },
    include: {
      prices: {
        include: {
          pricingPolicy: true,
        },
      },
    },
  });
  
  if (!product) {
    console.log('❌ Không tìm thấy product có pkgxId');
    return;
  }
  
  console.log('\n📦 Product:', {
    systemId: product.systemId,
    id: product.id,
    name: product.name,
    pkgxId: product.pkgxId,
  });
  
  // 2. Kiểm tra raw prices từ DB
  console.log('\n💰 Raw Prices (from DB):');
  if (product.prices.length === 0) {
    console.log('   ⚠️ Không có prices nào trong ProductPrice table!');
  } else {
    product.prices.forEach(p => {
      console.log(`   - ${p.pricingPolicy?.name || p.pricingPolicyId}: ${p.price}`);
    });
  }
  
  // 3. Transform giống API
  const pricesRecord: Record<string, number> = {};
  for (const pp of product.prices) {
    if (pp.pricingPolicyId && pp.price != null) {
      pricesRecord[pp.pricingPolicyId] = Number(pp.price);
    }
  }
  
  console.log('\n🔄 Transformed prices (như API trả về):');
  console.log(pricesRecord);
  
  // 4. Kiểm tra price mappings
  console.log('\n📋 PKGX Price Mappings:');
  const mappings = await prisma.pkgxPriceMapping.findMany({
    where: { isActive: true },
  });
  
  if (mappings.length === 0) {
    console.log('   ⚠️ Không có price mappings nào!');
  } else {
    mappings.forEach(m => {
      const price = pricesRecord[m.pricingPolicyId || ''];
      console.log(`   - ${m.priceType} => ${m.pricingPolicyId} => ${price ?? 'N/A'}`);
    });
  }
  
  // 5. Kiểm tra xem có product nào có prices không
  console.log('\n📊 Thống kê ProductPrice table:');
  const priceCount = await prisma.productPrice.count();
  const productWithPricesCount = await prisma.productPrice.groupBy({
    by: ['productId'],
    _count: true,
  });
  
  console.log(`   - Tổng số ProductPrice records: ${priceCount}`);
  console.log(`   - Số products có prices: ${productWithPricesCount.length}`);
  
  // 6. Lấy sample products khác xem có prices không
  console.log('\n🔎 Sample 5 products với prices:');
  const sampleProducts = await prisma.product.findMany({
    take: 5,
    include: {
      prices: true,
    },
  });
  
  sampleProducts.forEach(p => {
    console.log(`   - ${p.name.substring(0, 40)}... : ${p.prices.length} prices`);
  });
  
  console.log('\n' + '='.repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
