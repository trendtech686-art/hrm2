import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function checkProduct() {
  try {
    const p = await prisma.product.findFirst({
      where: { id: 'test8' },
      select: { 
        systemId: true, 
        id: true, 
        costPrice: true, 
        lastPurchasePrice: true, 
        sellerNote: true,
        seoTrendtech: true,
      }
    });
    
    console.log('test8 product:', JSON.stringify(p, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProduct();
