import { config } from 'dotenv';
config();

import { prisma } from './lib/prisma';

async function test() {
  try {
    // Test 1: Simple query
    console.log('Test 1: Simple query...');
    const p1 = await prisma.product.findMany({ take: 1 });
    console.log('✓ Simple query OK, count:', p1.length);
    
    // Test 2: With brand
    console.log('Test 2: With brand...');
    const p2 = await prisma.product.findMany({ take: 1, include: { brand: true } });
    console.log('✓ With brand OK');
    
    // Test 3: With productInventory
    console.log('Test 3: With productInventory...');
    const p3 = await prisma.product.findMany({ take: 1, include: { productInventory: true } });
    console.log('✓ With productInventory OK');
    
    // Test 4: With prices only
    console.log('Test 4: With prices...');
    const p4 = await prisma.product.findMany({ take: 1, include: { prices: true } });
    console.log('✓ With prices OK');
    
    // Test 5: With prices + pricingPolicy
    console.log('Test 5: With prices + pricingPolicy...');
    const p5 = await prisma.product.findMany({ take: 1, include: { prices: { include: { pricingPolicy: true } } } });
    console.log('✓ With pricingPolicy OK');
    
    // Test 6: With productCategories
    console.log('Test 6: With productCategories...');
    const p6 = await prisma.product.findMany({ take: 1, include: { productCategories: true } });
    console.log('✓ With productCategories OK');
    
    // Test 7: With productCategories + category
    console.log('Test 7: With productCategories + category...');
    const p7 = await prisma.product.findMany({ take: 1, include: { productCategories: { include: { category: true } } } });
    console.log('✓ With category OK');
    
    console.log('\n✓ ALL TESTS PASSED');
    
  } catch (error: unknown) {
    const e = error as Error;
    console.error('✗ FAILED at current test');
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
