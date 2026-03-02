import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  // 1. Kiểm tra PkgxPriceMapping
  console.log('=== PkgxPriceMapping ===');
  const mappings = await prisma.pkgxPriceMapping.findMany({
    where: { isActive: true },
  });
  
  mappings.forEach(m => {
    console.log(`priceType: "${m.priceType}" | pricingPolicyId: ${m.pricingPolicyId}`);
  });
  
  // 2. Test API để xem pkgxPrices có đúng format không
  console.log('\n=== Test PKGX API response ===');
  const res = await fetch('https://phukiengiaxuong.com.vn/admin/api_product_hrm.php?action=get_products&page=1&limit=1', {
    headers: { 'X-API-KEY': 'a91f2c47e5d8b6f03a7c4e9d12f0b8a6' }
  });
  const data = await res.json();
  const product = data.data[0];
  
  console.log('API Response keys for prices:');
  console.log('  shop_price:', product.shop_price);
  console.log('  market_price:', product.market_price);
  console.log('  partner_price:', product.partner_price);
  console.log('  ace_price:', product.ace_price);
  console.log('  deal_price:', product.deal_price);
  console.log('  goods_number:', product.goods_number);
  
  // 3. Simulate pkgxPrices object như frontend gửi
  console.log('\n=== Simulated pkgxPrices object ===');
  const pkgxPrices = {
    shop_price: Number(product.shop_price) || 0,
    market_price: Number(product.market_price) || 0,
    partner_price: Number(product.partner_price) || 0,
    ace_price: Number(product.ace_price) || 0,
    deal_price: Number(product.deal_price) || 0,
  };
  console.log(pkgxPrices);
  
  // 4. Check matching
  console.log('\n=== Mapping Check ===');
  for (const mapping of mappings) {
    const priceValue = pkgxPrices[mapping.priceType as keyof typeof pkgxPrices];
    console.log(`${mapping.priceType}: value=${priceValue}, hasPolicy=${!!mapping.pricingPolicyId}`);
  }
  
  await prisma.$disconnect();
}
main().catch(console.error);
