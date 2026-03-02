import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const settings = await prisma.setting.findMany({ where: { group: 'tasks' } });
  console.log('Found', settings.length, 'tasks settings:');
  settings.forEach(s => console.log(' -', s.key, ':', JSON.stringify(s.value).substring(0, 100) + '...'));
}

main().finally(() => prisma.$disconnect());
