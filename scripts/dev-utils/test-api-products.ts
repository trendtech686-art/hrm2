import 'dotenv/config';

interface ProductSummary {
  id: string;
  name: string;
  pkgxId?: number | null;
}

async function testAPI() {
  try {
    console.log('🔍 Testing API endpoint...\n');
    
    const response = await fetch('http://localhost:3000/api/products', {
      headers: {
        'Cookie': 'next-auth.session-token=test' // Try with cookie
      }
    });
    
    console.log('Status:', response.status, response.statusText);
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API Response:', {
        success: true,
        totalProducts: data.data?.length || 0,
        hasPagination: !!data.pagination
      });
      
      if (data.data && data.data.length > 0) {
        console.log('\n📦 Sample products:');
        console.log(data.data.slice(0, 3).map((p: ProductSummary) => ({
          id: p.id,
          name: p.name,
          pkgxId: p.pkgxId
        })));
      }
    } else {
      console.log('❌ Error:', data);
    }
    
  } catch (error) {
    console.error('❌ Fetch error:', error instanceof Error ? error.message : error);
  }
}

testAPI();
