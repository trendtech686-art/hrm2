/**
 * Check stock history for specific product
 */
import { config } from 'dotenv';
config({ path: '.env' });

import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const productId = process.argv[2] || 'ZP8';
  
  const product = await prisma.product.findFirst({ 
    where: { id: productId }, 
    select: { systemId: true, id: true, name: true } 
  });
  
  if (!product) { 
    console.log('Product not found:', productId); 
    return; 
  }
  
  console.log(`\nStock History for ${product.id} - ${product.name}:`);
  
  const history = await prisma.stockHistory.findMany({
    where: { 
      productId: product.systemId, 
      branch: { name: 'Chi nhánh Mặc Định' } 
    },
    orderBy: { createdAt: 'asc' },
    select: { 
      createdAt: true, 
      action: true, 
      quantityChange: true, 
      newStockLevel: true, 
      documentId: true 
    }
  });
  
  console.table(history.map(h => ({
    date: h.createdAt.toISOString().split('T')[0],
    action: h.action.substring(0, 20),
    change: h.quantityChange,
    newLevel: h.newStockLevel,
    doc: h.documentId
  })));
  
  // Calculate expected stock from history
  let expectedStock = 0;
  for (const h of history) {
    expectedStock += h.quantityChange;
  }
  console.log('\nExpected stock from sum of changes:', expectedStock);
  
  console.log('\nProductInventory:');
  const inv = await prisma.productInventory.findFirst({
    where: { 
      productId: product.systemId, 
      branch: { name: 'Chi nhánh Mặc Định' } 
    }
  });
  console.log('onHand:', inv?.onHand);
  console.log('committed:', inv?.committed);
  console.log('inTransit:', inv?.inTransit);
  console.log('inDelivery:', inv?.inDelivery);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
