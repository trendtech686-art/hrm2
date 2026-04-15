import { config } from 'dotenv'
config()

async function check() {
  const { prisma } = await import('../lib/prisma')
  
  // Simulate exact stats API query
  const customersWithDebt = await prisma.customer.count({
    where: { isDeleted: false, currentDebt: { not: 0 } },
  })
  const totalDebtAgg = await prisma.customer.aggregate({
    where: { isDeleted: false },
    _sum: { currentDebt: true },
  })
  
  console.log('customersWithDebt:', customersWithDebt)
  console.log('totalDebtAmount:', Number(totalDebtAgg._sum?.currentDebt ?? 0))
  
  // Also check what the old raw SQL would return
  const rawOld = await prisma.$queryRaw<Array<{count: bigint}>>`
    SELECT COUNT(*) as count FROM customers 
    WHERE "isDeleted" = false AND "currentDebt" IS NOT NULL AND "currentDebt" != 0
  `
  console.log('old raw SQL count:', Number(rawOld[0].count))
  
  await prisma.$disconnect()
}
check()
