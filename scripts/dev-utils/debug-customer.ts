import { prisma } from './lib/prisma';

async function main() {
  const count = await prisma.customer.count();
  console.log('Customer count:', count);
  
  if (count > 0) {
    const customers = await prisma.customer.findMany({
      take: 3,
      select: {
        systemId: true,
        id: true,
        name: true,
        status: true,
        addresses: true
      }
    });
    
    console.log('\nSample customers:');
    customers.forEach(c => {
      console.log('---');
      console.log('systemId:', c.systemId);
      console.log('id:', c.id);
      console.log('name:', c.name);
      console.log('status:', c.status, '(type:', typeof c.status, ')');
      console.log('addresses count:', c.addresses?.length ?? 0);
      if (c.addresses && c.addresses.length > 0) {
        console.log('First address:', JSON.stringify(c.addresses[0], null, 2));
      }
    });
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
