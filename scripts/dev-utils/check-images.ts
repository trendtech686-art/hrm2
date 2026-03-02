import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function main() {
  // Check product files
  const files = await prisma.productFile.findMany({
    where: { productId: 'PROD609120' },
    select: { id: true, url: true, documentName: true, originalName: true }
  });
  console.log('Files for test8:', JSON.stringify(files, null, 2));
  
  // Check product object
  const product = await prisma.product.findUnique({
    where: { systemId: 'PROD609120' },
    select: { thumbnailImage: true, galleryImages: true, imageUrl: true }
  });
  console.log('\nProduct images:', JSON.stringify(product, null, 2));
}

main()
  .catch(e => { console.error(e); })
  .finally(() => prisma.$disconnect());
