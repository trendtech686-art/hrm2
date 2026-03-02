import 'dotenv/config';
import { PKGX_API_CONFIG } from './features/settings/pkgx/constants';

async function main() {
  console.log('⏳ Fetching products from PKGX API to check ace_price...');
  
  // Fetch 20 products to check ace_price
  const response = await fetch(`${PKGX_API_CONFIG.baseUrl}?action=get_products&page=1&limit=20`, {
    method: 'GET',
    headers: {
      'X-API-KEY': PKGX_API_CONFIG.defaultApiKey,
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  
  if (data.error) {
    console.error('❌ Error:', data.message);
    return;
  }
  
  console.log('\n📊 Products with ace_price > 0:');
  let foundAce = 0;
  
  for (const product of data.data) {
    const acePrice = Number(product.ace_price) || 0;
    if (acePrice > 0) {
      foundAce++;
      console.log(`  ${product.goods_name}:`);
      console.log(`    shop_price: ${product.shop_price}`);
      console.log(`    partner_price: ${product.partner_price}`);
      console.log(`    ace_price: ${product.ace_price}`);
      console.log(`    deal_price: ${product.deal_price}`);
      console.log('');
    }
  }
  
  if (foundAce === 0) {
    console.log('  (Không có sản phẩm nào có ace_price > 0 trong 20 sản phẩm đầu)');
    console.log('\n📋 Tất cả các giá của sản phẩm đầu tiên:');
    const p = data.data[0];
    console.log(`  ${p.goods_name}:`);
    console.log(`    shop_price: ${p.shop_price} (Giá bán)`);
    console.log(`    market_price: ${p.market_price} (Giá thị trường)`);
    console.log(`    partner_price: ${p.partner_price} (Giá đối tác)`);
    console.log(`    ace_price: ${p.ace_price} (Giá ACE)`);
    console.log(`    deal_price: ${p.deal_price} (Giá deal)`);
  } else {
    console.log(`\n✅ Tìm thấy ${foundAce} sản phẩm có ace_price > 0`);
  }
}

main().catch(console.error);
