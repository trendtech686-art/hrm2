import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function checkProducts() {
  try {
    const totalCount = await prisma.product.count();
    console.log('📊 Total products:', totalCount);
    
    const activeCount = await prisma.product.count({ where: { isDeleted: false } });
    console.log('✅ Active products:', activeCount);
    
    const pkgxLinked = await prisma.product.count({ where: { pkgxId: { not: null } } });
    console.log('🔗 PKGX linked:', pkgxLinked);
    
    console.log('\n📦 Sample products:');
    const samples = await prisma.product.findMany({
      take: 5,
      select: { id: true, name: true, pkgxId: true, status: true, isDeleted: true }
    });
    console.table(samples);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
