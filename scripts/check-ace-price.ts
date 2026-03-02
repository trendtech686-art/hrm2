import { prisma } from '../lib/prisma';

async function main() {
  // Check PkgxProduct cache for ace_price
  console.log('=== PKGX Product Cache (First 3) ===');
  const pkgxProducts = await prisma.pkgxProduct.findMany({
    select: { 
      id: true, 
      name: true, 
      shopPrice: true, 
      acePrice: true, 
      marketPrice: true,
      partnerPrice: true,
      dealPrice: true,
    },
    take: 3,
  });
  
  if (pkgxProducts.length > 0) {
    for (const p of pkgxProducts) {
      console.log(`\n${p.name} (id: ${p.id})`);
      console.log(`  shop_price: ${p.shopPrice}`);
      console.log(`  market_price: ${p.marketPrice}`);
      console.log(`  partner_price: ${p.partnerPrice}`);
      console.log(`  ace_price: ${p.acePrice}`);
      console.log(`  deal_price: ${p.dealPrice}`);
    }
  } else {
    console.log('No products found in PkgxProduct cache');
  }
  
  // Check products with pkgxId
  console.log('\n=== HRM Products with PKGX link ===');
  const products = await prisma.product.findMany({
    where: { pkgxId: { not: null } },
    select: { systemId: true, name: true, pkgxId: true },
    take: 5,
  });
  
  for (const p of products) {
    console.log(`\n${p.name} (pkgxId: ${p.pkgxId})`);
    
    // Get prices
    const prices = await prisma.productPrice.findMany({
      where: { productId: p.systemId },
      include: { pricingPolicy: true },
    });
    
    for (const pr of prices) {
      console.log(`  ${pr.pricingPolicy?.name || pr.pricingPolicyId}: ${pr.price}`);
    }
  }
  
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
