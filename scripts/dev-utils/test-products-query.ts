import { config } from 'dotenv';
config();

import { prisma } from './lib/prisma';

async function test() {
  try {
    // Test exact query from /api/products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { isDeleted: false },
        skip: 0,
        take: 50,
        orderBy: { createdAt: 'desc' },
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
      }),
      prisma.product.count({ where: { isDeleted: false } }),
    ]);
    
    console.log('Products found:', products.length);
    console.log('Total count:', total);
    console.log('SUCCESS - No errors');
  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
