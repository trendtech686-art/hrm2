import { config } from 'dotenv';
config();

import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const provinceCount = await prisma.province.count();
  const districtCount = await prisma.district.count();
  const wardCount = await prisma.ward.count();
  
  console.log('Province count:', provinceCount);
  console.log('District count:', districtCount);
  console.log('Ward count:', wardCount);
  
  if (provinceCount > 0) {
    const provinces = await prisma.province.findMany({ take: 5 });
    console.log('\nSample provinces:', provinces.map(p => `${p.id} - ${p.name}`));
  }
  
  await prisma.$disconnect();
}

main();
