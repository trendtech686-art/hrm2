import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function main() {
  // Find first PKGX product
  const pkgxProd = await prisma.product.findFirst({
    where: { pkgxId: { not: null } },
    select: { systemId: true, id: true, name: true, categorySystemIds: true, brandId: true }
  });
  
  console.log('Current product:', pkgxProd);
  
  if (!pkgxProd) {
    console.log('No PKGX product found');
    return;
  }
  
  // Update with test category and brand that have PKGX mapping
  const updated = await prisma.product.update({
    where: { systemId: pkgxProd.systemId },
    data: { 
      categorySystemIds: ['CATEGORY000017'], // Sỉ ốp điện thoại (mapped to PKGX 297)
      brandId: 'BRAND000005' // Hoco (mapped to PKGX 15)
    }
  });
  
  console.log('\nUpdated:');
  console.log('- categorySystemIds:', updated.categorySystemIds);
  console.log('- brandId:', updated.brandId);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
