import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  // 1. Current payroll templates
  const setting = await prisma.setting.findFirst({ where: { key: 'payroll-templates' } });
  const templates = (setting?.value as unknown[]) || [];
  console.log('=== PAYROLL TEMPLATES ===');
  for (const t of templates as Array<{ id: string; name: string; componentSystemIds: string[] }>) {
    console.log(`\n${t.id}: ${t.name}`);
    console.log(`  componentSystemIds: [${t.componentSystemIds.join(', ')}]`);
  }

  // 2. Current salary components
  const components = await prisma.settingsData.findMany({
    where: { type: { in: ['salary_component', 'earning', 'deduction', 'contribution'] } },
    select: { systemId: true, id: true, name: true },
    orderBy: { createdAt: 'asc' },
  });
  console.log('\n=== SALARY COMPONENTS ===');
  for (const c of components) {
    console.log(`  ${c.systemId} | ${c.id} | ${c.name}`);
  }

  await prisma.$disconnect();
}

main();
