import { config } from 'dotenv';
config();

import { prisma } from './lib/prisma';

async function test() {
  try {
    const count = await prisma.product.count();
    console.log('Product count:', count);
    
    if (count > 0) {
      const product = await prisma.product.findFirst({
        include: {
          brand: true,
          productInventory: true,
          prices: {
            include: {
              pricingPolicy: true,
            },
          },
          productCategories: {
            include: {
              category: true,
            },
          },
        },
      });
      console.log('Sample product:', JSON.stringify(product, null, 2));
    } else {
      console.log('No products found - this might be expected after DB reset');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
