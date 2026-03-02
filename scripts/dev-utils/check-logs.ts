import { prisma } from './lib/prisma';

async function main() {
  const count = await prisma.pkgxSyncLog.count();
  console.log('Log count:', count);
  
  const logs = await prisma.pkgxSyncLog.findMany({ take: 5 });
  console.log('Sample logs:', logs);
}

main().finally(() => prisma.$disconnect());
