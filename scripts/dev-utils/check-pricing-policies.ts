import { prisma } from './lib/prisma'

async function main() {
  const policies = await prisma.pricingPolicy.findMany({
    where: { type: 'Bán hàng' },
    select: { systemId: true, name: true, isDefault: true }
  })
  console.log('Pricing Policies (Bán hàng):')
  policies.forEach(p => {
    console.log(`  ${p.systemId}: ${p.name} ${p.isDefault ? '(default)' : ''}`)
  })
  
  // Check if ZP8 product has prices
  const product = await prisma.product.findFirst({
    where: { id: 'ZP8' },
    include: { prices: true }
  })
  console.log('\nProduct ZP8 prices:')
  product?.prices.forEach(p => {
    console.log(`  ${p.pricingPolicyId}: ${p.price}`)
  })
}

main().finally(() => prisma.$disconnect())
