import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  // Test tạo ProductInventory trực tiếp
  const product = await prisma.product.findFirst({
    where: { pkgxId: 8040 },
  });
  
  if (!product) {
    console.log('Product 8040 not found');
    return;
  }
  
  console.log('Product:', product.systemId, product.name);
  
  const defaultBranch = await prisma.branch.findFirst({
    where: { isDefault: true },
  });
  
  if (!defaultBranch) {
    console.log('No default branch!');
    return;
  }
  
  console.log('Default branch:', defaultBranch.systemId, defaultBranch.name);
  
  // Tạo inventory
  const inventory = await prisma.productInventory.upsert({
    where: {
      productId_branchId: {
        productId: product.systemId,
        branchId: defaultBranch.systemId,
      },
    },
    create: {
      productId: product.systemId,
      branchId: defaultBranch.systemId,
      onHand: 10000,
      committed: 0,
      inTransit: 0,
    },
    update: {
      onHand: 10000,
    },
  });
  
  console.log('Inventory created:', inventory);
  
  // Verify
  const count = await prisma.productInventory.count();
  console.log('Total ProductInventory:', count);
  
  await prisma.$disconnect();
}

main();
