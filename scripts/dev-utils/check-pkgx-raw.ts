import 'dotenv/config';

// Lấy PKGX settings từ API
async function checkPkgxData() {
  try {
    // Fetch settings from API
    const settingsRes = await fetch('http://localhost:3000/api/settings/pkgx');
    if (!settingsRes.ok) {
      console.log('❌ Không thể lấy settings');
      return;
    }
    const settingsData = await settingsRes.json();
    const settings = settingsData.data;
    
    if (!settings?.apiUrl || !settings?.apiKey) {
      console.log('❌ Chưa cấu hình PKGX API');
      console.log('Settings:', settings);
      return;
    }
    
    console.log('=== PKGX API Settings ===');
    console.log('URL:', settings.apiUrl);
    
    // Fetch 1 product from PKGX
    const url = `${settings.apiUrl}?action=get_products&page=1&limit=1`;
    const response = await fetch(url, {
      headers: {
        'X-API-KEY': settings.apiKey,
      },
    });
    
    if (!response.ok) {
      console.log('❌ API Error:', response.status);
      return;
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.log('❌ API Error:', data.message);
      return;
    }
    
    const product = data.data?.[0];
    if (!product) {
      console.log('❌ Không có sản phẩm');
      return;
    }
    
    console.log('\n=== PKGX Product Raw Data ===');
    console.log('goods_id:', product.goods_id, typeof product.goods_id);
    console.log('goods_name:', product.goods_name);
    console.log('goods_sn:', product.goods_sn);
    
    console.log('\n=== FLAGS (raw values) ===');
    console.log('is_best:', product.is_best, '| type:', typeof product.is_best);
    console.log('is_new:', product.is_new, '| type:', typeof product.is_new);
    console.log('is_hot:', product.is_hot, '| type:', typeof product.is_hot);
    console.log('is_home:', product.is_home, '| type:', typeof product.is_home);
    console.log('is_on_sale:', product.is_on_sale, '| type:', typeof product.is_on_sale);
    
    console.log('\n=== PRICES (raw values) ===');
    console.log('shop_price:', product.shop_price, '| type:', typeof product.shop_price);
    console.log('market_price:', product.market_price, '| type:', typeof product.market_price);
    console.log('partner_price:', product.partner_price, '| type:', typeof product.partner_price);
    console.log('ace_price:', product.ace_price, '| type:', typeof product.ace_price);
    console.log('deal_price:', product.deal_price, '| type:', typeof product.deal_price);
    
    console.log('\n=== IMAGES (raw values) ===');
    console.log('goods_img:', product.goods_img?.substring(0, 100) || 'NULL');
    console.log('goods_thumb:', product.goods_thumb?.substring(0, 100) || 'NULL');
    console.log('original_img:', product.original_img?.substring(0, 100) || 'NULL');
    
    console.log('\n=== FLAG COMPARISON TEST ===');
    console.log('is_best === 1:', product.is_best === 1);
    console.log('is_best === "1":', product.is_best === '1');
    console.log('Number(is_best) === 1:', Number(product.is_best) === 1);
    console.log('Boolean(is_best):', Boolean(product.is_best));
    console.log('!!is_best:', !!product.is_best);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkPkgxData();
