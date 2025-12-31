import { config } from 'dotenv';
config();

import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function check() {
  const pCount = await prisma.province.count();
  const dCount = await prisma.district.count();
  const wCount = await prisma.ward.count();
  
  console.log('📊 Database counts:');
  console.log('   Provinces:', pCount);
  console.log('   Districts:', dCount);
  console.log('   Wards:', wCount);
  
  // Sample data
  const sample = await prisma.province.findMany({ take: 5, orderBy: { name: 'asc' } });
  console.log('\n📋 Sample provinces:');
  sample.forEach(p => console.log(`   - ${p.id}: ${p.name}`));
  
  await prisma.$disconnect();
}

check();
