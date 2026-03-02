import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  const branch = await prisma.branch.findFirst({ where: { isDefault: true } });
  console.log('Default branch:', branch);
  
  // Check all branches
  const allBranches = await prisma.branch.findMany();
  console.log('\nAll branches:', allBranches.length);
  allBranches.forEach(b => console.log(`  - ${b.name} (isDefault: ${b.isDefault})`));
  
  await prisma.$disconnect();
}
main();
