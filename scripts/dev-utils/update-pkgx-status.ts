import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function updatePkgxProductsToActive() {
  const result = await prisma.product.updateMany({
    where: {
      pkgxId: { not: null },
      status: 'INACTIVE'
    },
    data: {
      status: 'ACTIVE'
    }
  });
  
  console.log(`✅ Updated ${result.count} PKGX products from INACTIVE to ACTIVE`);
  
  await prisma.$disconnect();
}

updatePkgxProductsToActive().catch(console.error);
