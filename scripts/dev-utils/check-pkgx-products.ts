import { config } from 'dotenv';
config();

import { prisma } from './lib/prisma';

async function main() {
  try {
    const count = await prisma.pkgxProduct.count();
    console.log('PkgxProduct count:', count);
    
    if (count > 0) {
      const sample = await prisma.pkgxProduct.findFirst({
        select: { id: true, name: true, syncedAt: true }
      });
      console.log('Sample product:', sample);
    } else {
      console.log('No products in database!');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
