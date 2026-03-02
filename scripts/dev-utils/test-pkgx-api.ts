import 'dotenv/config';

async function testPKGXAPI() {
  try {
    const response = await fetch('https://phukiengiaxuong.com.vn/hrm/api_product_hrm.php?action=get_products&page=1&limit=2', {
      headers: {
        'X-API-KEY': 'a91f2c47e5d8b6f03a7c4e9d12f0b8a6'
      }
    });
    
    const data = await response.json();
    
    console.log('✅ PKGX API Response:');
    console.log('Total products:', data.total);
    
    if (data.products && data.products.length > 0) {
      const sample = data.products[0];
      console.log('\n📦 Sample Product Fields:');
      console.log(JSON.stringify(sample, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testPKGXAPI();
