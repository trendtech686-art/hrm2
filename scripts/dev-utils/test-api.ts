import 'dotenv/config';

const API_URL = 'http://localhost:3000/api/products?limit=10';

async function testProductsAPI() {
  console.log('🔍 Testing Products API...');
  console.log('URL:', API_URL);
  console.log('');
  
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Cookie': 'authjs.session-token=your-session-token-here' // Session might be needed
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const text = await response.text();
      console.error('❌ API Error:', text);
      return;
    }
    
    const data = await response.json();
    console.log('\n✅ API Response:');
    console.log('Total items:', data.total);
    console.log('Page:', data.page, '/', data.totalPages);
    console.log('Items count:', data.items?.length || 0);
    
    if (data.items && data.items.length > 0) {
      console.log('\n📦 First 3 products:');
      data.items.slice(0, 3).forEach((p, i) => {
        console.log(`${i + 1}. ${p.id} - ${p.name} (Status: ${p.status}, PKGX: ${p.pkgxId || 'none'})`);
      });
    } else {
      console.log('\n⚠️  No products returned!');
    }
    
  } catch (error) {
    console.error('❌ Fetch error:', error.message);
  }
}

testProductsAPI();
