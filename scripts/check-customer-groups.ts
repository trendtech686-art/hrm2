import { prisma } from '../lib/prisma';

async function main() {
  console.log('Checking customer groups in database...\n');
  
  const groups = await prisma.customerSetting.findMany({
    where: { 
      type: 'customer-group', 
      isDeleted: false 
    },
    orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }],
  });

  console.log(`Found ${groups.length} customer groups:`);
  console.log(JSON.stringify(groups, null, 2));
  
  console.log('\n--- Checking all types ---');
  const allTypes = await prisma.customerSetting.groupBy({
    by: ['type'],
    where: { isDeleted: false },
    _count: true,
  });
  
  console.log('Types in database:');
  allTypes.forEach(t => {
    console.log(`  - ${t.type}: ${t._count} records`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  });
