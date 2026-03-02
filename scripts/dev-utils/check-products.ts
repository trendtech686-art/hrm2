import 'dotenv/config';
import { prisma } from './lib/prisma.js';



async function checkProducts() {
  const totalCount = await prisma.product.count();
  const activeCount = await prisma.product.count({ where: { isDeleted: false } });
  const pkgxLinkedCount = await prisma.product.count({ where: { pkgxId: { not: null } } });
  const inactiveStatusCount = await prisma.product.count({ where: { status: 'INACTIVE' } });
  
  console.log('📊 Product Statistics:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Total products:           ${totalCount}`);
  console.log(`Active (not deleted):     ${activeCount}`);
  console.log(`Linked to PKGX:          ${pkgxLinkedCount}`);
  console.log(`Status = INACTIVE:        ${inactiveStatusCount}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (pkgxLinkedCount > 0) {
    console.log('\n📦 Sample PKGX products:');
    const samples = await prisma.product.findMany({
      where: { pkgxId: { not: null } },
      take: 5,
      select: { id: true, name: true, pkgxId: true, pkgxSku: true, status: true, isDeleted: true }
    });
    console.table(samples);
  }
  
  await prisma.$disconnect();
}

checkProducts().catch(console.error);
