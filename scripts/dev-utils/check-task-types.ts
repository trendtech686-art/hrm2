import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Check all tasks settings
  const allTasksSettings = await prisma.setting.findMany({
    where: { group: 'tasks' }
  });
  
  console.log('All Tasks Settings in DB:');
  for (const s of allTasksSettings) {
    console.log(`\n--- ${s.key} ---`);
    console.log(JSON.stringify(s.value, null, 2));
  }
  
  if (allTasksSettings.length === 0) {
    console.log('No tasks settings found!');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
