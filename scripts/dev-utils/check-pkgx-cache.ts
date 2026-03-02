import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  const setting = await prisma.setting.findFirst({
    where: { key: 'settings', group: 'pkgx' },
    select: { value: true },
  });
  
  const data = setting?.value as Record<string, any> || {};
  const products = data.pkgxProducts || [];
  
  console.log('Total cached products:', products.length);
  
  // Find product 8040
  const prod8040 = products.find((p: any) => p.goods_id == 8040 || p.goods_id == '8040');
  
  if (prod8040) {
    console.log('\n=== Cached Product 8040 ===');
    console.log('goods_id:', prod8040.goods_id);
    console.log('goods_name:', prod8040.goods_name);
    console.log('goods_number:', prod8040.goods_number, 'TYPE:', typeof prod8040.goods_number);
    console.log('Number(goods_number):', Number(prod8040.goods_number));
    console.log('shop_price:', prod8040.shop_price);
    console.log('ace_price:', prod8040.ace_price);
    console.log('market_price:', prod8040.market_price);
    console.log('partner_price:', prod8040.partner_price);
  } else {
    console.log('Product 8040 NOT in cache');
  }
  
  await prisma.$disconnect();
}

main();
