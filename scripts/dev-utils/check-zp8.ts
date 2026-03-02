import { prisma } from './lib/prisma';

async function main() {
  // Check ZP8 product
  const product = await prisma.product.findFirst({
    where: { id: 'ZP8' },
    select: { systemId: true, id: true, name: true, thumbnailImage: true, imageUrl: true }
  });
  console.log('ZP8 Product:', JSON.stringify(product, null, 2));

  // Check files for ZP8
  if (product?.systemId) {
    const files = await prisma.file.findMany({
      where: { entityId: product.systemId },
      select: { systemId: true, filename: true, documentType: true, status: true, filepath: true }
    });
    console.log('ZP8 Files:', JSON.stringify(files, null, 2));
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); });
