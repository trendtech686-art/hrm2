import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  const price = await prisma.pkgxPriceMapping.findMany({ where: { isActive: true } });
  const cats = await prisma.pkgxCategoryMapping.count({ where: { isActive: true } });
  const brands = await prisma.pkgxBrandMapping.count({ where: { isActive: true } });
  console.log({ price, cats, brands });
}

main()
  .catch(err => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
