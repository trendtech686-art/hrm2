import { prisma } from '../lib/prisma';

async function main() {
  // Check GT7 product
  const product = await prisma.product.findFirst({
    where: { name: { contains: 'GT7' } },
    select: { systemId: true, name: true, pkgxId: true }
  });
  
  console.log('GT7 Product:', JSON.stringify(product, null, 2));
  
  if (product) {
    // Get prices
    const prices = await prisma.productPrice.findMany({
      where: { productId: product.systemId },
      include: { pricingPolicy: true }
    });
    
    console.log('\nPrices:');
    for (const p of prices) {
      console.log(`  ${p.pricingPolicy?.name || p.pricingPolicyId}: ${p.price}`);
    }
  }
  
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
