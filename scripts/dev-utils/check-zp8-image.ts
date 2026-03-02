import { prisma } from './lib/prisma';

async function main() {
  // Check ZP8 product
  const product = await prisma.product.findFirst({
    where: { id: 'ZP8' },
    select: {
      systemId: true,
      id: true,
      name: true,
      imageUrl: true,
    }
  });
  
  console.log('ZP8 Product:', JSON.stringify(product, null, 2));
  
  if (product) {
    // Check uploaded files for this product
    const files = await prisma.file.findMany({
      where: {
        OR: [
          { entityType: 'product', entityId: product.systemId },
          { metadata: { path: ['productSystemId'], equals: product.systemId } }
        ]
      }
    });
    
    console.log('\nUploaded files:', files.length);
    files.forEach(f => {
      console.log(`  - ${f.documentName}: ${f.url}`);
    });
  }
}

main().then(() => process.exit(0)).catch(console.error);
