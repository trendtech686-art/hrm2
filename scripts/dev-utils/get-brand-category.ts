import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function main() {
  const brand = await prisma.brand.findFirst({
    select: { systemId: true, name: true }
  });
  console.log('First brand:', brand);
  
  const category = await prisma.category.findFirst({
    select: { systemId: true, name: true }
  });
  console.log('First category:', category);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
