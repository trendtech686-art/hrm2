import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  // Product 8040 = Cáp sạc C to C Hoco X96 100w
  const product = await prisma.product.findFirst({
    where: { pkgxId: 8040 },
    include: {
      prices: {
        include: { pricingPolicy: true }
      },
      productInventory: {
        include: { branch: true }
      }
    }
  });
  
  if (!product) {
    console.log('Product 8040 not found');
    return;
  }
  
  console.log('=== Product 8040 ===');
  console.log('Name:', product.name);
  console.log('systemId:', product.systemId);
  console.log('pkgxId:', product.pkgxId);
  
  console.log('\n=== Prices ===');
  if (product.prices.length === 0) {
    console.log('NO PRICES FOUND!');
  } else {
    product.prices.forEach(p => {
      console.log(`  ${p.pricingPolicy?.name || p.pricingPolicyId}: ${p.price}`);
    });
  }
  
  console.log('\n=== Inventory ===');
  if (product.productInventory.length === 0) {
    console.log('NO INVENTORY FOUND!');
  } else {
    product.productInventory.forEach(inv => {
      console.log(`  ${inv.branch?.name}: onHand=${inv.onHand}, committed=${inv.committed}`);
    });
  }
  
  // Check PkgxPriceMapping
  console.log('\n=== PkgxPriceMapping ===');
  const mappings = await prisma.pkgxPriceMapping.findMany({
    where: { isActive: true },
  });
  for (const m of mappings) {
    const policy = await prisma.pricingPolicy.findUnique({ where: { systemId: m.pricingPolicyId || '' } });
    console.log(`  ${m.priceType} => ${policy?.name || 'NO POLICY'} (policyId: ${m.pricingPolicyId})`);
  }
  
  // Check PKGX API for this product
  console.log('\n=== PKGX API Check ===');
  const API_KEY = 'a91f2c47e5d8b6f03a7c4e9d12f0b8a6';
  const response = await fetch(`https://phukiengiaxuong.com.vn/admin/api_product_hrm.php?action=get_products&goods_id=8040`, {
    headers: { 'X-API-KEY': API_KEY }
  });
  const data = await response.json();
  if (data.data && data.data[0]) {
    const p = data.data[0];
    console.log('  goods_number:', p.goods_number);
    console.log('  shop_price:', p.shop_price);
    console.log('  market_price:', p.market_price);
    console.log('  ace_price:', p.ace_price);
  }
  
  await prisma.$disconnect();
}

main();
