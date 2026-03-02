import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  // Check một sản phẩm PKGX đã import
  const latestProduct = await prisma.product.findFirst({
    where: { pkgxId: { not: null } },
    orderBy: { createdAt: 'desc' },
    select: {
      systemId: true,
      name: true,
      pkgxId: true,
    },
  });
  
  if (!latestProduct) {
    console.log('No PKGX products found');
    await prisma.$disconnect();
    return;
  }
  
  console.log('Latest PKGX product:', latestProduct.name);
  console.log('  systemId:', latestProduct.systemId);
  console.log('  pkgxId:', latestProduct.pkgxId);
  
  // Check inventory
  const inventory = await prisma.productInventory.findMany({
    where: { productId: latestProduct.systemId },
    include: { branch: true },
  });
  console.log('\nProductInventory:', inventory.length);
  if (inventory.length > 0) {
    inventory.forEach(inv => {
      console.log(`  onHand: ${inv.onHand}, branch: ${inv.branch?.name}`);
    });
  } else {
    console.log('  => NO INVENTORY RECORDS');
  }
  
  // Check all ProductInventory in DB
  const totalInventory = await prisma.productInventory.count();
  console.log('\nTotal ProductInventory records in DB:', totalInventory);
  
  // Check if ANY product has inventory
  const productsWithInventory = await prisma.productInventory.findMany({
    take: 5,
    include: { product: { select: { name: true, pkgxId: true } }, branch: { select: { name: true } } },
  });
  console.log('\nSample ProductInventory:');
  productsWithInventory.forEach(inv => {
    console.log(`  ${inv.product?.name} - onHand: ${inv.onHand}, branch: ${inv.branch?.name}`);
  });
  
  await prisma.$disconnect();
}
main();
