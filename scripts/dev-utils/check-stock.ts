import { prisma } from './lib/prisma'

async function main() {
  // Find a product with stock
  const inv = await prisma.productInventory.findFirst({
    where: { onHand: { gt: 0 } },
    include: { 
      branch: { select: { systemId: true, name: true } },
      product: { select: { systemId: true, id: true, name: true } }
    }
  })
  
  if (inv) {
    console.log('Product with stock:', inv.product.id, inv.product.name)
    console.log('Branch:', inv.branch.name, 'onHand:', inv.onHand)
    console.log('Product systemId:', inv.product.systemId)
  } else {
    console.log('No product with stock found')
  }
}

main().finally(() => prisma.$disconnect())
