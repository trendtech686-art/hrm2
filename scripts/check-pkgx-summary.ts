import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  const products = await prisma.product.count({ where: { pkgxId: { not: null }, isDeleted: false } });
  const prices = await prisma.productPrice.count({ where: { product: { pkgxId: { not: null }, isDeleted: false } } });
  const withPrices = await prisma.product.count({ where: { pkgxId: { not: null }, prices: { some: {} }, isDeleted: false } });
  console.log({ products, prices, withPrices });
}

main()
  .catch(err => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
