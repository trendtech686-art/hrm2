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
  
  // Output counts (console removed)
  // Sample data  
  const sample = await prisma.province.findMany({ take: 5, orderBy: { name: 'asc' } });
  // Process sample (console removed)
  
  await prisma.$disconnect();
}

check();
