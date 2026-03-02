import 'dotenv/config';
import { prisma } from './lib/prisma';

const m = await prisma.pkgxPriceMapping.findFirst();
console.log('priceType:', m?.priceType);
await prisma.$disconnect();
