import { prisma } from './lib/prisma'

async function main() {
  // Find customer by ID KH004102
  const customer = await prisma.customer.findFirst({
    where: { id: 'KH004102' },
  })
  
  console.log('Customer KH004102:')
  console.log(JSON.stringify(customer, null, 2))
  
  // Also find some customers that have phone
  const withPhone = await prisma.customer.findMany({
    where: { phone: { not: null } },
    take: 5,
    select: { id: true, name: true, phone: true }
  })
  console.log('\nCustomers with phone:')
  console.log(JSON.stringify(withPhone, null, 2))
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))
