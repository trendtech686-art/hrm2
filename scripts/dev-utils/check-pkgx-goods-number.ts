import 'dotenv/config';

async function main() {
  const response = await fetch('https://phukiengiaxuong.com.vn/admin/api_product_hrm.php?action=get_products&page=1&page_size=1', {
    headers: { 'X-API-KEY': 'a91f2c47e5d8b6f03a7c4e9d12f0b8a6' },
  });
  const data = await response.json();
  console.log('Raw response:', JSON.stringify(data, null, 2).slice(0, 1000));
  
  if (!data.data || !data.data[0]) {
    console.log('No products found');
    return;
  }
  const product = data.data[0];
  
  console.log('goods_id:', product.goods_id, typeof product.goods_id);
  console.log('goods_name:', product.goods_name);
  console.log('goods_number:', product.goods_number, typeof product.goods_number);
  console.log('goods_number as Number:', Number(product.goods_number));
  console.log('Check > 0:', Number(product.goods_number) > 0);
}
main();
