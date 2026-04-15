import { config } from 'dotenv'
config()

async function check() {
  const { prisma } = await import('../lib/prisma')
  const c1 = await prisma.customer.count({ where: { isDeleted: false, currentDebt: { not: 0 } } })
  const c2 = await prisma.customer.count({ where: { isDeleted: false, currentDebt: { gt: 0 } } })
  const c3 = await prisma.customer.count({ where: { isDeleted: false, currentDebt: { lt: 0 } } })
  const r = await prisma.$queryRaw`SELECT COUNT(*) as c FROM customers WHERE "isDeleted"=false AND abs("currentDebt") > 0.01` as { c: bigint }[]
  const samples = await prisma.$queryRaw`SELECT "systemId","name","currentDebt"::text FROM customers WHERE "isDeleted"=false AND "currentDebt" IS NOT NULL AND "currentDebt" != 0 ORDER BY abs("currentDebt") ASC LIMIT 10`
  console.log('not0=' + c1, 'gt0=' + c2, 'lt0=' + c3, 'abs>0.01=' + Number(r[0].c))
  console.log('Sample customers with debt:', JSON.stringify(samples, null, 2))
  await prisma.$disconnect()
}
check()
