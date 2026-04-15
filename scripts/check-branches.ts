import { prisma } from '../lib/prisma';

async function main() {
  const branches = await prisma.branch.findMany({
    select: { systemId: true, id: true, name: true, isDeleted: true }
  });
  console.log('=== ALL BRANCHES IN DATABASE ===');
  console.log(JSON.stringify(branches, null, 2));
  console.log('================================');
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
