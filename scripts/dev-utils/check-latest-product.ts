import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  // Lấy sản phẩm mới nhất
  const product = await prisma.product.findFirst({
    orderBy: { createdAt: 'desc' },
    include: {
      prices: true,
      productInventory: true
    }
  });
  
  if (!product) {
    console.log('Không có sản phẩm nào!');
    return;
  }
  
  console.log('Product:', product.name);
  console.log('pkgxId:', product.pkgxId);
  console.log('Prices:', product.prices.length);
  product.prices.forEach(p => {
    console.log('  policyId:', p.pricingPolicyId, '| price:', p.price);
  });
  console.log('Inventory:', product.productInventory.length);
  product.productInventory.forEach(i => {
    console.log('  branchId:', i.branchId, '| onHand:', i.onHand);
  });
  
  await prisma.$disconnect();
}
main();
