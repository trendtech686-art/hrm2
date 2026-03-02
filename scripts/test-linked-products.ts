/**
 * Test linked products query
 * Run: npx tsx scripts/test-linked-products.ts
 */

import { prisma } from '../lib/prisma'

async function main() {
  console.log('Testing linked products query...\n')
  
  // Count all products
  const totalProducts = await prisma.product.count({
    where: { isDeleted: false }
  })
  console.log(`Total products (not deleted): ${totalProducts}`)
  
  // Count linked products
  const linkedProducts = await prisma.product.count({
    where: {
      isDeleted: false,
      pkgxId: { not: null }
    }
  })
  console.log(`Linked products (pkgxId not null): ${linkedProducts}`)
  
  // Get sample linked products
  const samples = await prisma.product.findMany({
    where: {
      isDeleted: false,
      pkgxId: { not: null }
    },
    select: {
      systemId: true,
      id: true,
      name: true,
      pkgxId: true,
    },
    take: 5
  })
  
  console.log('\nSample linked products:')
  samples.forEach((p, i) => {
    console.log(`${i + 1}. [${p.pkgxId}] ${p.id} - ${p.name}`)
  })
  
  // Check if pkgxId is stored as string or number
  if (samples.length > 0) {
    console.log('\npkgxId type:', typeof samples[0].pkgxId)
    console.log('pkgxId value:', samples[0].pkgxId)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
