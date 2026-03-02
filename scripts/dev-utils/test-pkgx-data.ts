import 'dotenv/config';
import { getAllProducts } from './lib/pkgx/api-service';
import { PKGX_API_CONFIG } from './features/settings/pkgx/constants';

async function main() {
  console.log('⏳ Fetching 1 product from PKGX API...');
  
  const pkgxSettings = {
    apiUrl: PKGX_API_CONFIG.baseUrl,
    apiKey: PKGX_API_CONFIG.defaultApiKey,
    enabled: true,
  };
  
  // Fetch just 1 product to see structure
  const response = await fetch(`${pkgxSettings.apiUrl}?action=get_products&page=1&limit=2`, {
    method: 'GET',
    headers: {
      'X-API-KEY': pkgxSettings.apiKey,
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  
  if (data.error) {
    console.error('❌ Error:', data.message);
    return;
  }
  
  console.log('\n📊 PKGX Product Sample:');
  const product = data.data[0];
  
  // Show price fields
  console.log('\n💰 Price Fields:');
  console.log(`  shop_price: ${product.shop_price}`);
  console.log(`  market_price: ${product.market_price}`);
  console.log(`  partner_price: ${product.partner_price}`);
  console.log(`  ace_price: ${product.ace_price}`);
  console.log(`  deal_price: ${product.deal_price}`);
  
  // Show inventory fields
  console.log('\n📦 Inventory Fields:');
  console.log(`  goods_number: ${product.goods_number}`);
  console.log(`  warn_number: ${product.warn_number}`);
  
  // Show flags
  console.log('\n🏳️ Flags:');
  console.log(`  is_best: ${product.is_best} (type: ${typeof product.is_best})`);
  console.log(`  is_new: ${product.is_new} (type: ${typeof product.is_new})`);
  console.log(`  is_hot: ${product.is_hot} (type: ${typeof product.is_hot})`);
  console.log(`  is_home: ${product.is_home} (type: ${typeof product.is_home})`);
  console.log(`  is_on_sale: ${product.is_on_sale} (type: ${typeof product.is_on_sale})`);
  
  // Full dump
  console.log('\n📝 Full product data:');
  console.log(JSON.stringify(product, null, 2));
}

main().catch(console.error);
